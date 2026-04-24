package RentCarBackend.model;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;


@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true) // Aggiungiamo unique anche qui per la registrazione via telefono
    private String phone;
    
    @Column(nullable = false)
    private String password;

    // Aggiunte per Sicurezza e i18n
    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER; // Default: semplice utente

    private String preferredLanguage; // es: "it", "en", "ro", "ru"
}

// Enum semplice nello stesso pacchetto o in .model.enums
enum Role {
    ROLE_USER, ROLE_ADMIN
}