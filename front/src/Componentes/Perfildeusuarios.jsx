import React, { useState, useEffect } from "react";
import axios from "axios";

function Perfildeusuarios() {
    const [isEditable, setIsEditable] = useState(false);  
    const [usuario, setUsuario] = useState({});  

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (usuarioGuardado && usuarioGuardado !== "undefined") {
            try {
                const datosUsuario = JSON.parse(usuarioGuardado);
                setUsuario(datosUsuario);
            } catch (error) {
                console.error("Error al parsear usuario:", error);
            }
        }
    }, []);

    const handleEditClick = () => {
        setIsEditable(true);
    };


    const EditarUsuario = () => {
        axios.post("http://localhost:3001/ActualizarUsuario", {
            idUsuario: usuario.idUsuario,
            usuario: usuario.usuario,
            Apellidos: usuario.Apellidos,
            correoUsuario: usuario.correoUsuario,
            FechadeNacimiento: usuario.FechadeNacimiento.split("T")[0] // Formato correcto
        })
        .then((resp) => {
            if (resp.data.msg === "ok") {
                alert("Datos actualizados correctamente.");
                localStorage.setItem("usuario", JSON.stringify(usuario)); // Actualiza localStorage
                setIsEditable(false);
            } else {
                alert("Error al actualizar los datos.");
            }
        })
        .catch((error) => {
            console.error("Error al actualizar usuario:", error);
        });
    };

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex-grow flex items-center justify-center py-8">
            <div className="border border-gray-400 p-6 bg-white bg-opacity-80 shadow-md w-[900px]">
                <h1 className="text-center text-2xl font-sans mb-4">Perfil de usuario:</h1>
                <div className="flex flex-col flex-grow space-y-2">
                    <label className="flex items-center">
                        Nombre:
                        <input
                            type="text"
                            name="usuario"
                            className="ml-2 border border-gray-400 px-2 py-1 flex-grow"
                            value={usuario.usuario || ""}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <label className="flex items-center">
                        Apellidos:
                        <input
                            type="text"
                            name="Apellidos"
                            className="ml-2 border border-gray-400 px-2 py-1 flex-grow"
                            value={usuario.Apellidos || ""}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <label className="flex items-center">
                        Correo:
                        <input
                            type="email"
                            name="correoUsuario"
                            className="ml-2 border border-gray-400 px-2 py-1 flex-grow"
                            value={usuario.correoUsuario || ""}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </label>
                    <label className="flex items-center">
                        Fecha de nacimiento:
                        <input
                            type="date"
                            name="FechadeNacimiento"
                            className="ml-2 border border-gray-400 px-2 py-1"
                            value={usuario.FechadeNacimiento ? usuario.FechadeNacimiento.split("T")[0] : ""}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                {/* Botones */}
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 active:bg-blue-800 transition"
                        onClick={handleEditClick}
                    >
                        Editar
                    </button>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 active:bg-blue-800 transition"
                        onClick={EditarUsuario}
                        disabled={!isEditable}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Perfildeusuarios;