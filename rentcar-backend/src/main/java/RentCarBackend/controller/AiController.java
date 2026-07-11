package RentCarBackend.controller;

import RentCarBackend.model.Reservation;
import RentCarBackend.model.User;
import RentCarBackend.model.Vehicle;
import RentCarBackend.repository.ReservationRepository;
import RentCarBackend.repository.UserRepository;
import RentCarBackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "https://rent-car-frontend-52em.onrender.com")
public class AiController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @PostMapping("/process-booking")
    public ResponseEntity<?> processBooking(@RequestBody Map<String, Object> payload) {
        try {
            // Estrazione dati dal pacchetto React
            Long vehicleId = Long.valueOf(payload.get("vehicle_id").toString());
            String customerName = payload.get("customer_name").toString();
            String email = payload.get("email").toString();
            String phone = payload.get("phone").toString();
            LocalDate startDate = LocalDate.parse(payload.get("start_date").toString());
            LocalDate endDate = LocalDate.parse(payload.get("end_date").toString());

            Map<String, Object> response = new HashMap<>();

            // 1. Verifica sovrapposizione date reali sul DB
            var overlapping = reservationRepository.findOverlappingReservations(vehicleId, startDate, endDate);
            if (!overlapping.isEmpty()) {
                response.put("status", "busy");
                response.put("message", "Il veicolo è già occupato in questo intervallo di date.");
                response.put("suggestions", new ArrayList<>()); // Spazio per le alternative future dell'IA
                return ResponseEntity.ok(response);
            }

            // 2. Recupera l'oggetto Vehicle completo
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Veicolo non trovato con ID: " + vehicleId));

            // 3. Gestione Utente: Cerca per email, se non c'è lo crea come utente temporaneo/guest
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                // NOTA: Se la tua classe User usa campi diversi (es. username), adattali qui
                newUser.setEmail(email);
                newUser.setPhone(phone);
                // Nel tuo AuthController usi password crittografate; qui per i guest generiamo una password di default
                newUser.setPassword("GUEST_ACCOUNT_AI"); 
                return userRepository.save(newUser);
            });

            // 4. Calcolo prezzo totale reale (Giorni * Tariffa Veicolo)
            long days = ChronoUnit.DAYS.between(startDate, endDate);
            if (days <= 0) days = 1;
            
            // Gestisce dinamicamente sia pricePerDay che price_per_day grazie a Lombok o getter standard
            double pricePerDay = (vehicle.getPricePerDay() != null) ? vehicle.getPricePerDay() : 50.0;
            double totalPrice = days * pricePerDay;

            // 5. Costruzione e salvataggio dell'oggetto Reservation ORM
            Reservation reservation = new Reservation();
            reservation.setVehicle(vehicle); // Salva l'intera relazione
            reservation.setUser(user);       // Salva l'intera relazione
            reservation.setStartDate(startDate);
            reservation.setEndDate(endDate);
            reservation.setTotalPrice(totalPrice);

            reservationRepository.save(reservation);

            // 6. Ritorno dati di successo a React
            response.put("status", "success");
            response.put("message", "Prenotazione registrata con successo!");
            response.put("total_price", totalPrice);
            response.put("suggestions", new ArrayList<>());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", "Errore durante l'elaborazione del noleggio.");
            return ResponseEntity.internalServerError().body(errResponse);
        }
    }
}