import os
from fastapi import FastAPI, HTTPException, Header, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from datetime import datetime
from typing import Optional

app = FastAPI()

# 1. CORS - Mantenuto come lo avevi, è corretto per evitare preflight 404
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# 2. Configurazione Database
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
    "port": int(os.getenv("DB_PORT", 17997)),
    "ssl_ca": "/etc/secrets/ca.pem",
    "ssl_verify_cert": True
}

class BookingRequest(BaseModel):
    vehicle_id: int
    customer_name: str
    email: str
    phone: str
    start_date: str
    end_date: str

def get_localized_description(vehicle: dict, lang: str) -> str:
    lang = (lang or "it").lower().split("-")[0].strip()
    if lang == "en" and vehicle.get("descrizione_en"): return vehicle["descrizione_en"]
    if lang == "ro" and vehicle.get("descrizione_ro"): return vehicle["descrizione_ro"]
    if lang == "ru" and vehicle.get("descrizione_ru"): return vehicle["descrizione_ru"]
    return vehicle.get("description") or ""

@app.post("/ai/process-booking")
def process_booking(req: BookingRequest, accept_language: Optional[str] = Header(None)):
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True, buffered=True)
        
        # Pulizia dati
        clean_lang = accept_language.split(",")[0].split("-")[0].strip() if accept_language else "it"
        s_date = req.start_date.split('T')[0]
        e_date = req.end_date.split('T')[0]
        
        # SQL Corretto (senza interruzioni di riga)
        cursor.execute("SELECT * FROM vehicle WHERE id = %s", (req.vehicle_id,))
        target_v = cursor.fetchone()
        
        if not target_v:
            raise HTTPException(status_code=404, detail="Veicolo non trovato")

        target_price = float(target_v.get('price_per_day') or target_v.get('pricePerDay') or 0)
        
        # Verifica prenotazioni
        cursor.execute("SELECT * FROM reservation WHERE vehicle_id = %s AND %s < end_date AND %s > start_date", (req.vehicle_id, s_date, e_date))
        
        if cursor.fetchone():
            cursor.execute("SELECT * FROM vehicle WHERE id NOT IN (SELECT vehicle_id FROM reservation WHERE %s < end_date AND %s > start_date)", (s_date, e_date))
            all_vehicles = cursor.fetchall()
            suggestions = []
            for v in all_vehicles[:3]:
                suggestions.append({
                    "id": v.get('id') or v.get('ID'),
                    "brand": v.get('brand'),
                    "model": v.get('model'),
                    "pricePerDay": float(v.get('price_per_day') or v.get('pricePerDay') or 0),
                    "description": get_localized_description(v, clean_lang)
                })
            return {"status": "busy", "suggestions": suggestions}
        
        # Inserimento utente
        cursor.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        user_res = cursor.fetchone()
        u_id = user_res['id'] if user_res else None
        
        if not u_id:
            cursor.execute("INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, 'elite_pass')", (req.customer_name, req.email, req.phone))
            u_id = cursor.lastrowid
        
        # Calcolo prezzo e inserimento prenotazione
        days = max((datetime.strptime(e_date, "%Y-%m-%d") - datetime.strptime(s_date, "%Y-%m-%d")).days, 1)
        total_price = target_price * days
        
        cursor.execute("INSERT INTO reservation (vehicle_id, user_id, start_date, end_date, total_price) VALUES (%s, %s, %s, %s, %s)",
                       (req.vehicle_id, u_id, s_date, e_date, total_price))
        
        conn.commit()
        return {"status": "success", "total_price": total_price}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()