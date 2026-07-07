# 🚗 rentcar-app | Piattaforma Gestione Autonoleggio (Multilingua)

Benvenuti nel repository di **rentcar-app**, una piattaforma moderna, full-stack e cross-platform progettata per ottimizzare la gestione e la prenotazione di una flotta di veicoli. Il sistema si distingue per un'architettura a micro-componenti, un'interfaccia utente responsive e un motore di Intelligenza Artificiale integrato.

---

## ⏱️ Nota sul Deploy (Live Demo)
> **PROGETTO PER PORTFOLIO:** L'applicazione è ospitata su servizi cloud gratuiti (**Vercel** per il Frontend, **Render** per Backend e AI, **Aiven** per il database MySQL). 
> Se il sito non viene visitato da qualche minuto, i container gratuiti entrano in modalità "sospensione". **La prima richiesta potrebbe richiedere circa 30-40 secondi per risvegliare il server.** Grazie per la pazienza!

* 🔗 **Live Demo:** [Inserisci qui il link di Vercel, es: https://rentcar-app.vercel.app]
* 📺 **Video Demo (1 Minuto):** [Inserisci qui il link del video di anteprima, es: YouTube/Drive]

---

## 🛠️ Tech Stack & Architettura

L'applicazione è suddivisa in componenti indipendenti che comunicano tramite API REST:

* **Frontend:** React (Layout Responsive con Tailwind CSS, gestione dinamica dello stato).
* **Backend:** Java / Spring Boot (Logica di business, sicurezza e API REST).
* **Database:** MySQL (Persistenza dei dati, relazioni strutturate).
* **AI Engine:** Python (FastAPI/Flask, logica di controllo disponibilità, raccomandazione e data logging).

---

## 🌟 Funzionalità Principali

### 1. Gestione Flotta & Catalogo
Il database gestisce un inventario dettagliato dei veicoli disponibili. Ogni auto include: marca, modello, tipo di alimentazione, consumo medio e una galleria fotografica doppia (vista interni ed esterni) ottimizzata tramite Cloud Storage esterno.

### 2. Sistema Utenti & Anagrafica
* **Accesso Flessibile:** Autenticazione e registrazione sicura tramite Email o Numero di Telefono.
* **Storico Clienti:** Tabella relazionale dedicata per tracciare in sicurezza le anagrafiche e lo storico delle prenotazioni passate e future.

### 3. Motore AI (Python Integration)
Lo script Python funge da supervisore intelligente dei flussi di noleggio:
* **Controllo Real-time:** Verifica istantanea della disponibilità del veicolo per le date richieste.
* **Suggerimenti Intelligenti:** Se la vettura è occupata, l'algoritmo analizza le specifiche e propone alternative simili (per segmento o alimentazione).
* **Lead Generation & Log:** In caso di indisponibilità, genera un file di log strutturato con le preferenze dell'utente e permette di inviare un messaggio per essere ricontattati dallo staff.

### 4. Internazionalizzazione (i18n)
L'interfaccia supporta il cambio dinamico della lingua in tempo reale senza ricaricare la pagina, coprendo 4 lingue:
* 🇮🇹 Italiano | 🇬🇧 English | 🇷🇴 Română | 🇷🇺 Русский

---

## 📊 Struttura del Database

Il database MySQL segue un modello relazionale classico ottimizzato per le performance:
* `Veicoli`: Dettagli tecnici e link assoluti alle immagini di interni/esterni.
* `Clienti`: Informazioni di contatto, credenziali e dati sensibili.
* `Prenotazioni`: Tabella di giunzione che collega Clienti e Veicoli, tracciando i periodi di noleggio (Check-in / Check-out).

---

## 📁 Struttura del Progetto

```text
rentcar-app/
├── 📁 database/                     # Script di inizializzazione
│   └── 📄 schema.sql                # Creazione tabelle e 10 veicoli di esempio
│
├── 📁 frontend-react/               # Interfaccia utente (React)
│   ├── 📁 public/
│   └── 📁 src/
│       ├── 📁 assets/               # Icone e media statici
│       ├── 📁 components/           # Componenti UI riutilizzabili e layout responsive
│       ├── 📁 hooks/                # Custom hooks per la gestione delle 4 lingue (i18n)
│       └── 📄 App.js
│
├── 📁 backend-springboot/           # Logica di Business (Spring Boot)
│   ├── 📁 src/main/java/com/rentcar/
│   │   ├── 📁 controller/           # Endpoint delle API REST pubblici e privati
│   │   ├── 📁 model/                # Entità JPA (Clienti, Prenotazioni, Veicoli)
│   │   ├── 📁 repository/           # Interfacce per le query al database MySQL
│   │   └── 📁 service/              # Logica applicativa e integrazione con il motore AI
│   └── 📄 pom.xml                   # Dipendenze Maven
│
└── 📁 ai-engine-python/             # Modulo Intelligenza Artificiale (Python)
    ├── 📄 main.py                   # Script per controllo disponibilità e raccomandazioni
    ├── 📄 requirements.txt          # Librerie e dipendenze Python
    ├── 📁 logs/                     # Log delle mancate prenotazioni (Lead Generation)
    └── 📁 scripts/                  # Utility di diagnostica database