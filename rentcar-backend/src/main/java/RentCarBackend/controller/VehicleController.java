package RentCarBackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import RentCarBackend.model.Vehicle;
import RentCarBackend.repository.VehicleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/vehicles")
// 🌐 CORRETTO: allowedHeaders = "*" assicura che il controller accetti l'header modificato da Axios
@CrossOrigin(origins = "https://rent-car-ai-engine.onrender.com", allowedHeaders = "*")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    // 🕵️‍♂️ EntityManager serve a scollegare temporaneamente l'entità dal database prima di modificarla
    @PersistenceContext
    private EntityManager entityManager;

    // 🛠️ Costruttore pubblico per una Dependency Injection pulita ed evitare errori di compilazione
    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public List<Vehicle> getAllVehicles(
        @RequestHeader(value = "Accept-Language", required = false, defaultValue = "it") String lang
    ) {
        // 1. Recuperiamo tutti i veicoli dal database
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        // 2. Estraiamo in modo sicuro solo i primi 2 caratteri della lingua (es: "en", "ro", "ru")
        String cleanLang = "it";
        if (lang != null && lang.length() >= 2) {
            cleanLang = lang.substring(0, 2).toLowerCase().trim();
        }
        
        // Stampa di controllo nel terminale di Spring Boot per monitorare le richieste in tempo reale
        System.out.println("--- LINGUA RICHIESTA DA REACT: [" + cleanLang + "] ---");
        
        // 3. Mappiamo dinamicamente la descrizione corretta prima di inviare il JSON
        for (Vehicle vehicle : vehicles) {
            // Slegando l'oggetto, evitiamo che Hibernate sovrascriva o blocchi le modifiche in memoria
            entityManager.detach(vehicle);
            
            String localizedDesc = vehicle.getLocalizedDescription(cleanLang);
            vehicle.setDescription(localizedDesc);
        }
        
        return vehicles;
    }
}