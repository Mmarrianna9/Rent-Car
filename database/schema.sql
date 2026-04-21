SET FOREIGN_KEY_CHECKS = 0; -- Disabilita i controlli per pulire

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS customers;

SET FOREIGN_KEY_CHECKS = 1; -- Riabilita i controlli

-- 1. La tua tabella VEHICLE
CREATE TABLE vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50),
    model VARCHAR(50),
    fuel_type VARCHAR(20),
    average_consumption FLOAT,
    photo_internal VARCHAR(255),
    photo_external VARCHAR(255)
) ENGINE=InnoDB;

-- 2. Tabella CLIENTI (Necessaria per la relazione)
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
) ENGINE=InnoDB;

-- 3. Tabella PRENOTAZIONI (Corretta con la tua struttura)
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    customer_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

INSERT INTO vehicle (brand, model, fuel_type, average_consumption, photo_internal, photo_external) VALUES 
-- CITY CAR (Economiche)
('Fiat', '500 Hybrid', 'Hybrid', 4.5, 'f500_int.jpg', 'f500_ext.jpg'),
('Lancia', 'Ypsilon', 'Hybrid', 4.8, 'ypsilon_int.jpg', 'ypsilon_ext.jpg'),
('Toyota', 'Aygo X', 'Petrol', 4.7, 'aygo_int.jpg', 'aygo_ext.jpg'),
('Renault', 'Twingo', 'Electric', 0.0, 'twingo_int.jpg', 'twingo_ext.jpg'),
('Volkswagen', 'Polo', 'Petrol', 5.2, 'polo_int.jpg', 'polo_ext.jpg'),

-- SUV & CROSSOVER
('Jeep', 'Renegade', 'Diesel', 5.8, 'renegade_int.jpg', 'renegade_ext.jpg'),
('Dacia', 'Duster', 'LPG', 7.5, 'duster_int.jpg', 'duster_ext.jpg'),
('Kia', 'Sportage', 'Hybrid', 5.6, 'sportage_int.jpg', 'sportage_ext.jpg'),
('Peugeot', '3008', 'Diesel', 5.0, 'p3008_int.jpg', 'p3008_ext.jpg'),
('Ford', 'Puma', 'Hybrid', 5.4, 'puma_int.jpg', 'puma_ext.jpg'),

-- BERLINE & LUXURY
('BMW', 'Serie 3', 'Diesel', 4.9, 'bmw3_int.jpg', 'bmw3_ext.jpg'),
('Mercedes', 'Classe C', 'Diesel', 5.1, 'mercedes_int.jpg', 'mercedes_ext.jpg'),
('Audi', 'A4', 'Diesel', 5.3, 'audi_int.jpg', 'audi_ext.jpg'),
('Alfa Romeo', 'Giulia', 'Petrol', 7.2, 'giulia_int.jpg', 'giulia_ext.jpg'),
('Volvo', 'S60', 'Hybrid', 2.1, 'volvo_int.jpg', 'volvo_ext.jpg'),

-- ELECTRIC & INNOVATION
('Tesla', 'Model 3', 'Electric', 0.0, 'tesla3_int.jpg', 'tesla3_ext.jpg'),
('Hyundai', 'Ioniq 5', 'Electric', 0.0, 'ioniq5_int.jpg', 'ioniq5_ext.jpg'),
('Audi', 'Q4 e-tron', 'Electric', 0.0, 'q4_int.jpg', 'q4_ext.jpg'),
('MG', 'MG4', 'Electric', 0.0, 'mg4_int.jpg', 'mg4_ext.jpg'),
('Tesla', 'Model Y', 'Electric', 0.0, 'teslay_int.jpg', 'teslay_ext.jpg');