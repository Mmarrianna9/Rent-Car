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
    @Column(name = "id")
    private Long id;

    @Column(name = "brand")
    private String brand;

    @Column(name = "model")
    private String model;

    @Column(name = "price_per_day")
    private Double pricePerDay;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "consumption")
    private String consumption; // es: "L/100km"

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

    // 🇮🇹 Questa colonna fa da default (Italiano)
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // 🇬🇧 Colonna Inglese
    @Column(name = "descrizione_en", columnDefinition = "TEXT")
    private String descrizioneEn;

    // 🇷🇴 Colonna Rumena
    @Column(name = "descrizione_ro", columnDefinition = "TEXT")
    private String descrizioneRo;

    // 🇷🇺 Colonna Russa
    @Column(name = "descrizione_ru", columnDefinition = "TEXT")
    private String descrizioneRu;

    /**
     * 🌐 METODO UTILITY: Restituisce la descrizione localizzata in base alla lingua passata.
     * Se la lingua richiesta non è disponibile o la colonna è vuota, fa il fallback automatico sull'italiano.
     */
    public String getLocalizedDescription(String lang) {
        if (lang == null) {
            return this.description;
        }
        
        switch (lang.toLowerCase().trim()) {
            case "en":
                return (this.descrizioneEn != null && !this.descrizioneEn.isEmpty()) ? this.descrizioneEn : this.description;
            case "ro":
                return (this.descrizioneRo != null && !this.descrizioneRo.isEmpty()) ? this.descrizioneRo : this.description;
            case "ru":
                return (this.descrizioneRu != null && !this.descrizioneRu.isEmpty()) ? this.descrizioneRu : this.description;
            default:
                return this.description; // Fallback in Italiano
        }
    }
}