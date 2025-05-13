import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Registro(){

    const[nameuser, setNameUser]=useState('');
    const[email, setEmail]=useState('');
    const[pass, setPass]=useState('');
    const[imagen, setImagen]=useState(null);
    const nav = useNavigate();



    function consola(){
        console.log(nameuser);
        console.log(email);
        console.log(pass);
    }

    const sendDatos = () => {
      const frmData= new FormData();
      frmData.append("usu", nameuser);
      frmData.append("correo", email);
      frmData.append("contra", pass);
      frmData.append("imagen", imagen);


      axios.post(
          "http://localhost:3001/create",
          frmData,
          {
            headers:{'Content-Type': 'multipart/form-data'}
          }
      ).then((respuesta) => {
          if(respuesta.data.msg === "ok"){
            nav("/imagenes");
          }
          
      }).catch((error) => {  // Definir el argumento 'error'
          alert("Ocurrió un error: " + error.message);  // Mostrar el mensaje de error
      });
  };

    return (
    
    <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Correo Electronico</label>
          <input type="email" onChange={(e)=> setEmail(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
          <div id="emailHelp" class="form-text">Nunca compartiremos tu correo con nadie mas.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Nombre</label>
          <input type="text" onChange={(e)=> setNameUser(e.target.value)} class="form-control" id="exampleInputname" aria-describedby="emailHelp"/>
          <div id="nombre" class="form-text">Dejanos saber como te llamas :D.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Foto</label>
          <input type="file" onChange={(e)=> setImagen(e.target.files[0])} id="myFile" name="filename"/>
          <div id="imagen" class="form-text">Una foto de perfil donde salgas guapx ;*.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Contraseña</label>
          <input type="password" onChange={(e)=> setPass(e.target.value)} class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button onClick={sendDatos} type="button" class="btn btn-primary">Submit</button>
      </form>
      
      );

}

export default Registro;