# Inicializar el proyecto

1. Instalar las dependencias:

        npm install

2. Crear el archivo .env a partir de .env.example:

        copy .env.example .env

3. Completar las credenciales en .env

## Configurar la base de datos con PostgreSQL:

Ejecutar los scripts que se encuentran dentro de /sql con postgres:

1. Crear Base de Datos

        psql -U postgres 

        \i 01_create_database.sql

2. Crear tablas

        \i 02_create_tables.sql

3. Insertar roles y usuarios

        \i 02_user_admin.sql

4. Insertar datos inciciales

        \i 05_insert_data.sql

Si se quiere resetear la base de datos, utilizar el script reset:

        \i 04_reset.sql

