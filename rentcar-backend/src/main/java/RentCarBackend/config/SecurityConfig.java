package RentCarBackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabilita CSRF con sintassi Lambda
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Permette tutte le richieste
            )
            .httpBasic(Customizer.withDefaults()); // Usa i default per l'autenticazione base

        return http.build();
    }
}