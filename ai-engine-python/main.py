from fastapi import FastAPI
import mysql.connector
import pandas as pd

app = FastAPI()

# Configurazione Database (Assicurati che coincida con Java)
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "rent_car"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.get("/")
def home():
    return {"message": "AI Engine is running"}

@app.get("/ai/suggest/{vehicle_id}")
def suggest_alternative(vehicle_id: int):
    conn = get_db_connection()
    # Carichiamo tutti i veicoli in un DataFrame Pandas per l'analisi
    df = pd.read_sql("SELECT * FROM vehicle", conn)
    conn.close()

    # Logica AI Semplice: Trova auto con lo stesso fuel_type
    target_vehicle = df[df['id'] == vehicle_id]
    
    if target_vehicle.empty:
        return {"error": "Veicolo non trovato"}

    fuel = target_vehicle.iloc[0]['fuel_type']
    
    # Suggerisci auto simili (stesso carburante) escludendo quella scelta
    suggestions = df[(df['fuel_type'] == fuel) & (df['id'] != vehicle_id)].head(3)

    return {
        "original_vehicle": target_vehicle.to_dict(orient='records')[0],
        "suggestions": suggestions.to_dict(orient='records')
    }