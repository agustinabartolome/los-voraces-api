CREATE TABLE proveedores_cafeteria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(150),
    categoria VARCHAR(100), 
    catalogo TEXT,
    codigo_proveedor VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE productos_cafeteria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,       
    subcategoria VARCHAR(50),            
    precio NUMERIC(10,2) NOT NULL,
    codigo_producto VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INTEGER REFERENCES proveedores_cafeteria(id),
    stock INTEGER DEFAULT 0
);



CREATE TABLE pedidos_cafeteria (
    id SERIAL PRIMARY KEY,
    codigo_orden VARCHAR(50) UNIQUE NOT NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    categoria VARCHAR(50) NOT NULL,        
    producto_id INTEGER REFERENCES productos_cafeteria(id),
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    cantidad INTEGER NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendiente',    
    proveedor_id INTEGER REFERENCES proveedores_cafeteria(id)
);


CREATE TABLE ventas_cafeteria (
    id SERIAL PRIMARY KEY,
    codigo_venta VARCHAR(50) UNIQUE NOT NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    producto_id INTEGER REFERENCES productos_cafeteria(id),
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    cantidad INTEGER NOT NULL,
    total NUMERIC(10,2) NOT NULL
);
