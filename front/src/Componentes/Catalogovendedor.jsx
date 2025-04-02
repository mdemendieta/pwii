import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook para redirección
import Footer from "./Footer";
import Header from "./Header";

function PantallaVehiculos() {
    const [vehiculos, setVehiculos] = useState([
        { id: 1, nombre: "Carro 1", precio: "$XX,XXX", vendedor: "Juan", img: "../Imagenes/carro1.jpg" },
        { id: 2, nombre: "Carro 2", precio: "$XX,XXX", vendedor: "María", img: "../Imagenes/carro2.jpg" },
        { id: 3, nombre: "Carro 3", precio: "$XX,XXX", vendedor: "Carlos", img: "../Imagenes/carro3.jpg" },
        { id: 4, nombre: "Carro 4", precio: "$XX,XXX", vendedor: "Lucía", img: "../Imagenes/carro4.jpg" },
    ]);

    const navigate = useNavigate(); // Hook para manejar la redirección

    // Función para manejar el clic en un auto
    const handleAutoClick = (id) => {
        navigate(`/Componentes/Detallesautovendedor?id=${id}`); // Redirige con el ID del auto
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')",
            }}
        >
            {/* Header */}
            <Header />
            <br />
            <br />

            <div className="flex flex-grow mt-16">
                {/* Sidebar */}
                <aside className="w-64 bg-blue-950 p-6 flex flex-col items-start">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
                        <div className="text-center mb-6">
                            <h3 className="mt-3 text-lg font-bold text-white">Calificacion</h3>
                            <div className="text-yellow-400 text-xl">★★★★★</div>
                        </div>
                        <h3 className="text-lg font-bold text-center text-white">Reseñas</h3>
                        <div className="bg-gray-800 p-3 mt-3 rounded-lg text-sm text-white">
                            <p>"Excelente vendedor, muy confiable!"</p>
                            <div className="text-yellow-400">★★★★☆</div>
                        </div>
                        <div className="bg-gray-800 p-3 mt-3 rounded-lg text-sm text-white">
                            <p>"El auto llegó en perfecto estado."</p>
                            <div className="text-yellow-400">★★★★★</div>
                        </div>
                        <div className="bg-gray-800 p-3 mt-3 rounded-lg text-sm text-white">
                            <p>"Buena atención, pero algo demorado el envío."</p>
                            <div className="text-yellow-400">★★★☆☆</div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10 bg-blue-100 bg-opacity-80 rounded-lg">
                    <div className="text-center bg-gray-200 p-4 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {vehiculos.map((vehiculo) => (
                            <div
                                key={vehiculo.id}
                                className="bg-white text-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                                onClick={() => handleAutoClick(vehiculo.id)} // Maneja el clic para redirigir
                            >
                                <img
                                    src={vehiculo.img}
                                    alt={vehiculo.nombre}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <p className="mt-2 font-bold text-center">{vehiculo.nombre}</p>
                                <p className="text-center">Precio: {vehiculo.precio}</p>
                                <p className="text-center">Vendedor: {vehiculo.vendedor}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            <br />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default PantallaVehiculos;