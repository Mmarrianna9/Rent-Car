package RentCarBackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehicle") // Forza il nome della tabella in minuscolo
@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;

    @Column(name = "fuel_type") // Collega fuelType a fuel_type nel DB
    private String fuelType;

    @Column(name = "average_consumption") // Collega averageConsumption a average_consumption
    private Double averageConsumption;
    
    @Column(name = "photo_internal") // Deve corrispondere esattamente al nome nel DB
    private String photoInternal;

    @Column(name = "photo_external") // Deve corrispondere esattamente al nome nel DB
    private String photoExternal;
}