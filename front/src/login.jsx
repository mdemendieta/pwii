import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login(){
    const[correo, setEmail]=useState('');
    const[contra, setContra]=useState('');
    const nav = useNavigate();

    const login = () =>{
        axios.post("http://localhost:3001/Login",
            {
                email: correo,
                passw: contra
            }
        ).then(

            (respuesta)=>{
                if(respuesta.data.alert==="Encontrado"){
                    console.log(respuesta);
                    alert("Usuario encontrado");
                    localStorage.setItem('sesion', JSON.stringify(respuesta.data.usuario))
                    nav("/Home");
                }else{
                    alert("Usuario no encontrado");
                }
            }

        ).catch(
            (error)=>{
                console.log(error);
            }
        )

    }

    return(
    <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Correo Electronico</label>
          <input type="email" onChange={(e)=> setEmail(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
          <div id="emailHelp" class="form-text">Nunca compartiremos tu correo con nadie mas.</div>
        </div>

        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Contraseña</label>
          <input type="password" onChange={(e)=> setContra(e.target.value)} class="form-control" id="exampleInputPassword1"/>
        </div>

        <button onClick={(login)} type="button" class="btn btn-primary">Submit</button>
        <Link to="/SignUp">"Registrate aqui uwu"</Link>
    </form>
    )
}
export default Login;