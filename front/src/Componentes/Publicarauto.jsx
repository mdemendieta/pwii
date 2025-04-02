import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function PublicarAuto() {
    const [formData, setFormData] = useState({
        modelo: "",
        marca: "",
        categoria: "",
        color: "",
        estadoAuto: "",
        transmision: "",
        estado: "",
        ciudad: "",
        colonia: "",
        calle: "",
        kilometraje: "",
        año: "",
        imagen: null,
        imagenPreview: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagen") {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file,
                imagenPreview: file ? URL.createObjectURL(file) : null,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación: asegúrate de que todos los campos estén llenos
        for (const key in formData) {
            if (!formData[key] && key !== "imagenPreview") {
                alert(`Por favor llena todos los campos. Falta: ${key}`);
                return;
            }
        }

        alert("Auto publicado con éxito!");
        console.log("Datos del formulario:", formData);
    };

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="w-full max-w-4xl bg-white p-10 border border-gray-300 bg-opacity-80 rounded-lg shadow-lg mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Publicar Auto</h1>
                <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <label className="block">
                            Modelo:
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Marca:
                            <input type="text" name="marca" value={formData.marca} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Categoría:
                            <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full border border-gray-300 rounded p-2">
                                <option value="">Selecciona una categoría</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="SUV">SUV</option>
                                <option value="Todoterreno">Todoterreno</option>
                                <option value="Convertible">Convertible</option>
                                <option value="Deportivo">Deportivo</option>
                            </select>
                        </label>
                        <label className="block">
                            Color:
                            <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Estado del auto:
                            <select name="estadoAuto" value={formData.estadoAuto} onChange={handleChange} className="w-full border border-gray-300 rounded p-2">
                                <option value="">Selecciona el estado</option>
                                <option value="Bajo">Daño bajo</option>
                                <option value="Medio">Daño medio</option>
                                <option value="Alto">Daño alto</option>
                            </select>
                        </label>
                        <label className="block">
                            Transmisión:
                            <select name="transmision" value={formData.transmision} onChange={handleChange} className="w-full border border-gray-300 rounded p-2">
                                <option value="">Selecciona la transmisión</option>
                                <option value="Automatico">Automático</option>
                                <option value="Estandar">Estándar</option>
                            </select>
                        </label>
                    </div>
                    <div className="space-y-4">
                        <label className="block">
                            Estado:
                            <input type="text" name="estado" value={formData.estado} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Ciudad:
                            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Colonia:
                            <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Calle:
                            <input type="text" name="calle" value={formData.calle} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Kilometraje:
                            <input type="text" name="kilometraje" value={formData.kilometraje} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                        <label className="block">
                            Año:
                            <input type="date" name="año" value={formData.año} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        </label>
                    </div>
                    <div className="col-span-2 mt-6 text-center">
                        <label className="block text-lg font-semibold">Imagen:</label>
                        <input type="file" name="imagen" onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
                        <div className="border border-gray-400 w-40 h-40 mx-auto mt-4 flex items-center justify-center text-gray-500 text-xl">
                            {formData.imagenPreview ? (
                                <img src={formData.imagenPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                "Foto"
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 text-center mt-6">
                        <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600">
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <Footer />
        </div>
    );
}

export default PublicarAuto;