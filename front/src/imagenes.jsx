import axios from "axios";
import {useEffect, useState} from "react";

function Imagenes(){

const [usersData, setUsersD] = useState([])
useEffect(
    ()=>{
axios.get("http://localhost:3001/getUsers",{}).then(
    (resp)=>{
        if(resp.data.msg==="Error"){
            alert("Error al obtener la informacion");
            }else if(resp.data.msg==="No respuesta"){
                alert("no hay info")
            }else{
               setUsersD(resp.data); 
            }
    }
)
    }
    ,[]) 

    return ( 

        
        usersData.map(
            (user, key)=>{
                return(
                    <div className="max-w-xs rounded overflow-hidden shadow-lg" style={{width: "18rem"}}>
                        <img src={'data:image/png;base64,' + user.foto_perfil} className="w-full h-48 object-cover" alt="..."/>
                        <div className="px-6 py-4">
                            <h5 className="font-bold text-xl">{user.nombre}</h5>
                        </div>
                    </div>
                )
            }
        )
        


       
    );


}

export default Imagenes;