# Inicializar el proyecto
En la terminar ejecutar el comando que va a inicializar Node.js

npm init -y

# Instalar dependencias

En la terminal ejecutar los siguientes comandos: 

npm install express 

npm install pg 

npm install bcryptjs

npm install jsonwebtoken

npm install cors

npm install dotenv

npm install nodemon --save-dev

# .env

Crear archivo .env, en la raiz del proyecto con lo siguiente:

DB_USER=usuario

DB_PASS=contraseña

DB_HOST=localhost

DB_NAME=nombre de la tabla base de datos

DB_PORT=5432

JWT_SECRET=

# Configurar la base de datos con PostgreSQL

# Crear la base de datos

CREATE DATABASE nombre_de_la_base_de_datos

WITH OWNER = postgres

ENCODING = 'UTF8';

# Ejecutar los Scripts 

Dentro de /sql:

Crear tablas

psql -U postgres -d nombre_de_la_base_de_datos -f sql/create_tables.sql

Insertar datos iniciales

psql -U postgres -d nombre_de_la_base_de_datos -f sql/insert_data.sql

Resetear toda la base de datos

psql -U postgres -d nombre_de_la_base_de_datos -f sql/reset.sql