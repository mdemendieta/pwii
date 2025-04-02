import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function PerfilVendedor() {
    const [isEditable, setIsEditable] = useState(false); // Estado para controlar edición
    const [image, setImage] = useState(null); // Estado para almacenar la imagen seleccionada

    // Función para habilitar los campos y el botón "Elegir"
    const handleEditClick = () => {
        setIsEditable(true);
    };

    // Función para mostrar el mensaje al guardar
    const handleSaveClick = () => {
        alert("Se modificó con éxito"); // Mensaje de éxito
        setIsEditable(false); // Deshabilita los campos y botón
    };

    // Función para manejar la selección de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result); // Guarda la imagen como base64
            };
            reader.readAsDataURL(file); // Lee el archivo seleccionado
        }
    };

    const autosVendidos = [
        { imagen: "Foto", modelo: "Corolla", marca: "Toyota", año: 2020, precio: "180,000", comprador: "Juan Rodriguez" },
        { imagen: "Foto", modelo: "City", marca: "Toyota", año: 2020, precio: "100,000", comprador: "Alejandro Lopez" },
        { imagen: "Foto", modelo: "Rav", marca: "Toyota", año: 2020, precio: "220,000", comprador: "Angel Melendez" },
    ];

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

            {/* Perfil de Vendedor */}
            <div className="flex-grow flex items-center justify-center py-8">
                <div className="border border-gray-400 p-6 bg-white bg-opacity-80 shadow-md w-[900px]">
                    <h1 className="text-center text-2xl font-sans mb-4">Perfil de vendedor:</h1>
                    <div className="flex">
                        {/* Foto del Vendedor */}
                        <div className="flex flex-col items-center mr-6">
                            <div className="w-24 h-24 border border-gray-400 flex items-center justify-center text-gray-500">
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Foto del vendedor"
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    "Foto"
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="fileInput"
                                onChange={handleImageChange}
                                disabled={!isEditable} // Deshabilita si no está en modo editable
                            />
                            <label
                                htmlFor="fileInput"
                                className={`bg-blue-600 text-white px-6 py-2 rounded-md shadow-md mt-4 ${
                                    isEditable
                                        ? "hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                            >
                                Elegir
                            </label>
                        </div>
                        {/* Información del Vendedor */}
                        <div className="flex flex-col flex-grow space-y-2">
                            <label className="flex items-center">
                                Nombre:
                                <input
                                    type="text"
                                    className="ml-2 border border-gray-400 px-2 py-1 flex-grow"
                                    disabled={!isEditable} // Deshabilita si no está en modo editable
                                />
                            </label>
                            <label className="flex items-center">
                                Apellidos:
                                <input
                                    type="text"
                                    className="ml-2 border border-gray-400 px-2 py-1 flex-grow"
                                    disabled={!isEditable} // Deshabilita si no está en modo editable
                                />
                            </label>
                            <label className="flex items-center">
                                Correo:
                                <input
                                    type="email"
                                    className="ml-2 border border-gray-400 px-2 py-1 flex-grow"
                                    disabled={!isEditable} // Deshabilita si no está en modo editable
                                />
                            </label>
                            <label className="flex items-center">
                                Fecha de nacimiento:
                                <input
                                    type="date"
                                    className="ml-2 border border-gray-400 px-2 py-1"
                                    disabled={!isEditable} // Deshabilita si no está en modo editable
                                />
                            </label>
                        </div>
                    </div>
                    {/* Botones */}
                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 active:bg-blue-800 transition"
                            onClick={handleEditClick} // Habilita los campos
                        >
                            Editar
                        </button>
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 active:bg-blue-800 transition"
                            onClick={handleSaveClick} // Muestra el mensaje y desactiva los campos
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* Autos Vendidos */}
            <div className="flex justify-center items-center py-8">
                <div className="border border-gray-400 p-8 bg-white bg-opacity-80 shadow-lg w-[900px]">
                    <h1 className="text-center text-2xl font-semibold mb-6">Autos vendidos.</h1>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-black text-center">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-black px-4 py-2">Imagen.</th>
                                    <th className="border border-black px-4 py-2">Modelo.</th>
                                    <th className="border border-black px-4 py-2">Marca.</th>
                                    <th className="border border-black px-4 py-2">Año.</th>
                                    <th className="border border-black px-4 py-2">Precio.</th>
                                    <th className="border border-black px-4 py-2">Comprador.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {autosVendidos.map((auto, index) => (
                                    <tr key={index}>
                                        <td className="border border-black px-4 py-2">
                                            <div className="w-16 h-16 bg-white-300 border border-black flex items-center justify-center">
                                                {auto.imagen}
                                            </div>
                                        </td>
                                        <td className="border border-black px-4 py-2">{auto.modelo}</td>
                                        <td className="border border-black px-4 py-2">{auto.marca}</td>
                                        <td className="border border-black px-4 py-2">{auto.año}</td>
                                        <td className="border border-black px-4 py-2">{auto.precio}</td>
                                        <td className="border border-black px-4 py-2">{auto.comprador}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default PerfilVendedor;