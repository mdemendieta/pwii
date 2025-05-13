import React from "react";

function Footer() {
    return (
        <footer className="bg-blue-900 text-white text-center py-6 mt-auto w-full" >
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-4">
                <ul className="list-none">
                    <li className="text-lg">Erick Franco Mendez Estrada</li>
                    <li className="text-lg">Carlos Alberto Bustamante Rivera</li>
                </ul>
                <ul className="list-none">
                    <li className="text-lg">Maximiliano De Mendieta Cavazos</li>
                </ul>
            </div>
            <div className="mt-4 italic text-lg">
                <p>SHOWCAR © Todos los derechos reservados</p>
            </div>
        </footer>
    );
}

export default Footer;