from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import pandas as pd
from datetime import datetime

app = FastAPI()

# --- CONFIGURAZIONE CORS ---
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

# Modello dati aggiornato per combaciare con il nuovo form React
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

@app.get("/")
def home():
    return {"status": "online", "message": "AI Engine Elite Rent pronto"}

@app.post("/ai/process-booking")
def process_booking(req: BookingRequest):
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # 1. RECUPERA DATI VEICOLO
        cursor.execute("SELECT * FROM vehicle WHERE id = %s", (req.vehicle_id,))
        target_vehicle = cursor.fetchone()
        
        if not target_vehicle:
            raise HTTPException(status_code=404, detail="Veicolo non trovato")

        # 2. CONTROLLO DISPONIBILITÀ REALE (Sovrapposizione date)
        # Una prenotazione si sovrappone se: (Inizio1 <= Fine2) AND (Fine1 >= Inizio2)
        check_query = """
            SELECT * FROM reservation 
            WHERE vehicle_id = %s 
            AND NOT (end_date < %s OR start_date > %s)
        """
        cursor.execute(check_query, (req.vehicle_id, req.start_date, req.end_date))
        
        if cursor.fetchone():
            # AI SUGGESTION: Cerca auto simili libere in quel periodo
            df = pd.read_sql("SELECT * FROM vehicle", conn)
            fuel = target_vehicle.get('fuel_type', 'Diesel')
            
            # Escludiamo le auto già occupate in quelle date specifiche
            cursor.execute("SELECT vehicle_id FROM reservation WHERE NOT (end_date < %s OR start_date > %s)", 
                           (req.start_date, req.end_date))
            booked_ids = [r['vehicle_id'] for r in cursor.fetchall()]
            
            suggestions = df[
                (df['fuel_type'] == fuel) & 
                (~df['id'].isin(booked_ids)) & 
                (df['id'] != req.vehicle_id)
            ].head(2)

            write_booking_log(f"OCCUPATA: {req.customer_name} ({req.email}) cercava ID {req.vehicle_id} dal {req.start_date} al {req.end_date}.")
            
            return {
                "status": "busy", 
                "suggestions": suggestions.to_dict(orient='records')
            }

        # 3. GESTIONE/REGISTRAZIONE UTENTE
        cursor.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        user = cursor.fetchone()
        
        if not user:
            # Se l'utente non esiste, lo creiamo (registrazione automatica)
            cursor.execute(
                "INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, 'elite_pass')", 
                (req.customer_name, req.email, req.phone)
            )
            user_id = cursor.lastrowid
        else:
            user_id = user['id']

        # 4. CALCOLO PREZZO E SALVATAGGIO PRENOTAZIONE
        d1 = datetime.strptime(req.start_date, "%Y-%m-%d")
        d2 = datetime.strptime(req.end_date, "%Y-%m-%d")
        total_days = (d2 - d1).days
        if total_days <= 0: total_days = 1 # Minimo 1 giorno
        
        daily_rate = target_vehicle.get('price_per_day') or target_vehicle.get('pricePerDay') or 50.0
        total_price = float(daily_rate) * total_days

        query = """
            INSERT INTO reservation (vehicle_id, user_id, start_date, end_date, total_price) 
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (req.vehicle_id, user_id, req.start_date, req.end_date, total_price))
        conn.commit()
        
        write_booking_log(f"SUCCESS: {req.customer_name} ha prenotato ID {req.vehicle_id} per {total_days} giorni. Totale: {total_price}€")
        
        return {
            "status": "success", 
            "total_price": total_price
        }

    except Exception as e:
        print(f"Errore: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            conn.close()