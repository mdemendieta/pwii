// pwii/server/index.js

const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2/promise'); // Import the promise-wrapped version of mysql2
const multer = require('multer');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Database Connection Pool ---
const dbPool = mysql.createPool({ // Changed to createPool and renamed to dbPool
    host: "localhost",
    user: "root",
    password: "1234", // Your MySQL password
    database: "showcar",
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0
});

// Optional: Test connection on startup
dbPool.getConnection()
    .then(connection => {
        console.log("Successfully connected to the database using connection pool.");
        connection.release();
    })
    .catch(err => {
        console.error("Error connecting to the database pool:", err.stack);
    });

// --- Multer Configuration ---
const fileFilter = (req, file, cb) => {
    const formatos = ['image/png', 'image/jpg', 'image/jpeg'];
    if (formatos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no aceptado. Solo PNG, JPG, JPEG.'), false);
    }
};
const strg = multer.memoryStorage();
const archivo = multer({
    storage: strg,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// --- API Endpoints (Updated to use dbPool with async/await) ---

app.post("/create", archivo.single('imagen'), async (req, resp) => {
    const { user: username, correo, nombre, apellidos, fecha, rol, genero, contra } = req.body;
    const imagen64 = req.file ? req.file.buffer.toString('base64') : null;

    try {
        const [result] = await dbPool.execute(
            'INSERT INTO tabla_usuario(Nombre, Apellidos, FechaNacimiento, Genero, Tipo_usuario, Baja_usuario, username, correo, contrasena, foto_perfil) VALUES (?,?,?,?,?,0,?,?,?,?)',
            [nombre, apellidos, fecha, genero, rol, username, correo, contra, imagen64]
        );

        const newUserId = result.insertId;
        if (!newUserId) throw new Error("No se pudo obtener el ID del usuario insertado.");

        const [selectData] = await dbPool.execute(
            'SELECT id_usuario, Nombre, Apellidos, FechaNacimiento, correo, Tipo_usuario, foto_perfil, username FROM tabla_usuario WHERE id_usuario = ?',
            [newUserId]
        );

        if (selectData.length > 0) {
            const userRecord = selectData[0];
            resp.status(201).json({
                msg: "ok",
                message: "Usuario creado con éxito.",
                userData: {
                    idUsuario: userRecord.id_usuario,
                    usuario: userRecord.Nombre,
                    Apellidos: userRecord.Apellidos,
                    FechadeNacimiento: userRecord.FechaNacimiento,
                    correoUsuario: userRecord.correo,
                    tipoUsuario: userRecord.Tipo_usuario,
                    FotoPerfil: userRecord.foto_perfil
                }
            });
        } else {
            throw new Error("Usuario creado, pero no se pudieron recuperar los datos.");
        }
    } catch (err) {
        console.error("Error en /create:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return resp.status(409).json({ msg: "Error al registrar", error: "El nombre de usuario o correo ya existe." });
        }
        resp.status(500).json({ msg: "Error al registrar usuario", error: err.message });
    }
});

app.post("/Login", async (req, resp) => {
    try {
        const [data] = await dbPool.execute(
            'SELECT id_usuario, Nombre, Apellidos, FechaNacimiento, correo, Tipo_usuario, foto_perfil, username FROM tabla_usuario WHERE correo=? AND contrasena=?',
            [req.body.email, req.body.passw]
        );

        if (data.length > 0) {
            const userRecord = data[0];
            resp.json({
                alert: "Encontrado",
                userData: {
                    idUsuario: userRecord.id_usuario,
                    usuario: userRecord.Nombre,
                    Apellidos: userRecord.Apellidos,
                    FechadeNacimiento: userRecord.FechaNacimiento,
                    correoUsuario: userRecord.correo,
                    tipoUsuario: userRecord.Tipo_usuario,
                    FotoPerfil: userRecord.foto_perfil
                }
            });
        } else {
            resp.json({ alert: "No Encontrado", error: "Correo o contraseña incorrectos." });
        }
    } catch (err) {
        console.error("Error en /Login:", err);
        resp.status(500).json({ error: "Error en el servidor al intentar iniciar sesión." });
    }
});

app.get("/getUsers", async (req, resp) => {
    try {
        const [data] = await dbPool.query("SELECT nombre, foto_perfil FROM tabla_usuario");
        if (data.length > 0) {
            resp.json(data);
        } else {
            resp.json({ "msg": "No hay usuarios para mostrar." });
        }
    } catch (err) {
        console.error("Error en /getUsers:", err);
        resp.status(500).json({ "msg": "Error al obtener usuarios." });
    }
});

app.post("/ActualizarUsuario", async (req, resp) => {
    const { idUsuario, usuario, Apellidos, correoUsuario, FechadeNacimiento } = req.body;
    try {
        await dbPool.execute(
            "UPDATE tabla_usuario SET Nombre=?, Apellidos=?, correo=?, FechaNacimiento=? WHERE id_usuario=?",
            [usuario, Apellidos, correoUsuario, FechadeNacimiento, idUsuario]
        );
        resp.json({ msg: "ok", message: "Usuario actualizado correctamente." });
    } catch (err) {
        console.error("Error en /ActualizarUsuario:", err);
        resp.status(500).json({ msg: "Error al actualizar usuario", error: err.message });
    }
});

// --- /publicarAuto ENDPOINT (using dbPool) ---
app.post("/publicarAuto", archivo.array('imagenes_auto', 10), async (req, resp) => {
    console.log("Backend: /publicarAuto received req.body:", req.body); // Keep this for debugging
    console.log("Backend: /publicarAuto received req.files:", req.files ? `${req.files.length} archivo(s)` : "No files received");


    const {
        id_vendedor, Anio_auto, // Assuming you've renamed Año_auto to Anio_auto
        id_categoria, Marca_auto, Modelo_Auto, Color_auto, Estado_auto,
        Transmision_auto, Kilometraje_auto, Precio_auto, Estado, Ciudad, Colonia, Calle
    } = req.body;

    // Refined Backend Validation (using Anio_auto)
    const missingOrInvalidFields = [];
    if (!id_vendedor || String(id_vendedor).trim() === "") missingOrInvalidFields.push("id_vendedor (Vendedor no identificado)");
    if (!id_categoria || String(id_categoria).trim() === "") missingOrInvalidFields.push("id_categoria (Categoría no seleccionada)");
    if (!Marca_auto || Marca_auto.trim() === "") missingOrInvalidFields.push("Marca_auto");
    if (!Modelo_Auto || Modelo_Auto.trim() === "") missingOrInvalidFields.push("Modelo_Auto");
    
    const parsedYear = parseInt(Anio_auto, 10); // Use Anio_auto
    if (!Anio_auto || String(Anio_auto).trim() === "" || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
        missingOrInvalidFields.push(`Anio_auto (Valor actual: ${Anio_auto})`);
    }
    
    const parsedPrecio = parseFloat(Precio_auto);
    if (Precio_auto === undefined || Precio_auto === null || String(Precio_auto).trim() === "" || isNaN(parsedPrecio) || parsedPrecio <= 0) {
        missingOrInvalidFields.push(`Precio_auto (Valor actual: ${Precio_auto})`);
    }
    if (!Color_auto || Color_auto.trim() === "") missingOrInvalidFields.push("Color_auto");
    if (!Estado_auto || Estado_auto.trim() === "") missingOrInvalidFields.push("Estado_auto (Condición del auto)");
    if (!Transmision_auto || Transmision_auto.trim() === "") missingOrInvalidFields.push("Transmision_auto");
    if (Kilometraje_auto === undefined || Kilometraje_auto === null || String(Kilometraje_auto).trim() === "" || parseInt(Kilometraje_auto, 10) < 0) {
        missingOrInvalidFields.push(`Kilometraje_auto (Valor actual: ${Kilometraje_auto})`);
    }
    if (!Estado || Estado.trim() === "") missingOrInvalidFields.push("Estado (Provincia)");
    if (!Ciudad || Ciudad.trim() === "") missingOrInvalidFields.push("Ciudad");

    if (missingOrInvalidFields.length > 0) {
        console.error("Backend validation failed. Missing or invalid fields:", missingOrInvalidFields.join(', '));
        return resp.status(400).json({
            msg: "error",
            error: `Faltan campos obligatorios o son inválidos: ${missingOrInvalidFields.join(', ')}.`
        });
    }
    // END Refined Backend Validation

    if (!req.files || req.files.length === 0) {
        return resp.status(400).json({ msg: "error", error: "Se requiere al menos una imagen para el auto." });
    }

    const fecha_publicacion_auto = new Date();
    const baja_carro = 0; 
    let connection; // Declare connection here to access in finally block

    try {
        connection = await dbPool.getConnection(); // Get a connection from the pool
        await connection.beginTransaction();

        const autoInsertQuery = `
            INSERT INTO tabla_auto 
            (id_categoria, id_vendedor, Marca_auto, Modelo_Auto, Año_auto, Color_auto, Estado_auto, Transmision_auto, Kilometraje_auto, Precio_auto, Baja_carro, fecha_publicacion_auto, Estado, Ciudad, Colonia, Calle) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [autoResult] = await connection.execute(autoInsertQuery, [
            id_categoria, id_vendedor, Marca_auto, Modelo_Auto, Anio_auto, // Use Anio_auto
            Color_auto, Estado_auto, Transmision_auto, Kilometraje_auto, Precio_auto, baja_carro, 
            fecha_publicacion_auto, Estado, Ciudad, Colonia, Calle
        ]);

        const id_auto_nuevo = autoResult.insertId;
        if (!id_auto_nuevo) throw new Error("No se pudo obtener el ID del auto insertado.");

        const fotosInsertPromises = req.files.map(file => {
            const imagenBase64 = file.buffer.toString('base64');
            const fotoInsertQuery = `INSERT INTO tabla_fotos (id_auto, contenido) VALUES (?, ?)`;
            return connection.execute(fotoInsertQuery, [id_auto_nuevo, imagenBase64]);
        });
        await Promise.all(fotosInsertPromises);

        await connection.commit();
        resp.status(201).json({ msg: "ok", message: "Auto publicado con éxito!", id_auto: id_auto_nuevo });

    } catch (error) {
        if (connection) await connection.rollback(); // Rollback only if connection was obtained
        console.error("Error al publicar auto:", error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al publicar el auto.", details: error.message });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
});


app.get("/api/autosPublicados", async (req, resp) => {
    try {
        // Consulta para obtener los autos y su información relevante:
        // - Detalles del auto desde tabla_auto
        // - Nombre del vendedor desde tabla_usuario (JOIN)
        // - La primera foto de tabla_fotos para cada auto (Subconsulta)
        // Asumimos que Baja_carro = 0 significa que el auto está activo y visible
        const query = `
            SELECT
                a.id_auto,
                a.Marca_auto,
                a.Modelo_Auto,
                a.Año_auto,          -- Asegúrate que el formato (YEAR) sea el que esperas
                a.Precio_auto,
                u.Nombre AS nombre_vendedor,
                (SELECT tf.contenido 
                 FROM tabla_fotos tf 
                 WHERE tf.id_auto = a.id_auto 
                 ORDER BY tf.id_foto ASC 
                 LIMIT 1) AS foto_principal_auto  -- Contenido Base64 de la imagen
            FROM
                tabla_auto a
            JOIN
                tabla_usuario u ON a.id_vendedor = u.id_usuario
            WHERE
                a.Baja_carro = 0 OR a.Baja_carro IS NULL 
            ORDER BY
                a.fecha_publicacion_auto DESC; -- Opcional: ordenar por más recientes
        `;

        const [autos] = await dbPool.query(query);

        // Si la foto viene solo como Base64, podrías necesitar prefijarla para el src de la imagen en HTML
        // Esto depende de cómo la almacenes y cómo quieras usarla en el frontend.
        // Si ya la almacenas con el prefijo "data:image/jpeg;base64,", entonces no necesitas esto.
        const autosConFormatoDeImagen = autos.map(auto => {
            if (auto.foto_principal_auto && !auto.foto_principal_auto.startsWith('data:image')) {
                // Asume JPEG por defecto si no tienes el mimetype, o necesitarías almacenarlo también.
                // Para este ejemplo, asumimos que el frontend espera una Data URL completa.
                // Si el campo 'contenido' en tabla_fotos ya es una Data URL, este map no es necesario.
                return {
                    ...auto,
                    // Ajusta 'image/jpeg' según el tipo de imagen que estés guardando
                    foto_principal_auto: `data:image/jpeg;base64,${auto.foto_principal_auto}` 
                };
            }
            return auto;
        });

        resp.json(autosConFormatoDeImagen);

    } catch (error) {
        console.error("Error al obtener autos publicados:", error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al obtener los autos." });
    }
});


app.get("/api/auto/:autoId", async (req, resp) => {
    const { autoId } = req.params;

    if (!autoId || isNaN(parseInt(autoId))) {
        return resp.status(400).json({ msg: "error", error: "ID de auto inválido o no proporcionado." });
    }

    let connection;
    try {
        connection = await dbPool.getConnection();

        // 1. Obtener detalles del auto y del vendedor
        const autoQuery = `
            SELECT
                a.*,  -- Selecciona todas las columnas de tabla_auto
                u.Nombre AS nombre_vendedor,
                u.Apellidos AS apellidos_vendedor, 
                u.correo AS correo_vendedor,
                u.id_usuario AS id_vendedor_usuario 
            FROM
                tabla_auto a
            JOIN
                tabla_usuario u ON a.id_vendedor = u.id_usuario
            WHERE
                a.id_auto = ? AND (a.Baja_carro = 0 OR a.Baja_carro IS NULL);
        `;
        const [autoResults] = await connection.execute(autoQuery, [autoId]);

        if (autoResults.length === 0) {
            return resp.status(404).json({ msg: "error", error: "Auto no encontrado o no disponible." });
        }

        const autoDetalles = autoResults[0];

        // 2. Obtener todas las imágenes del auto
        const fotosQuery = `
            SELECT 
                tf.id_foto,
                tf.contenido  -- Asumimos que 'contenido' es la cadena Base64 de la imagen
            FROM 
                tabla_fotos tf
            WHERE 
                tf.id_auto = ?
            ORDER BY 
                tf.id_foto ASC; 
        `;
        const [fotosResults] = await connection.execute(fotosQuery, [autoId]);

        // Formatear imágenes para que sean Data URLs si no lo están ya
        const imagenesFormateadas = fotosResults.map(foto => {
            if (foto.contenido && !foto.contenido.startsWith('data:image')) {
                // Asume JPEG por defecto; podrías necesitar almacenar/inferir el mimetype
                return {
                    id_foto: foto.id_foto,
                    contenido: `data:image/jpeg;base64,${foto.contenido}`
                };
            }
            return { // Si ya es una Data URL o es null/undefined
                id_foto: foto.id_foto,
                contenido: foto.contenido 
            };
        });

        // Combinar detalles del auto con sus imágenes
        const respuestaCompleta = {
            ...autoDetalles,
            nombre_vendedor: `${autoDetalles.nombre_vendedor || ''} ${autoDetalles.apellidos_vendedor || ''}`.trim(), // Nombre completo del vendedor
            imagenes: imagenesFormateadas // Array de objetos de imagen
        };
        // Ya no necesitamos las columnas separadas de apellidos_vendedor si las combinamos
        delete respuestaCompleta.apellidos_vendedor; 


        resp.json(respuestaCompleta);

    } catch (error) {
        console.error(`Error al obtener detalles del auto ${autoId}:`, error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al obtener los detalles del auto." });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get("/api/autos/vendedor/:vendedorId", async (req, resp) => {
    const { vendedorId } = req.params;
    const autoIdAExcluir = req.query.excluir; // ID del auto actual que se está viendo, para no incluirlo
    const limite = parseInt(req.query.limite, 10) || 4; // Límite de autos a devolver, default 4

    if (!vendedorId || isNaN(parseInt(vendedorId))) {
        return resp.status(400).json({ msg: "error", error: "ID de vendedor inválido o no proporcionado." });
    }

    let queryParams = [vendedorId];
    let sqlQuery = `
        SELECT
            a.id_auto,
            a.Marca_auto,
            a.Modelo_Auto,
            a.Año_auto,
            a.Precio_auto,
            (SELECT tf.contenido 
             FROM tabla_fotos tf 
             WHERE tf.id_auto = a.id_auto 
             ORDER BY tf.id_foto ASC 
             LIMIT 1) AS foto_principal_auto
        FROM
            tabla_auto a
        WHERE
            a.id_vendedor = ? 
            AND (a.Baja_carro = 0 OR a.Baja_carro IS NULL)
    `;

    if (autoIdAExcluir && !isNaN(parseInt(autoIdAExcluir))) {
        sqlQuery += ` AND a.id_auto != ?`;
        queryParams.push(autoIdAExcluir);
    }

    sqlQuery += ` ORDER BY a.fecha_publicacion_auto DESC LIMIT ?`;
    queryParams.push(limite);

    try {
        const [autosDelVendedor] = await dbPool.query(sqlQuery, queryParams);

        const autosFormateados = autosDelVendedor.map(auto => {
            if (auto.foto_principal_auto && !auto.foto_principal_auto.startsWith('data:image')) {
                return {
                    ...auto,
                    foto_principal_auto: `data:image/jpeg;base64,${auto.foto_principal_auto}`
                };
            }
            return auto;
        });

        resp.json(autosFormateados);

    } catch (error) {
        console.error(`Error al obtener autos del vendedor ${vendedorId}:`, error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al obtener las publicaciones del vendedor." });
    }
});

app.get("/api/vendedor/:vendedorId/perfil", async (req, resp) => {
    const { vendedorId } = req.params;

    if (!vendedorId || isNaN(parseInt(vendedorId))) {
        return resp.status(400).json({ msg: "error", error: "ID de vendedor inválido o no proporcionado." });
    }

    let connection;
    try {
        connection = await dbPool.getConnection();

        // 1. Obtener datos del vendedor
        const [vendedorResults] = await connection.execute(
            `SELECT id_usuario, Nombre, Apellidos, foto_perfil 
             FROM tabla_usuario 
             WHERE id_usuario = ? AND (Baja_usuario = 0 OR Baja_usuario IS NULL)`,
            [vendedorId]
        );

        if (vendedorResults.length === 0) {
            return resp.status(404).json({ msg: "error", error: "Perfil de vendedor no encontrado." });
        }
        const perfilVendedor = vendedorResults[0];
        
        // Formatear foto de perfil si existe
        let fotoPerfilFormateada = null;
        if (perfilVendedor.foto_perfil && !perfilVendedor.foto_perfil.startsWith('data:image')) {
            fotoPerfilFormateada = `data:image/jpeg;base64,${perfilVendedor.foto_perfil}`;
        } else if (perfilVendedor.foto_perfil) {
            fotoPerfilFormateada = perfilVendedor.foto_perfil;
        }


        // 2. Obtener reseñas y calcular promedio
        const [resenasResults] = await connection.execute(
            `SELECT 
                r.id_resena, 
                r.texto_resena, 
                r.calificacion_vendedor, 
                r.Fecha_creacion_mensaje, -- Nombre original de la columna
                u_comprador.Nombre AS nombre_comprador 
             FROM tabla_resenas r
             JOIN tabla_usuario u_comprador ON r.id_usuario_comprador = u_comprador.id_usuario
             WHERE r.id_usuario_vendedor = ?
             ORDER BY r.Fecha_creacion_mensaje DESC, r.Hora_creacion_mensaje DESC`, // Asumiendo que también tienes Hora_creacion_mensaje
            [vendedorId]
        );

        let calificacionPromedio = 0;
        if (resenasResults.length > 0) {
            const sumCalificaciones = resenasResults.reduce((sum, resena) => sum + resena.calificacion_vendedor, 0);
            calificacionPromedio = sumCalificaciones / resenasResults.length;
        }

        resp.json({
            id_usuario: perfilVendedor.id_usuario,
            nombre_vendedor: `${perfilVendedor.Nombre} ${perfilVendedor.Apellidos}`.trim(),
            foto_perfil: fotoPerfilFormateada,
            calificacion_promedio: parseFloat(calificacionPromedio.toFixed(1)), // Redondear a 1 decimal
            resenas: resenasResults.map(r => ({
                ...r,
                // Asegúrate que la fecha se formatee como el frontend espera, si es necesario
                // Por ejemplo, si Fecha_creacion_mensaje es un objeto Date:
                // fecha_creacion_mensaje: new Date(r.Fecha_creacion_mensaje).toLocaleDateString('es-MX') 
            }))
        });

    } catch (error) {
        console.error(`Error al obtener perfil del vendedor ${vendedorId}:`, error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al obtener el perfil del vendedor." });
    } finally {
        if (connection) connection.release();
    }
});

app.get("/api/catalogo/vendedor/:vendedorId", async (req, resp) => {
    const { vendedorId } = req.params;
    // const autoIdAExcluir = req.query.excluir; // No es necesario para la página de catálogo principal del vendedor
    // const limite = parseInt(req.query.limite, 10); // No es necesario por defecto, podría ser un query param opcional si se desea paginación

    if (!vendedorId || isNaN(parseInt(vendedorId))) {
        return resp.status(400).json({ msg: "error", error: "ID de vendedor inválido o no proporcionado." });
    }

    let queryParams = [vendedorId];
    let sqlQuery = `
        SELECT
            a.id_auto,
            a.Marca_auto,
            a.Modelo_Auto,
            a.Año_auto,
            a.Precio_auto,
            (SELECT tf.contenido 
             FROM tabla_fotos tf 
             WHERE tf.id_auto = a.id_auto 
             ORDER BY tf.id_foto ASC 
             LIMIT 1) AS foto_principal_auto
        FROM
            tabla_auto a
        WHERE
            a.id_vendedor = ? 
            AND (a.Baja_carro = 0 OR a.Baja_carro IS NULL)
    `;

    // if (limite && !isNaN(limite) && limite > 0) {
    //     sqlQuery += ` LIMIT ?`;
    //     queryParams.push(limite);
    // }
    sqlQuery += ` ORDER BY a.fecha_publicacion_auto DESC`;


    try {
        const [autosDelVendedor] = await dbPool.query(sqlQuery, queryParams);

        const autosFormateados = autosDelVendedor.map(auto => {
            if (auto.foto_principal_auto && !auto.foto_principal_auto.startsWith('data:image')) {
                return {
                    ...auto,
                    foto_principal_auto: `data:image/jpeg;base64,${auto.foto_principal_auto}`
                };
            }
            return auto;
        });

        resp.json(autosFormateados);

    } catch (error) {
        console.error(`Error al obtener catálogo del vendedor ${vendedorId}:`, error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al obtener el catálogo del vendedor." });
    }
});

app.delete("/api/auto/:autoId", async (req, resp) => {
    const { autoId } = req.params;
    // const loggedInUserId = req.user?.idUsuario; // EJEMPLO: Asumiendo que tienes req.user por un middleware de autenticación

    if (!autoId || isNaN(parseInt(autoId))) {
        return resp.status(400).json({ msg: "error", error: "ID de auto inválido o no proporcionado." });
    }

    // --- INICIO LÓGICA DE AUTORIZACIÓN (SIMPLIFICADA) ---
    // En un escenario real, obtendrías el ID del usuario autenticado desde su sesión/token.
    // Y luego verificarías si ese usuario es el `id_vendedor` del auto.
    // Por ahora, esta parte está omitida para mantener el ejemplo enfocado en el soft delete.
    // ¡NO USAR EN PRODUCCIÓN SIN AUTORIZACIÓN ADECUADA!
    // Ejemplo de cómo podrías hacerlo (necesitarías enviar `userIdFromToken` o similar):
    /*
    const { userIdFromRequest } = req.body; // O desde req.user si usas middleware de auth
    if (!userIdFromRequest) {
        return resp.status(401).json({ msg: "error", error: "No autorizado: Usuario no identificado." });
    }
    try {
        const [autoResults] = await dbPool.execute("SELECT id_vendedor FROM tabla_auto WHERE id_auto = ?", [autoId]);
        if (autoResults.length === 0) {
            return resp.status(404).json({ msg: "error", error: "Auto no encontrado." });
        }
        if (autoResults[0].id_vendedor !== parseInt(userIdFromRequest)) {
            return resp.status(403).json({ msg: "error", error: "No autorizado: No eres el propietario de esta publicación." });
        }
    } catch (authError) {
        console.error("Error en verificación de autorización para eliminar:", authError);
        return resp.status(500).json({ msg: "error", error: "Error al verificar autorización." });
    }
    */
    // --- FIN LÓGICA DE AUTORIZACIÓN (SIMPLIFICADA) ---


    let connection;
    try {
        connection = await dbPool.getConnection();
        await connection.beginTransaction();

        // Opcional: Podrías querer eliminar primero las fotos de tabla_fotos si no tienes ON DELETE CASCADE.
        // Si tienes ON DELETE CASCADE en la foreign key de tabla_fotos hacia tabla_auto,
        // este paso no es estrictamente necesario para las fotos, pero es bueno ser explícito
        // o podrías querer hacer un soft delete de las fotos también.
        // Por ahora, asumimos que ON DELETE CASCADE se encarga o que el soft delete del auto es suficiente.

        // Realizar soft delete actualizando Baja_carro = 1
        const [updateResult] = await connection.execute(
            "UPDATE tabla_auto SET Baja_carro = 1 WHERE id_auto = ?",
            [autoId]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback(); // No se encontró el auto para actualizar
            return resp.status(404).json({ msg: "error", error: "Auto no encontrado para eliminar." });
        }

        await connection.commit();
        resp.status(200).json({ msg: "ok", message: "Publicación de auto eliminada (marcada como inactiva) con éxito." });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(`Error al eliminar (soft delete) el auto ${autoId}:`, error);
        resp.status(500).json({ msg: "error", error: "Error interno del servidor al eliminar la publicación." });
    } finally {
        if (connection) connection.release();
    }
});








// --- Server Listener ---
app.listen(3001, () => {
    console.log("Servidor escuchando en el puerto 3001");
});