import { useEffect, useState } from 'react';

function Modificar({ verModificar, name, nameMod, funcMod }) {
    const [nameUser, setNameUser] = useState('');
    const [email, setEmail] = useState('');
    const [idUM, setIdUM] = useState(0);

    useEffect(() => {
        if (nameMod) { // Asegurar que nameMod esté definido
            setNameUser(nameMod.nombre || '');
            setEmail(nameMod.correo || '');
            setIdUM(nameMod.id || 0);
        }
    }, [nameMod]);

    if (!verModificar || !nameMod) return null; // Si no debe mostrarse, no renderizar

    return (
        <div id={name}>
            <h1>Modificar</h1>
            <div className="mb-3">
                <label>Nombre completo</label>
                <input 
                    value={nameUser} 
                    type="text" 
                    onChange={(e) => setNameUser(e.target.value)} 
                    className=""
                />
            </div>
            <div className="mb-3">
                <label>Correo</label>
                <input 
                    value={email} 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    className=""
                />
            </div>
            <button 
                className="" 
                onClick={() => funcMod(nameUser, email, idUM)}
            >
                Modificar
            </button>
        </div>
    );
}

export default Modificar;
