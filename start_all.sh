#!/bin/bash

echo "🚀 Avvio dell'ecosistema Rent-Car su Git Bash..."
echo "--------------------------------------------------"

# 1. Avvio del Backend Spring Boot (Java) in una nuova finestra Git Bash
echo "☕ 1. Avvio Backend Java..."
start bash -c "cd rentcar-backend && ./mvnw spring-boot:run; exec bash"

# 2. Avvio del Frontend (React) in una nuova finestra Git Bash
echo "⚛️ 2. Avvio Frontend React..."
start bash -c "cd frontend-react && npm start; exec bash"

# 3. Avvio dell'Engine AI (Python) in una nuova finestra Git Bash
echo "🐍 3. Avvio AI Engine Python..."
# Entra, attiva l'ambiente virtuale di Windows da Git Bash e lancia lo script
start bash -c "cd ai-engine-python && source .venv/Scripts/activate && python main.py; exec bash"

echo "--------------------------------------------------"
echo "🎉 Finestre separate aperte con successo!"