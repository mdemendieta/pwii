import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Landing(){
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

    const[nombre, setNombre]=useState('');
    const[apellidos, setApellidos]=useState('');
    const[genero, setGenero]=useState('');
    const[rol, setRol]=useState('');
    const[user, setUser]=useState('');
    const[fecha, setFecha]=useState('');
    
    const[correo, setCorreo]=useState('');
    const[contra, setContra]=useState('');
    
    const[imagen, setImagen]=useState(null);
    const nav = useNavigate();

    function consola(){
        console.log(user);
        console.log(correo);
        console.log(contra);

        console.log(fecha);
        console.log(rol);
        console.log(genero);
        console.log(nombre);
        console.log(apellidos);
    }

    const sendDatos = () => {
        const frmData= new FormData();
        frmData.append("user", user);
        frmData.append("correo", correo);
        frmData.append("contra", contra);
        frmData.append("nombre", nombre);
        frmData.append("apellidos", apellidos);
        frmData.append("fecha", fecha);
        frmData.append("rol", rol);
        frmData.append("genero", genero);
        frmData.append("imagen", imagen);
  
        axios.post(
            "http://localhost:3001/create",
            frmData,
            {
              headers:{'Content-Type': 'multipart/form-data'}
            }
        ).then((respuesta) => {
            if(respuesta.data.msg === "ok"){
              nav("/PantallaPrincipal");
            }
            
        }).catch((error) => {  // Definir el argumento 'error'
            alert("Ocurrió un error: " + error.message);  // Mostrar el mensaje de error
        });
    }
    
    const login = () =>{
      axios.post("http://localhost:3001/login",
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

    };

  return (
  
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://www.kbb.com/wp-content/uploads/2022/08/2022-mercedes-amg-eqs-front-left-3qtr.jpg')" }}>
      <div className="flex flex-col items-center justify-center flex-grow bg-black bg-opacity-50 px-4 py-12">

       <Header />
       <br></br>

        <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-6">
          Compra y Venta de Autos Nuevos y Seminuevos
        </h1>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-center text-center p-4">
            <h2 className="text-2xl font-semibold mb-3">Encuentra tu próximo auto</h2>
            <p className="text-gray-600">
              Navega entre una amplia selección de autos nuevos y seminuevos. La mejor experiencia de compra al alcance de un clic.
            </p>
          </div>

          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-50 rounded-lg shadow-md"
          >
            <h2 className="text-center text-xl font-semibold mb-4">
              {isLogin ? "Inicia Sesión" : "Regístrate"}
            </h2>
            <form>
              {!isLogin && (
                <div>
                    <div className="mb-3">
                    <label htmlFor="Nombre" className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="Nombre"
                        onChange={(e)=> setNombre(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ingresa tu(s) nombre(s)"
                        required
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="Apellidos" className="block text-gray-700">Apellidos</label>
                    <input
                        type="text"
                        id="Apellidos"
                        onChange={(e)=> setApellidos(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ingresa tus Apellidos"
                        required
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="Fecha de Nacimiento" className="block text-gray-700">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        id="fechadenacimiento"
                        onChange={(e)=> setFecha(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Genero" className="block text-gray-700">Género</label>
                        <div className="flex items-center space-x-6 mb-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="masculino"
                                    onChange={(e)=> setGenero(e.target.value)}
                                    name="genero"
                                    value="0"
                                    className="mr-2"
                                    required
                                />
                                Masculino
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="femenino"
                                    onChange={(e)=> setGenero(e.target.value)}
                                    name="genero"
                                    value="1"
                                    className="mr-2"
                                    required
                                />
                                Femenino
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="otro"
                                    onChange={(e)=> setGenero(e.target.value)}
                                    name="genero"
                                    value="2"
                                    className="mr-2"
                                    required
                                />
                                Prefiero no decirlo
                            </label>
                            </div>
                        </div>
                        <label htmlFor="Rol de Usuario" className="block text-gray-700">Rol de Usuario</label>
                        <div className="flex items-center space-x-6 mb-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="comprador"
                                    onChange={(e)=> setRol(e.target.value)}
                                    name="rol de usuario"
                                    value="1"
                                    className="mr-2"
                                    required
                                />
                                Comprador
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="vendedor"
                                    onChange={(e)=> setRol(e.target.value)}
                                    name="rol de usuario"
                                    value="2"
                                    className="mr-2"
                                    required
                                />
                                Vendedor
                            </label>
                            
                        </div>
                        
                        <div className="mb-3">
                        <label htmlFor="Nombre de Usuario" className="block text-gray-700">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            onChange={(e)=> setUser(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        </div>
                        <div className="mb-3">
                        <label htmlFor="Foto" className="block text-gray-700">Foto de perifl</label>
                        <input
                            type="file"
                            id="foto"
                            onChange={(e)=> setImagen(e.target.files[0])}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="foto.jpg"
                            accept="image/jpeg, image/png, image/jpg"
                            required
                        />
                        </div>
                     </div>
                    


              )}


              <div className="mb-3">
                <label htmlFor="email" className="block text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  onChange={(e)=> setCorreo(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ingresa tu correo"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="block text-gray-700">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  onChange={(e)=> setContra(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
              <button 
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                onClick={isLogin ? login : sendDatos}
              >
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </button>
            </form>
            <button
              className="w-full mt-3 text-blue-500 hover:underline text-center"
              onClick={handleToggleForm}
            >
              {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
