from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import pandas as pd
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "rent_car"
}

class BookingRequest(BaseModel):
    vehicle_id: int
    customer_name: str
    email: str
    phone: str
    start_date: str
    end_date: str

def write_booking_log(message):
    with open("ai_booking_log.txt", "a", encoding="utf-8") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {message}\n")
        
@app.post("/ai/process-booking")
def process_booking(req: BookingRequest):
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        s_date = req.start_date.split('T')[0]
        e_date = req.end_date.split('T')[0]

        # 1. Recupero veicolo richiesto
        cursor.execute("SELECT * FROM vehicle WHERE id = %s", (req.vehicle_id,))
        target_v = cursor.fetchone()
        if not target_v:
            raise HTTPException(status_code=404, detail="Veicolo non trovato")

        # 2. Controllo disponibilità
        check_query = "SELECT * FROM reservation WHERE vehicle_id = %s AND %s < end_date AND %s > start_date"
        cursor.execute(check_query, (req.vehicle_id, s_date, e_date))
        
        if cursor.fetchone():
            # --- LOGICA ALTERNATIVE A STESSO PREZZO ---
            cursor.execute("SELECT * FROM vehicle")
            all_vehicles = cursor.fetchall()
            
            cursor.execute("SELECT vehicle_id FROM reservation WHERE %s < end_date AND %s > start_date", (s_date, e_date))
            booked_ids = [r['vehicle_id'] for r in cursor.fetchall()]
            
            # Recuperiamo il prezzo del veicolo target
            target_price = target_v.get('price_per_day') or target_v.get('pricePerDay') or 0
            
            suggestions = []
            for v in all_vehicles:
                v_id = v.get('id') or v.get('ID')
                v_price = v.get('price_per_day') or v.get('pricePerDay') or 0
                
                # Condizioni: ID diverso, Non prenotata, Stesso prezzo (o differenza minima di 5€)
                if v_id != req.vehicle_id and v_id not in booked_ids:
                    if abs(float(v_price) - float(target_price)) <= 5: 
                        suggestions.append(v)
                        if len(suggestions) == 3: break # Ora ne cerchiamo 3

            write_booking_log(f"OCCUPATA: {req.customer_name} cercava ID {req.vehicle_id} dal {s_date} al {e_date}. Proposte 3 alternative.")
            
            return {
                "status": "busy", 
                "message": "La macchina è già occupata. Ti proponiamo queste 3 alternative allo stesso prezzo:",
                "suggestions": suggestions
            }

        # 3. Gestione Utente (Se libera)
        cursor.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        user_res = cursor.fetchone()
        u_id = user_res['id'] if user_res else None
        
        if not u_id:
            cursor.execute("INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, 'elite_pass')", 
                           (req.customer_name, req.email, req.phone))
            u_id = cursor.lastrowid

        # 4. Calcolo Prezzo e Salvataggio
        d1, d2 = datetime.strptime(s_date, "%Y-%m-%d"), datetime.strptime(e_date, "%Y-%m-%d")
        total_days = max((d2 - d1).days, 1)
        total_price = float(target_price) * total_days

        cursor.execute("INSERT INTO reservation (vehicle_id, user_id, start_date, end_date, total_price) VALUES (%s, %s, %s, %s, %s)",
                       (req.vehicle_id, u_id, s_date, e_date, total_price))
        conn.commit()
        
        write_booking_log(f"SUCCESS: {req.customer_name} ha prenotato ID {req.vehicle_id} dal {s_date} al {e_date}.")
        return {"status": "success", "total_price": total_price}

    except Exception as e:
        print(f"ERRORE AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
