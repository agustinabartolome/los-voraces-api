-- Creación del usuario a modo de ejemplo

DO
$$
BEGIN
    
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_one'
    ) THEN
        CREATE ROLE user_one LOGIN PASSWORD 'password_user_one';
        RAISE NOTICE 'Usuario user_one creado.';
    ELSE
        RAISE NOTICE 'El usuario user_one ya existe. No se crea.';
    END IF;
END
$$;


GRANT CONNECT ON DATABASE el_lector_voraz TO user_one;

-- Debes ejecutar esto dentro de la base:
-- \c el_lector_voraz

-- Asignar permisos sobre todas las tablas
GRANT USAGE ON SCHEMA public TO user_one;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO user_one;

-- Permitir permisos automáticos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO user_one;
