const express = require('express');
const app = express();
const cors =require('cors');
const mysql=require('mysql');
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
    database:"pwii"
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
                resp.json({ message: "Error al insertar en la base de datos", error: err });
            } else {
                resp.json(
                   {"msg":"ok"}
                )
                console.log("info insertada");
                //resp.json({ message: "Usuario creado con éxito" });
            }
        }
    );
});

app.post("/Login",
    (req,resp)=>{
        db.query('SELECT * FROM TABLA_USUARIO WHERE correo=? AND contrasena =?',
            [req.body.email, req.body.passw],
            (err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    if(data.length>0){
                        resp.json(
                            {
                                "alert": 'Encontrado',
                                "usuario": data[0].nombre
                            }
                        )
                    }else{
                        resp.json(
                            {
                                "alert":'No Encontrado'
                            }
                        )
                    }
                }
            }
        )
    }
)

app.get("/getUsers",
    (req,resp)=>{
        db.query("SELECT nombre, foto, id FROM usuario",
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
    })

 app.put("/modificar/:usuario",
    (req,resp)=>{
        const nuevoNom=req.body.newNom;
        const newCorr=req.body.newEmail;
        const usModificar=reqparams.usuario;

        db.query('UPDATE usuario set nombre=?, correo=? where id=?',
            [nuevoNom,newCorr,usModificar],
            (err,res)=>{
                if(err){
                    resp.json({status:"error"})
                }else{
                    resp.json({status:"ok"})
                }
            }
        )
    }
 )   

 app.delete("/eliminar/:id",
    (req,resp)=>{

        db.query('DELETE FROM usuario where id=?',
            req.params.id,
            (err,res)=>{
                if(err){
                    console.log(err);
                    resp.json({status:"error"})
                }else{
                    resp.json({status:"eliminado"})
                }
            }
        )
    }
 )  
