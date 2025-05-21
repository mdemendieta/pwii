import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (usuarioGuardado && usuarioGuardado !== "undefined") { 
            try {
                const datosUsuario = JSON.parse(usuarioGuardado);
                setUsuario(datosUsuario);
            } catch (error) {
                console.error("Error al parsear usuario:", error);
                localStorage.removeItem("usuario"); 
            }
        }
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("usuario"); 
        setUsuario(null); 
        window.location.href = "/Landing"; 
    };

    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-purple-800 bg-opacity-75 text-white py-3 px-8 z-10">
            <div className="logo">
                <img src={require("./imagenes/logoauto.png")} alt="Logo" className="w-24 h-15" />
            </div>

            <nav className="nav-opciones">
                <ul className="flex gap-6 list-none">
                    {usuario ? (
                        <>
                            <li>
                                <Link to="/PantallaPrincipal" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                    Inicio
                                </Link>
                            </li>

                            {usuario.tipoUsuario === 2 && (
                                <>
                                    <li>
                                        <Link to="/Catalogovendedor" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Catálogo
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/ChatVendedor" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Chat
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Perfilvendedor" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Perfil vendedor
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Reportes" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Reportes
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Publicarauto" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Publicar autos
                                        </Link>
                                    </li>
                                </>
                            )}

                            {usuario.tipoUsuario === 1 && (
                                <>
                                    
                                    <li>
                                        <Link to="/Perfilcliente" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Perfil cliente
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Reportes" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                            Reportes
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li>
                                <span className="text-lg font-bold">
                                    Bienvenido, {usuario.usuario ? usuario.usuario : "Usuario desconocido"}!
                                </span>
                            </li>
                            <li>
                                <button onClick={cerrarSesion} className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                    Cerrar Sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/Landing" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                                Iniciar Sesión
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;