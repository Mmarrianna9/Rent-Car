package RentCarBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import RentCarBackend.model.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>{

}
