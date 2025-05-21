// pwii/front/src/Publicarauto.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";

function PublicarAuto() {
    const [formData, setFormData] = useState({
        modelo: "",
        marca: "",
        categoria: "", // This should ideally be an ID if it relates to tabla_categoria
        color: "",
        estadoAuto: "", // Condition of the car e.g., "Nuevo", "Usado - Como Nuevo", "Usado - Buen Estado"
        transmision: "",
        estado: "", // State/Province (e.g., "Nuevo León")
        ciudad: "",
        colonia: "",
        calle: "",
        kilometraje: "", // Will store as number
        año: "", // Will store the year as a number
        precio: "", // Added precio field
        imagenes: [], // For multiple image files
        imagenPreviews: [], // For multiple image previews
    });
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado && usuarioGuardado !== "undefined") {
            try {
                setUsuario(JSON.parse(usuarioGuardado));
            } catch (error) {
                console.error("Error al parsear usuario de localStorage:", error);
                // It's good practice to remove the invalid item
                localStorage.removeItem("usuario"); 
            }
        } else {
            alert("Debes iniciar sesión para publicar un auto.");
            navigate("/Landing");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && name === "imagenes") {
            const selectedFiles = Array.from(files); // Convert FileList to Array
            const newImagePreviews = [];

            // Create a preview URL for each new file
            selectedFiles.forEach(file => {
                newImagePreviews.push(URL.createObjectURL(file));
            });
            
            setFormData(prevFormData => ({
                ...prevFormData,
                // Append new files and previews to existing ones
                imagenes: [...prevFormData.imagenes, ...selectedFiles],
                imagenPreviews: [...prevFormData.imagenPreviews, ...newImagePreviews],
            }));
        } else if (name === "kilometraje") {
            // Allow only whole numbers for kilometraje
            const numericValue = value === '' ? '' : parseInt(value.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(numericValue) || value === '') {
                 setFormData({ ...formData, [name]: numericValue });
            }
        } else if (name === "año") {
            // Allow only numbers for year, up to 4 digits
            const yearValue = value.replace(/[^0-9]/g, '');
            if (yearValue.length <= 4) {
                setFormData({ ...formData, [name]: yearValue });
            }
        } else if (name === "precio") {
            // Allow numbers (can be float for price)
            const priceValue = value.replace(/[^0-9.]/g, ''); // Allow digits and a single dot
             if (priceValue.split('.').length <= 2) { // Ensure only one decimal point
                setFormData({ ...formData, [name]: priceValue });
            }
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    // Function to remove an image from the preview and file list
    const handleRemoveImage = (indexToRemove) => {
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(formData.imagenPreviews[indexToRemove]);

        setFormData(prevFormData => ({
            ...prevFormData,
            imagenes: prevFormData.imagenes.filter((_, index) => index !== indexToRemove),
            imagenPreviews: prevFormData.imagenPreviews.filter((_, index) => index !== indexToRemove),
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario || !usuario.idUsuario) {
            alert("Error: No se pudo identificar al vendedor. Por favor, inicie sesión de nuevo.");
            navigate("/Landing");
            return;
        }
        
        // Enhanced Validation
        const requiredFields = ["modelo", "marca", "categoria", "color", "estadoAuto", "transmision", "estado", "ciudad", "kilometraje", "año", "precio"];
        for (const key of requiredFields) {
            if (formData[key] === null || formData[key] === undefined || formData[key].toString().trim() === "") {
                alert(`Por favor llena el campo: ${key}`);
                return;
            }
        }
        if (formData.imagenes.length === 0) {
            alert("Por favor, sube al menos una imagen del auto.");
            return;
        }
        const currentYear = new Date().getFullYear();
        if (formData.año < 1900 || formData.año > currentYear + 1) {
            alert(`El año "${formData.año}" no es válido. Debe estar entre 1900 y ${currentYear + 1}.`);
            return;
        }
        if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
            alert("El precio debe ser un número válido y mayor que cero.");
            return;
        }
        if (isNaN(parseInt(formData.kilometraje, 10)) || parseInt(formData.kilometraje, 10) < 0) {
            alert("El kilometraje debe ser un número válido y no negativo.");
            return;
        }


        const dataToSubmit = new FormData();
        dataToSubmit.append("id_vendedor", usuario.idUsuario);
        dataToSubmit.append("id_categoria", formData.categoria); 
        dataToSubmit.append("Marca_auto", formData.marca);
        dataToSubmit.append("Modelo_Auto", formData.modelo);
        dataToSubmit.append("Anio_auto", formData.año);
        dataToSubmit.append("Color_auto", formData.color);
        dataToSubmit.append("Estado_auto", formData.estadoAuto); // Condition of the car
        dataToSubmit.append("Transmision_auto", formData.transmision);
        dataToSubmit.append("Kilometraje_auto", parseInt(formData.kilometraje, 10));
        dataToSubmit.append("Precio_auto", parseFloat(formData.precio));
        dataToSubmit.append("Estado", formData.estado); // State/Province
        dataToSubmit.append("Ciudad", formData.ciudad);
        dataToSubmit.append("Colonia", formData.colonia); // Added colonia from form
        dataToSubmit.append("Calle", formData.calle);

        formData.imagenes.forEach((imagenFile) => {
            dataToSubmit.append("imagenes_auto", imagenFile); // Use the same key for all image files
        });


    console.log("--- Frontend: Datos a enviar ---");
    console.log("Usuario (para id_vendedor):", usuario);
    console.log("formData state:", JSON.parse(JSON.stringify(formData))); // Deep copy for reliable logging
    
    console.log("Contenido de FormData:");
    for (let pair of dataToSubmit.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }
    console.log("--- Fin de datos a enviar ---");



        console.log("Enviando datos:", Object.fromEntries(dataToSubmit.entries()));


        try {
            // **IMPORTANT**: You need to create this "/publicarAuto" endpoint in your backend (pwii/server/index.js)
            // This endpoint should handle the auto details and multiple image uploads.
            const response = await axios.post("http://localhost:3001/publicarAuto", dataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.msg === "ok") {
                alert("Auto publicado con éxito!");
                // Clear form or navigate away
                setFormData({ // Reset form
                    modelo: "", marca: "", categoria: "", color: "", estadoAuto: "",
                    transmision: "", estado: "", ciudad: "", colonia: "", calle: "",
                    kilometraje: "", año: "", precio: "", imagenes: [], imagenPreviews: [],
                });
                // Optionally, navigate to the new car's page or a success page
                // navigate(`/detallesAuto/${response.data.id_auto}`); 
                navigate("/Catalogovendedor"); // Or wherever you want to redirect sellers
            } else {
                alert(`Error al publicar el auto: ${response.data.error || "Error desconocido del servidor"}`);
            }
        } catch (error) {
            console.error("Error al publicar auto:", error);
            alert(`Ocurrió un error de red o servidor: ${error.response?.data?.error || error.message || "Error de conexión"}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            {/* Add some padding to the top of the main content area if Header is fixed */}
            <div className="pt-24"> {/* Adjust pt-XX as needed based on your Header's height */}
                <div className="w-full max-w-4xl bg-white p-6 md:p-10 border border-gray-300 bg-opacity-90 rounded-lg shadow-lg mx-auto my-8">
                    <h1 className="text-3xl font-bold text-center mb-6">Publicar Auto</h1>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSubmit}>
                        {/* Column 1 */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Modelo:
                                <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Marca:
                                <input type="text" name="marca" value={formData.marca} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Categoría:
                                <select name="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                    <option value="">Selecciona una categoría</option>
                                    {/* These should ideally come from your tabla_categoria and map to their IDs */}
                                    <option value="1">Sedan</option>
                                    <option value="2">Hatchback</option>
                                    <option value="3">SUV</option>
                                    <option value="4">Todoterreno</option>
                                    <option value="5">Convertible</option>
                                    <option value="6">Deportivo</option>
                                    {/* Add more categories as needed from your DB */}
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Color:
                                <input type="text" name="color" value={formData.color} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                            </label>
                             <label className="block text-sm font-medium text-gray-700">Precio (MXN):
                                <input type="text" name="precio" placeholder="Ej: 150000" value={formData.precio} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Condición del auto:
                                <select name="estadoAuto" value={formData.estadoAuto} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                    <option value="">Selecciona la condición</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado - Como nuevo">Usado - Como nuevo</option>
                                    <option value="Usado - Buen estado">Usado - Buen estado</option>
                                    <option value="Usado - Regular">Usado - Regular</option>
                                    <option value="Para Restaurar">Para Restaurar</option>
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Transmisión:
                                <select name="transmision" value={formData.transmision} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                    <option value="">Selecciona la transmisión</option>
                                    <option value="Automatico">Automático</option>
                                    <option value="Estandar">Estándar</option>
                                    <option value="CVT">CVT</option>
                                    {/* Add other transmission types if needed */}
                                </select>
                            </label>
                        </div>
                        {/* Column 2 */}
                        <div className="space-y-3">
                           
                            <label className="block text-sm font-medium text-gray-700">Kilometraje (km):
                                <input 
                                    type="text" /* Keep as text to allow custom input handling */
                                    name="kilometraje" 
                                    placeholder="Ej: 50000" 
                                    value={formData.kilometraje} 
                                    onChange={handleChange} 
                                    className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    required 
                                />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Año:
                                <input 
                                    type="text" /* Keep as text to allow custom input handling for 4 digits */
                                    name="año" 
                                    placeholder="Ej: 2020" 
                                    value={formData.año} 
                                    onChange={handleChange} 
                                    className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    maxLength="4"
                                    required 
                                />
                            </label>
                             <label className="block text-sm font-medium text-gray-700">Estado (Provincia):
                                <input type="text" name="estado" value={formData.estado} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Ciudad:
                                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Colonia:
                                <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Calle y Número:
                                <input type="text" name="calle" value={formData.calle} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            </label>
                        </div>
                        {/* Image Upload - Spans 2 columns */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes del Auto (Máx. 10):</label>
                            <input
                                type="file"
                                name="imagenes"
                                onChange={handleChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                multiple // Allow multiple file selection
                                accept="image/jpeg, image/png, image/jpg"
                            />
                            {formData.imagenPreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {formData.imagenPreviews.map((previewUrl, index) => (
                                        <div key={index} className="relative group">
                                            <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-24 md:h-32 object-cover rounded-md border border-gray-300" />
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100 transition-opacity"
                                                aria-label="Eliminar imagen"
                                            >
                                                &#x2715; {/* Multiplication X sign */}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {formData.imagenPreviews.length === 0 && (
                                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center text-gray-500 text-sm">
                                 Sube una o más fotos
                                </div>
                            )}
                        </div>
                        <div className="col-span-1 md:col-span-2 text-center mt-6">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 active:bg-blue-800 transition shadow-md hover:shadow-lg">
                                Publicar Auto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PublicarAuto;