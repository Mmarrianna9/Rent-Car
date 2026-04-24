package RentCarBackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehicle")
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

    @Column(name = "price_per_day")
    private Double pricePerDay;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "consumption")
    private String consumption; // Cambiato a String per includere "L/100km"

    @Column(name = "transmission")
    private String transmission; // Manuale / Automatico

    @Column(name = "power")
    private String power; // es: "150 CV"

    @Column(name = "seats")
    private Integer seats;

    @Column(name = "photo_internal")
    private String photoInternal;

    @Column(name = "photo_external")
    private String photoExternal;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}