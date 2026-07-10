Questa sezione spiega come mettere online l'intera infrastruttura cloud senza spendere nulla, utilizzando i piani gratuiti per sviluppatori.
1. Caricamento su GitHub

Crea un repository pubblico o privato su GitHub e carica l'intera cartella del progetto (rentcar-app). I servizi cloud si collegheranno direttamente a questo repository per automatizzare i deploy.
2. Database Cloud (Aiven)

    Registrati gratuitamente su Aiven.io.

    Crea un nuovo servizio selezionando MySQL (Piano gratuito / Free Tier).

    Una volta avviato, copia i dati di connessione forniti (Host, Port, User, Password, Database Name).

    Usa un client come DBeaver o MySQL Workbench per connetterti al database cloud ed esegui lo script /database/schema.sql per creare le tabelle e inserire i dati iniziali.

3. Deploy AI Engine Python (Render)

    Accedi a Render.com tramite il tuo account GitHub.

    Clicca su New + e seleziona Web Service.

    Collega il tuo repository GitHub.

    Configura i parametri di build:

        Root Directory: ai-engine-python

        Runtime: Python 3

        Build Command: pip install -r requirements.txt

        Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

    Vai nella sezione Environment del pannello di Render e aggiungi le variabili d'ambiente per connettere Python ad Aiven (es. DB_HOST, DB_USER, ecc., modificando il codice di main.py per leggerle tramite os.environ).

    Clicca su Create Web Service. Una volta completato, copia l'URL pubblico fornito da Render (es: https://ai-engine-xyz.onrender.com).

4. Deploy Backend Java Spring Boot (Render)

    Sempre su Render, crea un secondo Web Service collegato allo stesso repository.

    Configura i parametri di build:

        Root Directory: backend-springboot

        Runtime: Docker (consigliato per Spring Boot creando un semplice Dockerfile) oppure Java.

        Build Command: ./mvnw clean install -DskipTests

        Start Command: java -jar target/*.jar --server.port=$PORT

    Nella sezione Environment, aggiungi le variabili d'ambiente per sovrascrivere il file application.properties con le credenziali di Aiven MySQL.

    Clicca su Create Web Service e copia l'URL pubblico generato.

5. Deploy Frontend (Vercel)

    Accedi a Vercel.com con GitHub.

    Clicca su Add New -> Project e importa il repository.

    Nella schermata di configurazione:

        Framework Preset: Create React App

        Root Directory: frontend-react

    Espandi la sezione Environment Variables e inserisci gli URL pubblici generati da Render per Spring Boot e FastAPI (es. REACT_APP_API_URL e REACT_APP_AI_URL), assicurandoti che i tuoi componenti React (come VehicleDetail.js) usino queste variabili invece degli URL locali localhost.

    Clicca su Deploy. In meno di un minuto il tuo sito sarà live con un dominio SSL gratuito!

***