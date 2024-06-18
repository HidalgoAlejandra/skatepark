CREATE DATABASE skatepark;
\c skatepark;

CREATE TABLE skaters (
    id SERIAL, 
    email VARCHAR(50) NOT NULL, 
    nombre VARCHAR(25) NOT NULL, 
    password VARCHAR(25) NOT NULL, 
    anos_experiencia INT NOT NULL, 
    especialidad VARCHAR(50) NOT NULL, 
    foto VARCHAR(255) NOT NULL, 
    estado BOOLEAN NOT NULL
    );

INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) 
VALUES ( 'kb@fbi.com', 'Kill Bill', 'me', 4, 'FullStack', '/uploads/Danny.jpg', false);
INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) 
VALUES ( 'fg@fbi.com', 'Forrest Gump', 'you', 6, 'DBA', '/uploads/Evelien.jpg', true);
INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) 
VALUES ( 'jm@fbi.com', 'Jonh Meyers', 'he', 8, 'FrontEnd', '/uploads/tony.jpg', true);