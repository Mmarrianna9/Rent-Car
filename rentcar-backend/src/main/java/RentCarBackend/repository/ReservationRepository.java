package RentCarBackend.repository;
import RentCarBackend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Questa è la query magica che serve all'AiController per controllare le date occupate
    @Query("SELECT r FROM Reservation r WHERE r.vehicle.id = :vehicleId " +
           "AND (:startDate < r.endDate AND :endDate > r.startDate)")
    List<Reservation> findOverlappingReservations(
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}

