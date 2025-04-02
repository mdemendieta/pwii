create database SHOWCAR;

drop database SHOWCAR;

use SHOWCAR;

create table tabla_usuario
(
   id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   Nombre varchar(50) NOT NULL,
   Apellidos varchar(50) NOT NULL,
   FechaNacimiento date NOT NULL,
   Genero int NOT NULL, -- (0=MASCULINO,1=FEMENINO,2=OTRO)
   Tipo_usuario int NOT NULL, -- (1=Comprador,2=Vendedor)
   Baja_usuario bit, -- (0=ACTIVO,1=BAJA) 
   foto_perfil longblob,
   username varchar(50) NOT NULL UNIQUE,
   correo varchar(50) NOT NULL UNIQUE,
   contrasena varchar(50) NOT NULL
);
select * from tabla_usuario;

create table tabla_categoria
(
    id_categoria INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre_categoria varchar(50)
);

create table tabla_auto
(
    id_auto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_categoria int NOT NULL,
    id_vendedor int NOT NULL,
    Marca_auto varchar(50) NOT NULL,
    Modelo_Auto varchar(50) NOT NULL,
    Año_auto Date NOT NULL,
    Color_auto varchar(50) NOT NULL,
    Estado_auto varchar(50) NOT NULL,   -- (Daño minimo, Daño medio, Daño alto)
    Transmision_auto varchar(50) NOT NULL, -- (Manual y automatico)
    Kilometraje_auto float NOT NULL,
    Precio_auto float default null,
	foto_auto longblob NOT NULL,
    Baja_carro bit, -- (0=ACTIVO,1=BAJA) 
	fecha_publicacion_auto Date NOT NULL,
    Estado varchar(50) NOT NULL, 
    Ciudad varchar(50) NOT NULL,
    Calle varchar(50) NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES tabla_categoria(id_categoria),
    FOREIGN KEY (id_vendedor) REFERENCES tabla_usuario(id_usuario)
);

create table tabla_venta
(
	id_venta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario_comprador int NOT NULL,
    id_usuario_vendedor int NOT NULL,
    id_auto_venta int NOT NULL,
    fecha_venta Date NOT NULL,
    metodo_pago_venta INT NOT NULL,  -- Método de pago de la inscripción ( 0 = TARJETA DEBITO,1 = TARJETA CREDITO)
	Precio_pagado FLOAT DEFAULT NULL,
	FOREIGN KEY (id_usuario_comprador) REFERENCES tabla_usuario(id_usuario),
    FOREIGN KEY (id_usuario_vendedor) REFERENCES tabla_usuario(id_usuario),
	FOREIGN KEY (id_auto_venta) REFERENCES tabla_auto(id_auto)
);

CREATE TABLE tabla_mensajes 
(
    id_mensaje int NOT NULL AUTO_INCREMENT PRIMARY KEY,                
    texto_mensaje VARCHAR(255) NOT NULL,                    
    id_usuario1_mensaje INT NOT NULL,                     
    id_usuario2_mensaje INT NOT NULL,                    
    fecha_creacion_mensaje DATETIME,					     
    FOREIGN KEY (id_usuario1_mensaje) REFERENCES tabla_usuario(id_usuario),  
    FOREIGN KEY (id_usuario2_mensaje) REFERENCES tabla_usuario(id_usuario)	
);

CREATE TABLE tabla_resenas
(
    id_resena int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_usuario_comprador int NOT NULL,
    id_usuario_vendedor int NOT NULL,
    texto_resena varchar(50),
	calificacion_vendedor INT NOT NULL, 
    Fecha_creacion_mensaje Date,
    Hora_creacion_mensaje time,
	FOREIGN KEY (id_usuario_comprador) REFERENCES tabla_usuario(id_usuario),
    FOREIGN KEY (id_usuario_vendedor) REFERENCES tabla_usuario(id_usuario)
);
