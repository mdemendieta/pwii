import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function EditarPublicacion() {
    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            {/* Header */}
            <Header />
            <br></br>
            <br></br>
            <br></br>

            <br />

            {/* Contenido Principal */}
            <div className="flex flex-grow items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md bg-opacity-95 w-[500px]">
                    <h2 className="text-center text-xl font-bold mb-4">Editar publicación.</h2>
                    <div className="border-b mb-4"></div>
                    <form>
                        {/* Campos de Entrada */}
                        <div className="grid grid-cols-1 gap-2">
                            <label>
                                Modelo:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Marca:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Categoría:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Kilometraje:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Color:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Año:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Estado del auto:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Precio:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Estado:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Ciudad:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Colonia:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                            <label>
                                Calle:
                                <input type="text" className="border w-full p-1 rounded" />
                            </label>
                        </div>

                        {/* Sección de Imagen */}
                        <div className="mt-4 flex flex-col items-center">
                            <label className="mb-2">Imagen:</label>
                            <div className="w-32 h-24 border flex items-center justify-center text-gray-500">
                                Foto
                            </div>
                            <button type="button" className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
                                Buscar
                            </button>
                        </div>

                        {/* Botón para Modificar */}
                        <div className="mt-4 text-center">
                            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                                Modificar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <br />
            <br />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default EditarPublicacion;