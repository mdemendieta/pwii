import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";

function MensajesDirectos() {
    const [mensajes, setMensajes] = useState([
        { id: 1, texto: "Ejemplo 1", tipo: "recibido" },
        { id: 2, texto: "Ejemplo 2", tipo: "enviado" },
    ]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");

    const handleEnviarMensaje = () => {
        if (nuevoMensaje.trim() !== "") {
            setMensajes([
                ...mensajes,
                { id: mensajes.length + 1, texto: nuevoMensaje, tipo: "enviado" },
            ]);
            setNuevoMensaje("");
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center"
            style={{
                backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')",
            }}
        >
            {/* Header */}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Header />

            {/* Contenedor Principal */}
            <div className="flex justify-center mt-8">
                <div className="flex w-2/4 h-[300vh] bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/3 bg-blue-900 p-6 text-gray-400 flex flex-col">
                        <h2 className="text-lg text-white mb-6">
                            Chats con clientes
                        </h2>
                        <div className="flex items-center mb-6 space-x-3">
                            <input
                                type="text"
                                id="Usuario"
                                placeholder="Buscar usuario..."
                                className="w-2/3 px-2 py-1 text-sm text-gray-700 rounded-l-md border border-gray-300"
                            />
                            <button className="px-2 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-r-md">
                                Buscar
                            </button>
                        </div>
                        <ul className="space-y-4 overflow-y-auto">
                            <li className="px-0 py-2 text-sm text-white bg-blue-800 hover:bg-blue-700 rounded-md cursor-pointer">
                                Usuario 1
                            </li>
                            <li className="px-0 py-2 text-sm text-white bg-blue-800 hover:bg-blue-700 rounded-md cursor-pointer">
                                Usuario 2
                            </li>
                            <li className="px-0 py-2 text-sm text-white bg-blue-800 hover:bg-blue-700 rounded-md cursor-pointer">
                                Usuario 3
                            </li>
                            <li className="px-0 py-2 text-sm text-white bg-blue-800 hover:bg-blue-700 rounded-md cursor-pointer">
                                Usuario 4
                            </li>
                            <li className="px-0 py-2 text-sm text-white bg-blue-800 hover:bg-blue-700 rounded-md cursor-pointer">
                                Usuario 5
                            </li>
                            <li className="px-0 py-2 text-sm text-white bg-blue-800 hover:bg-blue-700 rounded-md cursor-pointer">
                                Usuario 6
                            </li>
                        </ul>
                    </div>

                    {/* Ventana de chat */}
                    <div className="w-2/3 flex flex-col bg-gray-200">
                        {/* Header del Chat */}
                        <div className="flex items-center justify-between px-6 py-4 bg-blue-800 text-white">
                            <h3 className="text-xl font-bold">Usuario 1</h3>
                        </div>

                        {/* Mensajes */}
                        <div className="flex-grow px-6 py-4 space-y-4 overflow-y-auto bg-gray-100">
                            {mensajes.map((mensaje) => (
                                <div
                                    key={mensaje.id}
                                    className={`px-2 py-1 rounded-md text-sm max-w-[70%] ${
                                        mensaje.tipo === "recibido"
                                            ? "bg-gray-300 self-start"
                                            : "bg-blue-500 text-white self-end"
                                    }`}
                                >
                                    {mensaje.texto}
                                </div>
                            ))}
                        </div>

                        {/* Input de Mensaje */}
                        <div className="flex items-center px-6 py-4 bg-gray-300 border-t border-gray-200">
                            <input
                                type="text"
                                id="message-box"
                                value={nuevoMensaje}
                                onChange={(e) => setNuevoMensaje(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="w-[85%] px-5 py-1 text-sm rounded-md border border-gray-300"
                            />
                            <button
                                id="send-btn"
                                onClick={handleEnviarMensaje}
                                className="ml-4 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default MensajesDirectos;