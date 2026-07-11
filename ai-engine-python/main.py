from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import mysql.connector

app = FastAPI()

# Configurazione CORS super permissiva
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Questa rotta intercetta TUTTE le richieste OPTIONS prima di qualsiasi altra cosa
@app.middleware("http")
async def catch_all_options(request: Request, call_next):
    if request.method == "OPTIONS":
        return Response(status_code=200, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        })
    return await call_next(request)

# ... (qui tieni il resto del tuo codice, le tue rotte POST, ecc.)