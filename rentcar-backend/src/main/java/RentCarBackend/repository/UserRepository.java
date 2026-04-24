package RentCarBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import RentCarBackend.model.User;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    
}
