import axios from 'axios';
import Modificar from "./Modificar";
import { useEffect, useState } from 'react';

function Imagenes() {
    const [usersData, setUsersD] = useState([]);
    const [verMod, setVerMod] = useState(false);
    const [del, setDel] = useState(false);
    const [usMod, setUsMod] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/getUsers")
            .then((resp) => {
                if (resp.data.msg === "Error") {
                    alert("Error al obtener la información");
                } else if (resp.data.msg === "No respuesta") {
                    setUsersD([]);
                    alert("No hay info");
                } else {
                    setUsersD(resp.data);
                    setDel(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [verMod, del]);

    const modificarInfo = (nom, correo, usuMod) => {
        axios.put(`http://localhost:3001/modificar/${usuMod}`, {
            newNom: nom,
            newEmail: correo // Corrección de 'nerEmail' a 'newEmail'
        }).then((resp) => {
            if (resp.data.status === 'OK') {
                alert("Usuario modificado");
                setVerMod(false);
                setDel(true); // Para refrescar la lista después de la modificación
            } else {
                alert("Error al modificar");
            }
        }).catch(error => console.log(error));
    };

    const eliminar = (idUEliminar) => {
        axios.delete(`http://localhost:3001/eliminar/${idUEliminar}`)
            .then((resp) => {
                if (resp.data.msg === 'Eliminado') {
                    alert("Usuario eliminado");
                    setDel(true);
                } else {
                    alert("Error al eliminar usuario");
                }
            }).catch(error => console.log(error));
    };


    console.log("IDs de usuarios:", usersData.map(user => user.id));
    console.log("usersData:", usersData);
    return (
        <div>
            {usersData.map((user, key) => (
            <div key={user.id}>
                
                    
                    <div >
                        
                        <div>
                            <img 
                                src={user.foto ? `data:image/png;base64,${user.foto}` : "placeholder.png"} 
                                alt="Foto de usuario" 
                            />
                            <div>
                                <h5>{user.nombre}</h5>
                            </div>
                            <div>
                                <button type="button" onClick={() => {
                                    setVerMod(true);
                                    setUsMod(user);
                                }}>
                                    Modificar
                                </button>

                                <button onClick={() => console.log("Intentando eliminar usuario con ID:", user.id) || eliminar(user.id)}>
                                Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
               
            </div> ))}
            

            {verMod && usMod && (
                <Modificar 
                    funcMod={modificarInfo} 
                    nameMod={usMod} 
                    verModificar={verMod} 
                />
            )}
        </div>
    );
}

export default Imagenes;
