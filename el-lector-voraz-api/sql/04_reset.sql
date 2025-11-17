-- Elimina todas las tablas en orden de dependencias
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;

DROP TABLE IF EXISTS detalle_ordenes CASCADE;
DROP TABLE IF EXISTS ordenes_compra CASCADE;

DROP TABLE IF EXISTS articulos_escolares CASCADE;
DROP TABLE IF EXISTS revistas CASCADE;
DROP TABLE IF EXISTS libros CASCADE;

DROP TABLE IF EXISTS proveedores CASCADE;

DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


\i create_tables.sql


\i insert_data.sql
