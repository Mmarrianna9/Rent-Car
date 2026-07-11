from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from datetime import datetime
from typing import Optional

app = FastAPI()

# Configurazione CORS per permettere al frontend React di comunicare con FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rent-car-frontend-52em.onrender.com"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",  # Inserisci la password se presente
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

# Funzione helper Python equivalente al metodo Java per localizzare la descrizione
def get_localized_description(vehicle: dict, lang: str) -> str:
    lang = (lang or "it").lower().split("-")[0].strip()
    if lang == "en" and vehicle.get("descrizione_en"):
        return vehicle["descrizione_en"]
    elif lang == "ro" and vehicle.get("descrizione_ro"):
        return vehicle["descrizione_ro"]
    elif lang == "ru" and vehicle.get("descrizione_ru"):
        return vehicle["descrizione_ru"]
    return vehicle.get("description") or ""

@app.post("/ai/process-booking")
def process_booking(req: BookingRequest, accept_language: Optional[str] = Header(None)):
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        # Usiamo buffered=True per evitare l'errore "Unread result found" di MySQL
        cursor = conn.cursor(dictionary=True, buffered=True)

        # Estraiamo la lingua dall'header (es. "en-US" diventa "en")
        clean_lang = accept_language.split(",")[0].split("-")[0].strip() if accept_language else "it"

        # Pulizia date (rimuove eventuale orario T00:00:00)
        s_date = req.start_date.split('T')[0]
        e_date = req.end_date.split('T')[0]

        # 1. Recupero veicolo richiesto
        cursor.execute("SELECT * FROM vehicle WHERE id = %s", (req.vehicle_id,))
        target_v = cursor.fetchone()
        
        if not target_v:
            raise HTTPException(status_code=404, detail="Veicolo non trovato")

        raw_price = target_v.get('price_per_day') or target_v.get('pricePerDay') or 0
        target_price = float(raw_price)

        # 2. Controllo disponibilità nel database
        check_query = "SELECT * FROM reservation WHERE vehicle_id = %s AND %s < end_date AND %s > start_date"
        cursor.execute(check_query, (req.vehicle_id, s_date, e_date))
        is_busy = cursor.fetchone()
        
        if is_busy:
            print("--- L'AUTO È OCCUPATA. AVVIO LOGICA ALTERNATIVE AI ---")
            
            # Recuperiamo tutti i veicoli già occupati in quelle date
            cursor.execute("SELECT vehicle_id FROM reservation WHERE %s < end_date AND %s > start_date", (s_date, e_date))
            booked_rows = cursor.fetchall()
            booked_ids = [r['vehicle_id'] for r in booked_rows]
            
            # Recuperiamo l'intera flotta per estrarre le alternative
            cursor.execute("SELECT * FROM vehicle")
            all_vehicles = cursor.fetchall()
            
            suggestions = []
            backup_suggestions = [] # Flotta di riserva se il filtro economico scarta troppo
            
            for v in all_vehicles:
                v_id = v.get('id') or v.get('ID')
                v_price_raw = v.get('price_per_day') or v.get('pricePerDay') or 0
                v_price = float(v_price_raw)
                
                # Salta l'auto di partenza o le vetture già prenotate in quel periodo
                if v_id == req.vehicle_id or v_id in booked_ids:
                    continue
                
                # Prepariamo la struttura normalizzata della proposta
                suggestion_item = {
                    "id": v_id,
                    "brand": v.get('brand'),
                    "model": v.get('model'),
                    "pricePerDay": v_price,
                    "photoExternal": v.get('photo_external'),
                    "fuelType": v.get('fuel_type'),
                    "transmission": v.get('transmission'),
                    "description": get_localized_description(v, clean_lang)
                }
                
                # Se la vettura ha una variazione di prezzo di massimo 5€, è un'ottima candidata
                if abs(v_price - target_price) <= 5: 
                    suggestions.append(suggestion_item)
                else:
                    backup_suggestions.append(suggestion_item)
                
                if len(suggestions) == 3: 
                    break 

            # SERRANDA DI SICUREZZA: Se non ci sono auto entro i 5€, riempiamo la lista con le prime disponibili libere
            if len(suggestions) == 0 and len(backup_suggestions) > 0:
                print("⚠️ Nessuna auto nel range di 5€. Carico le alternative disponibili come backup.")
                suggestions = backup_suggestions[:3]

            print(f"Inviando a React {len(suggestions)} alternative.")
            write_booking_log(f"OCCUPATA: {req.customer_name} cercava ID {req.vehicle_id} dal {s_date} al {e_date}. Proposte {len(suggestions)} alternative.")
            
            return {
                "status": "busy", 
                "message": "La macchina è già occupata. L'AI ti propone queste alternative:",
                "suggestions": suggestions
            }

        # 3. Gestione Utente (Se l'auto è libera)
        cursor.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        user_res = cursor.fetchone()
        u_id = user_res['id'] if user_res else None
        
        if not u_id:
            # Creazione utente guest se non esiste
            cursor.execute("INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, 'elite_pass')", 
                           (req.customer_name, req.email, req.phone))
            u_id = cursor.lastrowid

        # 4. Calcolo Prezzo Finale e Salvataggio Prenotazione
        d1 = datetime.strptime(s_date, "%Y-%m-%d")
        d2 = datetime.strptime(e_date, "%Y-%m-%d")
        total_days = max((d2 - d1).days, 1)
        total_price = target_price * total_days

        cursor.execute("INSERT INTO reservation (vehicle_id, user_id, start_date, end_date, total_price) VALUES (%s, %s, %s, %s, %s)",
                       (req.vehicle_id, u_id, s_date, e_date, total_price))
        conn.commit()
        
        write_booking_log(f"SUCCESS: {req.customer_name} ha prenotato ID {req.vehicle_id} dal {s_date} al {e_date}. Totale: {total_price}€")
        return {"status": "success", "total_price": total_price}

    except Exception as e:
        print(f"ERRORE AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()