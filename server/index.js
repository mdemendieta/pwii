const express = require('express');
const app = express();
const cors =require('cors');
const mysql=require('mysql2');
const multer = require('multer');

app.use(cors());
app.use(express.json());

app.listen(3001,
    ()=>{
        console.log("escuchando en el puerto 3001")
    }
)

const db=mysql.createConnection(
{
    host:"localhost",
    user:"root",
    password:"1234",
    database:"showcar"
}
)

const fileFilter=(req,file,cb)=>{
    const formatos = ['image/png','image/jpg','image/jpeg'];

    if (formatos.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb (new Error('Archivo no aceptado'));
    }
}

const strg = multer.memoryStorage();
const archivo = multer({
    storage: strg,
    fileFilter: fileFilter
})

app.post("/create",archivo.single('imagen'), (req, resp) => {
    const usuario = req.body.user;
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const fecha = req.body.fecha;
    const rol = req.body.rol;
    const genero = req.body.genero;
    const contra = req.body.contra;

    const imagen64=req.file.buffer.toString('base64');

    db.query('INSERT INTO tabla_usuario(Nombre, Apellidos, FechaNacimiento, Genero, Tipo_usuario, username, correo, contrasena, foto_perfil) VALUES (?,?,?,?,?,?,?,?,?)', 
        [nombre, apellidos, fecha, genero, rol, usuario, correo, contra,imagen64], 
        (err, data) => {
            if (err) {
                console.log(err);
                resp.status(500).json({ message: "Error al insertar en la base de datos", error: err });
            } else {
                resp.json(
                   {"msg":"ok"}
                )
                console.log("info insertada");
                resp.status(200).json({ message: "Usuario creado con éxito" });
            }
        }
    );
});

app.post("/Login", (req, resp) => {
    db.query('SELECT * FROM tabla_usuario WHERE correo=? AND contrasena=?',
        [req.body.email, req.body.passw],
        (err, data) => {
            if (err) {
                console.log(err);
                resp.status(500).json({ error: "Error en el servidor" });
            } else {
                if (data.length > 0) {
                    resp.json({
                        alert: "Encontrado",
                        idUsuario: data[0].id_usuario,                        
                        usuario: data[0].Nombre,
                        Apellidos: data[0].Apellidos,
                        FechadeNacimiento: data[0].FechaNacimiento,
                        correoUsuario: data[0].correo,
                        tipoUsuario: data[0].Tipo_usuario,
                        FotoPerfil: data[0].foto_perfil
                    });
                } else {
                    resp.json({ alert: "No Encontrado" });
                }
            }
        }
    );
});

app.get("/getUsers",
    (req,resp)=>{
        db.query("SELECT nombre, foto_perfil FROM tabla_usuario",
            (err,data)=>{
                if(err){
                    resp.json({
                        "msg": "Error"
                    })
                }else if(data.length>0){
                    resp.json(data);
                    console.log(data);
                }else{
                    resp.json({
                        "msg":"No respuesta"
                    })
                }
            }
        )
    });
    

app.post("/ActualizarUsuario", (req, resp) => {
    const { idUsuario, usuario, Apellidos, correoUsuario, FechadeNacimiento } = req.body;

    db.query(
        "UPDATE tabla_usuario SET Nombre=?, Apellidos=?, correo=?, FechaNacimiento=? WHERE id_usuario=?",
        [usuario, Apellidos, correoUsuario, FechadeNacimiento, idUsuario],
        (err, data) => {
            if (err) {
                console.log(err);
                resp.status(500).json({ msg: "Error al actualizar usuario", error: err });
            } else {
                resp.json({ msg: "ok" });
                console.log("Usuario actualizado correctamente.");
            }
        }
    );
});

