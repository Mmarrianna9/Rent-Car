🚗 Applicazione Gestione Autonoleggio (Multi-Language)

Benvenuti nel repository ufficiale dell'Applicazione Autonoleggio, una piattaforma moderna e cross-platform per la gestione delle prenotazioni di veicoli. Il sistema integra un backend robusto, un'interfaccia utente reattiva e un motore di Intelligenza Artificiale per l'ottimizzazione delle prenotazioni.
🛠 Tech Stack

L'architettura è suddivisa in tre componenti principali:

    Frontend: React (con Layout Responsive).

    Backend: Spring Boot.

    Database: MySQL.

    AI Engine: Python (per la logica di controllo disponibilità e suggerimenti).

🌟 Funzionalità Principali
1. Gestione Flotta (Database)

Il sistema gestisce un catalogo dettagliato di veicoli in MySQL. Ogni voce include:

    Marca e Modello.

    Tipo di alimentazione e Consumo medio.

    Galleria fotografica (2 foto: Interno ed Esterno).

2. Sistema di Registrazione e Utenti

    Accesso Flessibile: Gli utenti possono registrarsi e autenticarsi tramite email o numero di telefono.

    Anagrafica Clienti: Tabella dedicata per la gestione dei dati sensibili e dello storico clienti.

3. Motore AI (Python Integration)

L'intelligenza artificiale funge da supervisore delle prenotazioni:

    Controllo Disponibilità: Verifica in tempo reale se il veicolo richiesto è libero.

    Suggerimenti Intelligenti: Se l'auto è occupata, l'AI propone alternative simili all'utente.

    Gestione Errori e Log: In caso di indisponibilità, viene generato un file di log con data, dati del cliente e preferenze.

    Lead Generation: Se la vettura non è disponibile, il sistema richiede un messaggio all'utente per essere ricontattato dallo staff.

4. Internazionalizzazione (i18n)

L'interfaccia supporta il passaggio dinamico tra 4 lingue:

    🇮🇹 Italiano

    🇬🇧 Inglese

    🇷🇴 Rumeno

    🇷🇺 Russo

📊 Struttura del Database

Il database MySQL è composto dalle seguenti tabelle principali:

    Veicoli: Dettagli tecnici e link alle immagini.

    Clienti: Informazioni di contatto e credenziali.

    Prenotazioni: Relazione tra cliente, veicolo e periodo di noleggio.

🚀 Come Iniziare

    Configurazione Backend: Configura le proprietà di Spring Boot per connettersi all'istanza MySQL locale.

    Inizializzazione AI: Assicurati di avere Python installato con le librerie necessarie per interfacciarsi al database.

    Lancio Frontend: Esegui npm install e npm start nella cartella React per visualizzare il layout responsive.





    rentcar-app/
├── 📁 backend-springboot/          # Logica di business e API Java [cite: 2]
│   ├── 📁 src/main/java/com/rentcar/
│   │   ├── 📁 controller/          # Endpoint per API REST
│   │   ├── 📁 model/               # Entità (Clienti, Prenotazioni, Veicoli) [cite: 7, 8]
│   │   ├── 📁 repository/          # Interfacce per database MySQL 
│   │   └── 📁 service/             # Logica applicativa
│   └── pom.xml
│
├── 📁 frontend-react/              # Interfaccia utente responsive [cite: 2, 4]
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/          # Componenti UI riutilizzabili
│   │   ├── 📁 hooks/               # Gestione delle lingue (it, en, ro, ru) [cite: 11]
│   │   ├── 📁 assets/              # Immagini e icone
│   │   └── App.js
│   └── package.json
│
├── 📁 ai-engine-python/            # Intelligenza Artificiale [cite: 2, 9]
│   ├── 📄 main.py                  # Script principale per controllo disponibilità [cite: 9]
│   ├── 📄 requirements.txt         # Dipendenze Python
│   ├── 📁 logs/                    # File di log delle mancate prenotazioni [cite: 10]
│   └── 📁 scripts/                 # Utility per il database
│
├── 📁 database/                    # Script SQL 
│   └── 📄 schema.sql               # Creazione tabelle e 10 esempi veicoli 
│
└── 📄 README.md                    # Documentazione del progetto [cite: 12]

Dettagli dei Componenti



./mvnw spring-boot:run