-- Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion TEXT,
    categoria VARCHAR(100)
);

-- Libros
CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    isbn VARCHAR(50) NOT NULL UNIQUE,
    precio NUMERIC(10,2) NOT NULL,
    autor VARCHAR(150),
    editorial VARCHAR(100),
    genero VARCHAR(100),
    seccion VARCHAR(100),
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0
);

-- Revistas
CREATE TABLE revistas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(100),
    precio NUMERIC(10,2),
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    issn VARCHAR(50),
    edicion VARCHAR(50),
    numero INTEGER
);

-- Artículos escolares
CREATE TABLE articulos_escolares (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(100),
    precio NUMERIC(10,2),
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    seccion VARCHAR(100),
    codigo VARCHAR(100)
);

-- Órdenes de compra
CREATE TABLE ordenes_compra (
    id SERIAL PRIMARY KEY,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE RESTRICT,
    fecha TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'pendiente'
);

CREATE TABLE detalle_ordenes (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    tipo_producto VARCHAR(50) NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    categoria VARCHAR(100)
);

-- Ventas
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    total NUMERIC(10,2) NOT NULL
);

CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id) ON DELETE CASCADE,
    tipo_producto VARCHAR(50) NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    categoria VARCHAR(100)
);
