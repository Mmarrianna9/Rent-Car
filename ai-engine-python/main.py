import os
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from pydantic import BaseModel
import mysql.connector
from datetime import datetime
from typing import Optional

app = FastAPI()

# --- 1. CONFIGURAZIONE CORS E PREFLIGHT ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rent-car-frontend-52em.onrender.com"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.middleware("http")
async def handle_options(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "https://rent-car-frontend-52em.onrender.com"
        response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
    return await call_next(request)

# --- 2. CONFIGURAZIONE DATABASE (USANDO VARIABILI D'AMBIENTE) ---
# Importante: su Render, inserisci queste variabili nel pannello "Environment"
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "rent_car")
}

# --- 3. MODELLI E UTILITY ---
class BookingRequest(BaseModel):
    vehicle_id: int
    customer_name: str
    email: str
    phone: str
    start_date: str
    end_date: str

def write_booking_log(message):
    try:
        with open("ai_booking_log.txt", "a", encoding="utf-8") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] {message}\n")
    except Exception as e:
        print(f"Errore scrittura log: {e}")

def get_localized_description(vehicle: dict, lang: str) -> str:
    lang = (lang or "it").lower().split("-")[0].strip()
    if lang == "en" and vehicle.get("descrizione_en"):
        return vehicle["descrizione_en"]
    elif lang == "ro" and vehicle.get("descrizione_ro"):
        return vehicle["descrizione_ro"]
    elif lang == "ru" and vehicle.get("descrizione_ru"):
        return vehicle["descrizione_ru"]
    return vehicle.get("description") or ""

# --- 4. ROTTE ---
@app.get("/")
def home():
    return {"status": "online", "message": "Backend AI attivo"}

@app.get("/test")
def test_route():
    return {"status": "ok", "message": "Il server risponde correttamente!"}

@app.post("/ai/process-booking")
def process_booking(req: BookingRequest, accept_language: Optional[str] = Header(None)):
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True, buffered=True)

        clean_lang = accept_language.split(",")[0].split("-")[0].strip() if accept_language else "it"
        s_date = req.start_date.split('T')[0]
        e_date = req.end_date.split('T')[0]

        # Recupero veicolo
        cursor.execute("SELECT * FROM vehicle WHERE id = %s", (req.vehicle_id,))
        target_v = cursor.fetchone()
        if not target_v:
            raise HTTPException(status_code=404, detail="Veicolo non trovato")

        raw_price = target_v.get('price_per_day') or target_v.get('pricePerDay') or 0
        target_price = float(raw_price)

        # Controllo disponibilità
        check_query = "SELECT * FROM reservation WHERE vehicle_id = %s AND %s < end_date AND %s > start_date"
        cursor.execute(check_query, (req.vehicle_id, s_date, e_date))
        is_busy = cursor.fetchone()
        
        if is_busy:
            # Logica AI per suggerimenti
            cursor.execute("SELECT vehicle_id FROM reservation WHERE %s < end_date AND %s > start_date", (s_date, e_date))
            booked_rows = cursor.fetchall()
            booked_ids = [r['vehicle_id'] for r in booked_rows]
            
            cursor.execute("SELECT * FROM vehicle")
            all_vehicles = cursor.fetchall()
            
            suggestions = []
            backup_suggestions = []
            
            for v in all_vehicles:
                v_id = v.get('id') or v.get('ID')
                v_price = float(v.get('price_per_day') or v.get('pricePerDay') or 0)
                
                if v_id == req.vehicle_id or v_id in booked_ids:
                    continue
                
                suggestion_item = {
                    "id": v_id, "brand": v.get('brand'), "model": v.get('model'),
                    "pricePerDay": v_price, "photoExternal": v.get('photo_external'),
                    "fuelType": v.get('fuel_type'), "transmission": v.get('transmission'),
                    "description": get_localized_description(v, clean_lang)
                }
                
                if abs(v_price - target_price) <= 5: 
                    suggestions.append(suggestion_item)
                else:
                    backup_suggestions.append(suggestion_item)
                
                if len(suggestions) == 3: break 

            if len(suggestions) == 0: suggestions = backup_suggestions[:3]
            
            write_booking_log(f"OCCUPATA: {req.customer_name} cercava ID {req.vehicle_id}. Proposte {len(suggestions)} alternative.")
            return {"status": "busy", "message": "Auto occupata, ecco alternative:", "suggestions": suggestions}

        # Gestione Utente e Prenotazione
        cursor.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        user_res = cursor.fetchone()
        u_id = user_res['id'] if user_res else None
        
        if not u_id:
            cursor.execute("INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, 'elite_pass')", 
                           (req.customer_name, req.email, req.phone))
            u_id = cursor.lastrowid

        d1 = datetime.strptime(s_date, "%Y-%m-%d")
        d2 = datetime.strptime(e_date, "%Y-%m-%d")
        total_days = max((d2 - d1).days, 1)
        total_price = target_price * total_days

        cursor.execute("INSERT INTO reservation (vehicle_id, user_id, start_date, end_date, total_price) VALUES (%s, %s, %s, %s, %s)",
                       (req.vehicle_id, u_id, s_date, e_date, total_price))
        conn.commit()
        
        write_booking_log(f"SUCCESS: {req.customer_name} ha prenotato ID {req.vehicle_id}. Totale: {total_price}€")
        return {"status": "success", "total_price": total_price}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()