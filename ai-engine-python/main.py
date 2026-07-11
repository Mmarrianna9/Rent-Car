from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# Definizione del modello dati per la prenotazione
class BookingRequest(BaseModel):
    vehicle_id: int
    customer_name: str
    email: str
    phone: str
    start_date: datetime
    end_date: datetime

app = FastAPI()

# Configurazione CORS - ESSENZIALE per permettere al frontend di comunicare
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rent-car-frontend-52em.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotta di base per testare se il server è attivo
@app.get("/")
def read_root():
    return {"status": "online", "message": "Il backend è pronto per ricevere prenotazioni."}

# Rotta per il processo di prenotazione
@app.post("/ai/process-booking")
def process_booking(booking: BookingRequest):
    try:
        # Qui aggiungerai la logica del tuo motore AI
        print(f"Ricevuta prenotazione da: {booking.customer_name}")
        return {
            "status": "success", 
            "message": "Prenotazione elaborata correttamente",
            "details": booking
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Rotta di debug per vedere le rotte caricate (utile per capire il 404)
@app.get("/debug/routes")
def get_routes():
    return {"routes": [route.path for route in app.routes]}