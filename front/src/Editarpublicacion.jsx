// pwii/front/src/Editarpublicacion.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";

function EditarPublicacion() {
    const { autoId } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        modelo: "",
        marca: "",
        categoria: "", // Debería ser el id_categoria
        color: "",
        estadoAuto: "", // Condición del auto
        transmision: "",
        estado: "", // Provincia/Estado
        ciudad: "",
        colonia: "",
        calle: "",
        kilometraje: "",
        anio: "", // Estado local para el año (con 'i')
        precio: "",
    });
    const [existingImagenes, setExistingImagenes] = useState([]);
    const [newImagenesFiles, setNewImagenesFiles] = useState([]);
    const [newImagenPreviews, setNewImagenPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vendedorOriginalId, setVendedorOriginalId] = useState(null); // Para verificar propiedad
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const usuarioData = localStorage.getItem("usuario");
        if (usuarioData && usuarioData !== "undefined") {
            try {
                setLoggedInUser(JSON.parse(usuarioData));
            } catch(e) {
                console.error("Error parseando usuario de localStorage en EditarPublicacion:", e);
                localStorage.removeItem("usuario");
                navigate("/Landing"); // Redirigir si los datos del usuario son inválidos
            }
        } else {
            alert("Debes iniciar sesión para editar una publicación.");
            navigate("/Landing");
        }
    }, [navigate]);

    useEffect(() => {
        if (!autoId) {
            setError("No se proporcionó un ID de auto para editar.");
            setLoading(false);
            return;
        }

        if (!loggedInUser) { // Esperar a que loggedInUser se cargue antes de continuar
            setLoading(true); // Puede que aún no se haya cargado desde el primer useEffect
            return;
        }
        
        setLoading(true);
        axios.get(`http://localhost:3001/api/auto/${autoId}`)
            .then(response => {
                const auto = response.data;
                if (auto && auto.id_auto) {
                    // Verificar que el usuario logueado sea el vendedor del auto
                    // Se espera que el backend devuelva 'id_vendedor_usuario' o un campo similar
                    if (auto.id_vendedor_usuario !== loggedInUser.idUsuario) {
                        alert("No tienes permiso para editar esta publicación.");
                        navigate("/"); 
                        return;
                    }
                    setVendedorOriginalId(auto.id_vendedor_usuario);

                    setFormData({
                        modelo: auto.Modelo_Auto || "",
                        marca: auto.Marca_auto || "",
                        categoria: auto.id_categoria || "",
                        color: auto.Color_auto || "",
                        estadoAuto: auto.Estado_auto || "",
                        transmision: auto.Transmision_auto || "",
                        estado: auto.Estado || "",
                        ciudad: auto.Ciudad || "",
                        colonia: auto.Colonia || "",
                        calle: auto.Calle || "",
                        kilometraje: auto.Kilometraje_auto !== null ? String(auto.Kilometraje_auto) : "",
                        // Usar 'Anio_auto' (con 'i') si así lo devuelve el backend, o el nombre de columna original 'Año_auto' (con ñ)
                        // y asegurarse que el alias en el backend SELECT coincida.
                        // Asumiremos que el backend devuelve 'Anio_auto' para el año.
                        anio: auto.Anio_auto !== null ? String(auto.Anio_auto) : "", 
                        precio: auto.Precio_auto !== null ? String(auto.Precio_auto) : "",
                    });
                    setExistingImagenes(auto.imagenes || []);
                    setError(null);
                } else {
                    setError("No se encontraron datos para este auto o la respuesta no es válida.");
                    console.error("Respuesta de API inesperada para GET /api/auto/:autoId :", auto);
                }
            })
            .catch(err => {
                console.error("Error al cargar datos del auto para editar:", err.response?.data || err.message);
                setError(`Error al cargar los datos del auto: ${err.response?.data?.error || err.message}`);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [autoId, loggedInUser, navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && name === "newImagenes") {
            const selectedFiles = Array.from(files);
            const currentPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setNewImagenesFiles(prevFiles => [...prevFiles, ...selectedFiles]);
            setNewImagenPreviews(prevPreviews => [...prevPreviews, ...currentPreviews]);
        } else if (name === "kilometraje") {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else if (name === "anio") {
            const yearValue = value.replace(/[^0-9]/g, '');
            if (yearValue.length <= 4) {
                setFormData(prev => ({ ...prev, [name]: yearValue }));
            }
        } else if (name === "precio") {
            const priceValue = value.replace(/[^0-9.]/g, '');
            if (priceValue.split('.').length <= 2) {
                 setFormData(prev => ({ ...prev, [name]: priceValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveExistingImage = (idFotoToRemove) => {
        setExistingImagenes(prev => prev.filter(img => img.id_foto !== idFotoToRemove));
    };

    const handleRemoveNewImage = (indexToRemove) => {
        URL.revokeObjectURL(newImagenPreviews[indexToRemove]);
        setNewImagenesFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setNewImagenPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loggedInUser || loggedInUser.idUsuario !== vendedorOriginalId) {
            alert("No tienes permiso para realizar esta acción o tu sesión ha expirado.");
            navigate("/Landing");
            return;
        }

        const requiredFields = ["modelo", "marca", "categoria", "color", "estadoAuto", "transmision", "estado", "ciudad", "kilometraje", "anio", "precio"];
        for (const key of requiredFields) {
            if (formData[key] === null || formData[key] === undefined || String(formData[key]).trim() === "") {
                alert(`Por favor llena el campo: ${key}`);
                return;
            }
        }
        if (existingImagenes.length === 0 && newImagenesFiles.length === 0) {
            alert("Por favor, asegúrate de que haya al menos una imagen para el auto.");
            return;
        }
        const currentYear = new Date().getFullYear();
        if (parseInt(formData.anio, 10) < 1900 || parseInt(formData.anio, 10) > currentYear + 1) {
             alert(`El año "${formData.anio}" no es válido.`);
             return;
        }


        const dataToSubmit = new FormData();
        // Mapear claves del frontend a las esperadas por el backend si son diferentes
        dataToSubmit.append("modelo", formData.modelo);
        dataToSubmit.append("marca", formData.marca);
        dataToSubmit.append("categoria", formData.categoria); // Se espera id_categoria
        dataToSubmit.append("color", formData.color);
        dataToSubmit.append("estadoAuto", formData.estadoAuto);
        dataToSubmit.append("transmision", formData.transmision);
        dataToSubmit.append("estado", formData.estado);
        dataToSubmit.append("ciudad", formData.ciudad);
        dataToSubmit.append("colonia", formData.colonia);
        dataToSubmit.append("calle", formData.calle);
        dataToSubmit.append("kilometraje", formData.kilometraje);
        dataToSubmit.append("Anio_auto", formData.anio); // Enviar como 'Anio_auto' (con 'i')
        dataToSubmit.append("precio", formData.precio);
        
        // Necesario para la verificación de propietario simplificada en el backend
        dataToSubmit.append("id_usuario_editor", String(loggedInUser.idUsuario)); 

        const idsExistingImagenesToKeep = existingImagenes.map(img => img.id_foto);
        dataToSubmit.append('existingImageIds', JSON.stringify(idsExistingImagenesToKeep));

        newImagenesFiles.forEach((file) => {
            dataToSubmit.append('newImagenesUpload', file);
        });

        console.log("Datos a enviar para actualización (handleSubmit):");
        for (let pair of dataToSubmit.entries()) {
            console.log(pair[0]+ ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
        }

        try {
            const response = await axios.put(`http://localhost:3001/api/auto/${autoId}`, dataToSubmit, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.msg === "ok") {
                alert("Publicación actualizada con éxito!");
                navigate(`/Detallesautovendedor/${autoId}`); // O donde sea apropiado
            } else {
                alert(`Error al actualizar: ${response.data.error || "Error desconocido del servidor."}`);
            }
        } catch (err) {
            console.error("Error al actualizar la publicación:", err.response?.data || err.message);
            alert(`Ocurrió un error al actualizar: ${err.response?.data?.error || err.message}`);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Cargando datos para editar...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center text-xl">{error}</div>;
    if (!vendedorOriginalId && !loading) { // Si no se pudo determinar el vendedor original o no hay datos
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 p-4 text-center text-xl">
                No se pudieron cargar los datos del auto o no tienes permiso para editar.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <div className="pt-20 md:pt-24">
                <div className="w-full max-w-4xl bg-white p-6 md:p-10 border border-gray-300 bg-opacity-90 rounded-lg shadow-lg mx-auto my-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Editar Publicación</h1>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSubmit}>
                        {/* Columna 1 */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Modelo:
                                <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Marca:
                                <input type="text" name="marca" value={formData.marca} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                             <label className="block text-sm font-medium text-gray-700">Categoría:
                                <select name="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required>
                                    <option value="">Selecciona una categoría</option>
                                    <option value="1">Sedan</option>
                                    <option value="2">Hatchback</option>
                                    <option value="3">SUV</option>
                                    <option value="4">Todoterreno</option>
                                    <option value="5">Convertible</option>
                                    <option value="6">Deportivo</option>
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Color:
                                <input type="text" name="color" value={formData.color} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Precio (MXN):
                                <input type="text" name="precio" placeholder="Ej: 150000" value={formData.precio} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Condición del auto:
                                <select name="estadoAuto" value={formData.estadoAuto} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required>
                                    <option value="">Selecciona la condición</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado - Como nuevo">Usado - Como nuevo</option>
                                    <option value="Usado - Buen estado">Usado - Buen estado</option>
                                    <option value="Usado - Regular">Usado - Regular</option>
                                    <option value="Para Restaurar">Para Restaurar</option>
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Transmisión:
                                 <select name="transmision" value={formData.transmision} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required>
                                    <option value="">Selecciona la transmisión</option>
                                    <option value="Automatico">Automático</option>
                                    <option value="Estandar">Estándar</option>
                                    <option value="CVT">CVT</option>
                                </select>
                            </label>
                        </div>
                        {/* Columna 2 */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Kilometraje (km):
                                <input type="text" name="kilometraje" placeholder="Ej: 50000" value={formData.kilometraje} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Año: {/* Cambiado el label a 'Año' para el usuario */}
                                <input type="text" name="anio" placeholder="Ej: 2020" value={formData.anio} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" maxLength="4" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Estado (Provincia):
                                <input type="text" name="estado" value={formData.estado} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Ciudad:
                                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" required />
                            </label>
                             <label className="block text-sm font-medium text-gray-700">Colonia:
                                <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Calle y Número:
                                <input type="text" name="calle" value={formData.calle} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded p-2 shadow-sm" />
                            </label>
                        </div>

                        {/* Sección de Imágenes */}
                        <div className="col-span-1 md:col-span-2 mt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestionar Imágenes</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes Actuales:</label>
                                {existingImagenes.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                                        {existingImagenes.map((img) => (
                                            <div key={img.id_foto} className="relative group">
                                                <img src={img.contenido} alt={`Imagen existente ${img.id_foto}`} className="w-full h-24 md:h-32 object-cover rounded-md border border-gray-300" />
                                                <button type="button" onClick={() => handleRemoveExistingImage(img.id_foto)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Eliminar imagen existente">
                                                    &#x2715;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-xs text-gray-500 mb-2 italic">No hay imágenes guardadas actualmente para esta publicación.</p>}
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Añadir Nuevas Imágenes:</label>
                                <input
                                    type="file"
                                    name="newImagenes"
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-2"
                                    multiple
                                    accept="image/jpeg, image/png, image/jpg"
                                />
                                {newImagenPreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {newImagenPreviews.map((previewUrl, index) => (
                                            <div key={index} className="relative group">
                                                <img src={previewUrl} alt={`Nueva Preview ${index + 1}`} className="w-full h-24 md:h-32 object-cover rounded-md border border-gray-300" />
                                                <button type="button" onClick={() => handleRemoveNewImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Eliminar nueva imagen">
                                                    &#x2715;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 text-center mt-6">
                            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 active:bg-green-800 transition shadow-md hover:shadow-lg">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditarPublicacion;