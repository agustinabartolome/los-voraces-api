INSERT INTO roles (nombre) VALUES 
('admin'),
('empleado_libreria'),
('empleado_cafeteria');

-- Crear usuario admin con contraseña temporal "admin123"
-- Luego la API debe permitir cambiarla

INSERT INTO usuarios (username, password, rol_id)
VALUES (
    'admin',
    '$2a$10$TafY0eCQpZK0s8AjtKoa6.xIuHmIi.YTZGi99ZTSdKCbFf8g/.uwW', -- esto es el bcrypt de admin123
    (SELECT id FROM roles WHERE nombre = 'admin')
);
