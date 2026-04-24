package RentCarBackend.controller;
import RentCarBackend.dto.LoginResponse;
import RentCarBackend.model.User;
import RentCarBackend.repository.UserRepository;
import RentCarBackend.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Consente chiamate dal tuo frontend React
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Inizializziamo l'encoder per la sicurezza delle password
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    // Iniettiamo il JwtService per generare i token
    @Autowired
    private JwtService jwtService;


    /**
     * Registrazione nuovo utente con crittografia password e controlli unicità.
     */

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // 1. Verifica se l'email è già presente
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Errore: L'email è già registrata!");
        }

        // 2. Verifica se il telefono è già presente (essendo un campo unique)
        if (user.getPhone() != null && !user.getPhone().isEmpty()) {
            if (userRepository.findByPhone(user.getPhone()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Errore: Il numero di telefono è già registrato!");
            }
        }

        // 3. Crittografia della password
        String hashedPw = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPw);

        // 4. Salvataggio utente
        User savedUser = userRepository.save(user);

        // Ritorna l'utente salvato (la password sarà l'hash, non quella in chiaro)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    /**
     * Login utente con verifica sicura tramite BCrypt.
     */
  @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        // 1. Cerca l'utente nel database tramite l'email fornita
        Optional<User> userOptional = userRepository.findByEmail(loginData.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 2. Confronta la password in chiaro (loginData) con quella hashata nel DB (user)
            if (passwordEncoder.matches(loginData.getPassword(), user.getPassword())) {
                
                // 3. Genera il Token JWT usando il servizio dedicato
                String token = jwtService.generateToken(user.getEmail());

                // 4. Restituisce la risposta con Token e dati Utente (lingua, ruolo, ecc.)
                return ResponseEntity.ok(new LoginResponse(token, user));
            }
        }
        
              // Se l'utente non esiste o la password è errata
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Credenziali non valide: email o password errati.");
    }
}
