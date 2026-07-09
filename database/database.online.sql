SHOW CREATE TABLE customers;
SELECT * FROM customers;

SHOW CREATE TABLE reservation;

SHOW CREATE TABLE users;

SHOW CREATE TABLE vehicle;

SELECT * FROM users;
SHOW TABLES;SELECT 'users' AS tabella, COUNT(*) AS totale_righe FROM users
UNION ALL
SELECT 'reservation', COUNT(*) FROM reservation
UNION ALL
SELECT 'vehicle', COUNT(*) FROM vehicle