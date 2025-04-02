import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook para navegación
import Header from "./Header";
import Footer from "./Footer";

function CompraAuto() {
    const [metodoPago, setMetodoPago] = useState("");
    const [formData, setFormData] = useState({
        numeroTarjeta: "",
        fechaVencimiento: "",
        cvv: "",
    });

    const navigate = useNavigate(); // Hook para redirección

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMetodoChange = (e) => {
        setMetodoPago(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del pago:", { metodoPago, ...formData });
        alert("Compra realizada con éxito!");
        navigate("/Componentes/Resenascliente"); // Redirige a la pantalla de reseñas
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
            <br />

            {/* Contenido Principal */}
            <div className="w-full max-w-4xl bg-white p-10 border border-gray-300 bg-opacity-90 rounded-lg shadow-lg mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Compra</h1>
                <hr className="mb-6" />

                {/* Detalles del Auto */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="border border-gray-400 w-full h-48 flex items-center justify-center text-gray-500 text-xl">
                        Foto
                    </div>
                    <div className="border border-gray-300 p-4">
                        <p>
                            <strong>Precio:</strong> 120,000
                        </p>
                        <p>
                            <strong>Vendedor:</strong> Juan Martín
                        </p>
                        <p>
                            <strong>Modelo:</strong> Aveo
                        </p>
                        <p>
                            <strong>Marca:</strong> Chevrolet
                        </p>
                        <p>
                            <strong>Estado:</strong> Daño medio
                        </p>
                        <p>
                            <strong>Ciudad:</strong> Nuevo León
                        </p>
                        <p>
                            <strong>Colonia:</strong> Valles de Guadalupe
                        </p>
                        <p>
                            <strong>Calle:</strong> Isla de Cozumel
                        </p>
                    </div>
                </div>

                {/* Métodos de Pago */}
                <div className="mt-6 bg-gray-100 p-6 border border-gray-300 rounded-lg">
                    <h2 className="text-lg font-bold text-center">Métodos de pago</h2>
                    <hr className="my-4" />

                    <div className="text-center">
                        <label htmlFor="metodoPago">Método de pago:</label>
                        <select
                            id="metodoPago"
                            name="metodoPago"
                            value={metodoPago}
                            onChange={handleMetodoChange}
                            className="border rounded px-2 py-1 ml-2"
                        >
                            <option value="Debito">Débito</option>
                            <option value="Credito">Crédito</option>
                        </select>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="block">
                            Número de tarjeta:
                            <input
                                type="text"
                                name="numeroTarjeta"
                                value={formData.numeroTarjeta}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </label>
                        <label className="block">
                            Fecha de vencimiento:
                            <input
                                type="text"
                                name="fechaVencimiento"
                                value={formData.fechaVencimiento}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </label>
                        <label className="block">
                            CVV:
                            <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </label>

                        {/* Botón para Comprar */}
                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600"
                            >
                                Comprar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <br />
            <Footer />
        </div>
    );
}

export default CompraAuto;