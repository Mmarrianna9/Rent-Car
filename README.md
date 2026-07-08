# 🚗 rentcar-app | Piattaforma Gestione Autonoleggio (Multilingua)

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/AI_Engine-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

Benvenuti nel repository di **rentcar-app**, una piattaforma moderna, full-stack e cross-platform progettata per ottimizzare la gestione e la prenotazione di una flotta di veicoli. Il sistema si distingue per un'architettura a micro-componenti, un'interfaccia utente responsive e un motore di Intelligenza Artificiale integrato.

---

## ⏱️ Nota sul Deploy (Live Demo)
> ⚠️ **PROGETTO PER PORTFOLIO:** L'applicazione è ospitata su servizi cloud gratuiti (**Vercel** per il Frontend, **Render** per Backend e AI, **Aiven** per il database MySQL). 
> Se il sito non viene visitato da qualche minuto, i container gratuiti entrano in modalità "sospensione". **La prima richiesta potrebbe richiedere circa 30-40 secondi per risvegliare il server.** Grazie per la paciencia!

* 🔗 **Live Demo:** [Inserisci qui il link di Vercel, es: https://rentcar-app.vercel.app]
* 📺 **Video Demo (1 Minuto):** [Inserisci qui il link del video di anteprima, es: YouTube/Drive]

---

## 🛠️ Tech Stack & Architettura

L'applicazione è suddivisa in componenti indipendenti che comunicano tramite API REST:

* **Frontend:** React (Layout Responsive con Tailwind CSS, gestione dinamica dello stato).
* **Backend:** Java / Spring Boot (Logica di business, sicurezza e API REST).
* **Database:** MySQL (Persistenza dei dati, relazioni strutturate).
* **AI Engine:** Python (FastAPI, logica di controllo disponibilità, raccomandazione e data logging).

---

## 🌟 Funzionalità Principali

### 1. Gestione Flotta & Catalogo
Il database gestisce un inventario dettagliato dei veicoli disponibili. Ogni auto include: marca, modello, tipo di alimentazione, cambio, potenza, consumo medio e una galleria fotografica doppia (vista interni ed esterni) ottimizzata tramite Cloud Storage esterno.

### 2. Sistema Utenti & Anagrafica
* **Accesso Flessibile:** Autenticazione e registrazione sicura tramite Email o Numero di Telefono.
* **Storico Clienti:** Tabella relazionale dedicata per tracciare in sicurezza le anagrafiche e lo storico delle prenotazioni passate e future.

### 3. Motore AI (Python Integration)
Lo script Python funge da supervisore intelligente dei flussi di noleggio:
* **Controllo Real-time:** Verifica istantanea della disponibilità del veicolo per le date richieste direttamente sul database.
* **Suggerimenti Intelligenti:** Se la vettura è occupata, l'algoritmo analizza le specifiche e propone 3 alternative disponibili nello stesso periodo, filtrandole per fascia di prezzo simile (con fallback automatico sulla flotta libera in caso di filtri troppo restrittivi).
* **Lead Generation & Log:** In caso di indisponibilità, genera un file di log strutturato (`ai_booking_log.txt`) con le preferenze dell'utente per permettere di ricontattare il cliente.

### 4. Internazionalizzazione (i18n)
L'interfaccia supporta il cambio dinamico della lingua in tempo reale senza ricaricare la pagina tramite `react-i18next`, passando i relativi header di localizzazione al backend per le descrizioni tecniche. Supporta 4 lingue:
* 🇮🇹 Italiano | 🇬🇧 English | 🇷🇴 Română | 🇷🇺 Русский

---

## 📊 Struttura del Database

Il database MySQL segue un modello relazionale ottimizzato per le performance:
* `vehicle`: Dettagli tecnici e link assoluti alle immagini di interni/esterno.
* `users`: Informazioni di contatto, credenziali e ruoli.
* `reservation`: Tabella di giunzione relazionale che collega Clienti e Veicoli, tracciando i periodi di noleggio (`start_date` / `end_date`) e il prezzo totale calcolato.

---

## 📁 Struttura del Progetto

```text
rentcar-app/
├── 📁 database/                     # Script di inizializzazione
│   └── 📄 schema.sql                # Creazione tabelle e dati mockup di esempio
│
├── 📁 frontend-react/               # Interfaccia utente (React)
│   ├── 📁 public/
│   └── 📁 src/
│       ├── 📁 assets/               # Icone e media statici
│       ├── 📁 components/           # Componenti UI riutilizzabili (es: VehicleDetail.js)
│       ├── 📁 hooks/                # Custom hooks e configurazioni i18n
│       └── 📄 App.js
│
├── 📁 backend-springboot/           # Logica di Business (Spring Boot)
│   ├── 📁 src/main/java/com/rentcar/
│   │   ├── 📁 controller/           # Endpoint delle API REST pubblici e privati
│   │   ├── 📁 model/                # Entità JPA (Users, Reservation, Vehicle)
│   │   ├── 📁 repository/           # Interfacce per le query al database MySQL
│   │   └── 📁 service/              # Logica applicativa e orchestrazione dei flussi
│   └── 📄 pom.xml                   # Dipendenze Maven
│
└── 📁 ai-engine-python/             # Modulo Intelligenza Artificiale (FastAPI)
    ├── 📄 main.py                   # Script di controllo disponibilità e raccomandazioni
    ├── 📄 requirements.txt          # Librerie e dipendenze Python
    ├── 📁 logs/                     # Log storici delle prenotazioni (Lead Generation)
    └── 📁 scripts/                  # Utility di diagnostica database

⚙️ Setup Locale
Prerequisiti

    Node.js (v16+)

    Java JDK 17

    Python 3.9+

    MySQL (XAMPP / WampServer)

1. Database Setup

    Avvia MySQL dal pannello di controllo di XAMPP.

    Accedi a phpMyAdmin e crea un database chiamato rent_car.

    Importa il file contenuto in /database/schema.sql.

2. Avvio AI Engine (FastAPI)
Bash

cd ai-engine-python
pip install -r requirements.txt
uvicorn main:app --reload

Attivo su: http://127.0.0.1:8000
3. Avvio Backend (Spring Boot)
Bash

cd backend-springboot
./mvnw spring-boot:run

Attivo su: http://localhost:8080
4. Avvio Frontend (React)
Bash

cd frontend-react
npm install
npm start