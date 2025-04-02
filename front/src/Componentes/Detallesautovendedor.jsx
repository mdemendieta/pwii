import React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook para redirección
import Header from "./Header";
import Footer from "./Footer";

function DetallesAuto() {
    const autosRecomendados = [
        { nombre: "Chevrolet Aveo", precio: "$100,000", imagen: "Foto" },
        { nombre: "Jeep GrandCherokee", precio: "$250,000", imagen: "Foto" },
        { nombre: "Nissan Versa", precio: "$120,000", imagen: "Foto" },
        { nombre: "Nissan Sentra", precio: "$180,000", imagen: "Foto" },
    ];

    const navigate = useNavigate(); // Hook para manejar la redirección

    // Función para manejar clic en el botón "Editar"
    const handleEditClick = () => {
        navigate("/Componentes/EditarPublicacion"); // Redirige a la pantalla EditarPublicacion
    };

    // Función para manejar clic en el botón "Eliminar"
    const handleDeleteClick = () => {
        alert("Publicación eliminada"); // Muestra el mensaje al eliminar
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
            <br></br>
            <br></br>
            <br></br>

            <main className="flex-grow flex justify-center items-center p-12">
                <div className="max-w-8xl w-full min-h-[90vh] p-12 border rounded-xl bg-opacity-80 shadow-2xl bg-white">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-12">
                            <div className="border rounded-xl h-96 flex items-center justify-center bg-gray-100 text-gray-600 text-3xl">
                                Foto.
                            </div>

                            <div className="border rounded-xl p-8 bg-white">
                                <h2 className="font-semibold text-center mb-6 text-3xl">
                                    Autos que podrían interesarte
                                </h2>
                                <div className="grid grid-cols-4 gap-6">
                                    {autosRecomendados.map((auto, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-6 text-center bg-gray-50"
                                        >
                                            <div className="h-24 flex items-center justify-center border-b text-gray-600 text-2xl">
                                                {auto.imagen}
                                            </div>
                                            <div className="mt-3 text-2xl">{auto.nombre}</div>
                                            <div className="text-2xl font-semibold">{auto.precio}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="border rounded-xl p-10 bg-white">
                                <div className="flex justify-between text-2xl text-gray-600">
                                    <span>2020</span>
                                    <span>100,110 km</span>
                                </div>
                                <h1 className="text-4xl font-bold mt-6">Toyota Corolla</h1>
                                <p className="text-3xl font-semibold text-gray-800">$180,000</p>
                                <div className="mt-8 flex space-x-8">
                                    <button
                                        className="bg-blue-600 text-white px-8 py-4 rounded-xl text-2xl"
                                        onClick={handleDeleteClick} // Llama a la función para mostrar el mensaje
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-8 py-4 rounded-xl text-2xl"
                                        onClick={handleEditClick} // Llama a la función para redirección
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>

                            <div className="border rounded-xl p-10 bg-white">
                                <h2 className="font-semibold text-3xl">Descripción:</h2>
                                <p className="text-gray-700 text-2xl leading-relaxed">
                                    <strong>Modelo:</strong> Corolla. <br />
                                    <strong>Marca:</strong> Toyota. <br />
                                    <strong>Color:</strong> Rojo. <br />
                                    <strong>Año:</strong> 2020. <br />
                                    <strong>Transmisión:</strong> Manual. <br />
                                    <strong>Estado:</strong> Daño mínimo. <br />
                                    <strong>Vendedor:</strong> Juan Rodriguez. <br />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default DetallesAuto;