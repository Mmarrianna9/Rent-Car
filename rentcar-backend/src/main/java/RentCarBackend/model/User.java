package RentCarBackend.model;

import jakarta.persistence.*;
import lombok.Data;

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
    
    private String phone;
    
    @Column(nullable = false)
    private String password;
}
