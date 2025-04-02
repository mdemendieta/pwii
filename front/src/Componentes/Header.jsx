import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-purple-800 bg-opacity-75 text-white py-3 px-8 z-10">
            {/* Logo */}
            <div className="logo">
                <img src={require('./imagenes/logoauto.png')} alt="Logo" className="w-24 h-15" /> {/* Reducido el tamaño */}
            </div>

            {/* Navigation */}
            <nav className="nav-opciones">
                <ul className="flex gap-6 list-none">
                    <li>
                        <Link to="/Componentes/PantallaPrincipal" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Catalogousuario" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Catálogo
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Catalogovendedor" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Catálogo
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/ChatVendedor" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Chat
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Perfilcliente" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Perfil cliente
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Perfilvendedor" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Perfil vendedor
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Reportes" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Reportes
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Publicarauto" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Publicar autos
                        </Link>
                    </li>
                    <li>
                        <Link to="/Componentes/Landing" className="text-lg hover:bg-purple-600 rounded px-3 py-2 transition">
                            Iniciar Sesión
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;