-- Proveedores
INSERT INTO proveedores (nombre, telefono, email, direccion, categoria) VALUES
('Editorial Planeta', '1122334455', 'contacto@planeta.com', 'Av. Siempre Viva 123', 'Libros'),
('Distribuidora Sur', '1144556677', 'ventas@distsur.com', 'Calle Falsa 742', 'Revistas'),
('Utiles S.R.L.', '1199887766', 'info@utiles.com', 'Ruta 8 Km 12', 'Artículos Escolares');

-- Libros
INSERT INTO libros (titulo, isbn, precio, autor, editorial, genero, seccion, proveedor_id, stock) VALUES
('El Alquimista', '978-0061122415', 2800.00, 'Paulo Coelho', 'HarperCollins', 'Ficción', 'Autoayuda', 1, 8),
('Harry Potter y la Piedra Filosofal', '978-8478884452', 4200.00, 'J.K. Rowling', 'Salamandra', 'Fantasia', 'Juvenil', 1, 15),
('Don Quijote de la Mancha', '978-8420471750', 2000.00, 'Miguel de Cervantes', 'Penguin Clasicos', 'Clásico', 'Literatura', 3, 15),
('El Gran Gatsby', '978-0743273565', 1800.00, 'F. Scott Fitzgerald', 'Scribner', 'Novela', 'Literatura', 3, 10);

-- Revistas
INSERT INTO revistas (nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero) VALUES
('National Geographic', 'Ciencia', 1500.00, 2, 20, '0027-9358', 'Abril 2024', 345),
('Rolling Stone', 'Música', 1800.00, 2, 10, '0035-791X', 'Marzo 2024', 220),
('Vogue', 'Moda', 2000.00, 2, 8, '0042-8000', 'Enero 2024', 101);


--Articulos Escolares
INSERT INTO articulos_escolares (nombre, marca, precio, proveedor_id, stock, seccion, codigo) VALUES
('Lápiz HB', 'Faber-Castell', 150.00, 3, 200, 'Librería', 'FC-HB-01'),
('Cuaderno A4 Rayado', 'Rivadavia', 950.00, 3, 120, 'Papelería', 'RIV-A4R'),
('Cartuchera Triple', 'Totto', 3500.00, 3, 40, 'Accesorios', 'TOT-CTR-3');


-- Ordenes de Compra
INSERT INTO ordenes_compra (proveedor_id, estado) VALUES
(1, 'pendiente'),
(3, 'completada'),
(2, 'pendiente');


-- Detalle de ordenes
INSERT INTO detalle_ordenes (orden_id, tipo_producto, producto_id, cantidad, precio_unitario, categoria) VALUES
-- Libros
(1, 'libro', 1, 10, 3000.00, 'Literatura'),
(1, 'libro', 2, 5, 2500.00, 'Ficción'),

-- Revistas
(3, 'revista', 1, 30, 1200.00, 'Ciencia'),
(3, 'revista', 2, 20, 1500.00, 'Música'),

-- Artículos escolares
(2, 'articulo', 1, 100, 120.00, 'Papelería'),
(2, 'articulo', 2, 50, 900.00, 'Cuadernos');


-- Ventas
INSERT INTO ventas (usuario_id, total) VALUES
(2, 9000.00),
(1, 15000.00),
(3, 4500.00);


-- Detalle de Ventas
INSERT INTO detalle_ventas (venta_id, tipo_producto, producto_id, cantidad, precio_unitario, subtotal, categoria) VALUES
-- Venta 1
(1, 'libro', 1, 2, 3500.00, 7000.00, 'Literatura'),
(1, 'revista', 1, 2, 1000.00, 2000.00, 'Ciencia'),

-- Venta 2
(2, 'articulo', 1, 20, 150.00, 3000.00, 'Librería'),
(2, 'libro', 3, 3, 4200.00, 12600.00, 'Juvenil'),

-- Venta 3
(3, 'revista', 3, 2, 2000.00, 4000.00, 'Moda'),
(3, 'articulo', 2, 1, 950.00, 950.00, 'Papelería');

