import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // useParams y Link importados
import axios from "axios";
import Footer from "./Componentes/Footer";
import Header from "./Componentes/Header";

// Componente para mostrar estrellas de calificación
const StarRating = ({ rating }) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            stars.push(<span key={i} className="text-yellow-400">★</span>);
        } else if (i - 0.5 <= rating) {
            stars.push(<span key={i} className="text-yellow-400">★</span>); // O podrías usar una media estrella
        } else {
            stars.push(<span key={i} className="text-gray-300">★</span>);
        }
    }
    return <div className="flex">{stars}</div>;
};


function Catalogovendedor() { // Renombrado de PantallaVehiculos para claridad
    const [vendedorPerfil, setVendedorPerfil] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [loadingPerfil, setLoadingPerfil] = useState(true);
    const [loadingVehiculos, setLoadingVehiculos] = useState(true);
    const [error, setError] = useState(null);
    
    const { vendedorId } = useParams(); // Obtiene el ID del vendedor de la URL
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado && usuarioGuardado !== "undefined") {
            try {
                setLoggedInUser(JSON.parse(usuarioGuardado));
            } catch (e) {
                console.error("Error al parsear usuario de localStorage:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (vendedorId) {
            const fetchVendedorData = async () => {
                setLoadingPerfil(true);
                setLoadingVehiculos(true);
                setError(null);
                try {
                    // 1. Obtener perfil y reseñas del vendedor
                    const perfilResponse = await axios.get(`http://localhost:3001/api/vendedor/${vendedorId}/perfil`);
                    setVendedorPerfil(perfilResponse.data);

                    // 2. Obtener vehículos del vendedor
                    const vehiculosResponse = await axios.get(`http://localhost:3001/api/autos/vendedor/${vendedorId}`);
                    setVehiculos(vehiculosResponse.data);

                } catch (err) {
                    console.error("Error al obtener datos del vendedor:", err);
                    setError("No se pudo cargar la información del vendedor o sus vehículos.");
                } finally {
                    setLoadingPerfil(false);
                    setLoadingVehiculos(false);
                }
            };
            fetchVendedorData();
        } else {
            setError("No se especificó un ID de vendedor.");
            setLoadingPerfil(false);
            setLoadingVehiculos(false);
        }
    }, [vendedorId]);

    const handleAutoClick = (autoId) => {
        // Si el usuario logueado es el dueño del catálogo, lo lleva a la vista de edición/detalle del vendedor
        // Si no, lo lleva a la vista de detalle del cliente
        navigate(`/Detallesautocliente/${autoId}`);
    };

    const handleDeleteAuto = async (autoId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.")) {
            return;
        }
        try {
            // **IMPORTANTE**: Necesitas crear este endpoint DELETE en tu backend
            // Debería verificar que el usuario que hace la petición es el dueño del auto
            const response = await axios.delete(`http://localhost:3001/api/auto/${autoId}`, {
                // Si necesitas enviar el ID del usuario para autorización en el backend:
                // headers: { 'Authorization': `Bearer ${token}` } o data: { userId: loggedInUser.idUsuario }
            });
            if (response.status === 200 || response.status === 204) {
                alert("Publicación eliminada con éxito.");
                setVehiculos(prevVehiculos => prevVehiculos.filter(v => v.id_auto !== autoId));
            } else {
                alert(`Error al eliminar la publicación: ${response.data.error || "Error desconocido"}`);
            }
        } catch (err) {
            console.error("Error al eliminar auto:", err);
            alert(`Ocurrió un error al eliminar la publicación: ${err.response?.data?.error || err.message}`);
        }
    };
    
    const formatPrice = (price) => {
        if (typeof price !== 'number' && typeof price !== 'string') return "N/A";
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return "N/A";
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numericPrice);
    };

    const isOwner = loggedInUser && vendedorId && loggedInUser.idUsuario === parseInt(vendedorId);

    if (loadingPerfil || loadingVehiculos) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-xl">Cargando catálogo del vendedor...</div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-red-500 text-xl p-8 text-center">{error}</div>
                <Footer />
            </div>
        );
    }
    
    if (!vendedorPerfil) {
         return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-gray-600 text-xl p-8 text-center">No se encontró el perfil del vendedor.</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <div className="flex flex-col md:flex-row flex-grow mt-16 md:mt-20 px-2 sm:px-4">
                {/* Sidebar con Info del Vendedor y Reseñas */}
                <aside className="w-full md:w-72 lg:w-80 bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg md:mr-6 mb-6 md:mb-0 self-start">
                    <div className="text-center mb-4">
                         {vendedorPerfil.foto_perfil ? (
                            <img 
                                src={vendedorPerfil.foto_perfil.startsWith('data:image') ? vendedorPerfil.foto_perfil : `data:image/jpeg;base64,${vendedorPerfil.foto_perfil}`} 
                                alt={`Foto de ${vendedorPerfil.nombre_vendedor}`} 
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-blue-400 object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-gray-500 flex items-center justify-center text-white text-4xl">
                                {vendedorPerfil.nombre_vendedor ? vendedorPerfil.nombre_vendedor.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                        <h2 className="mt-3 text-xl md:text-2xl font-bold text-white">{vendedorPerfil.nombre_vendedor || "Vendedor"}</h2>
                    </div>
                    <div className="text-center mb-4">
                        <h3 className="text-md font-semibold text-gray-300">Calificación Promedio</h3>
                        <div className="text-yellow-400 text-2xl flex justify-center items-center">
                            <StarRating rating={vendedorPerfil.calificacion_promedio || 0} /> 
                            <span className="ml-2 text-white text-sm">({(vendedorPerfil.calificacion_promedio || 0).toFixed(1)})</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-center text-white mb-2">Reseñas</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {vendedorPerfil.resenas && vendedorPerfil.resenas.length > 0 ? (
                            vendedorPerfil.resenas.map(resena => (
                                <div key={resena.id_resena} className="bg-gray-700 p-3 rounded-lg text-sm text-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold">{resena.nombre_comprador || "Anónimo"}</span>
                                        <StarRating rating={resena.calificacion_vendedor} />
                                    </div>
                                    <p className="italic">"{resena.texto_resena}"</p>
                                    <p className="text-xs text-gray-400 mt-1 text-right">{new Date(resena.fecha_creacion_mensaje).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center">Este vendedor aún no tiene reseñas.</p>
                        )}
                    </div>
                </aside>

                {/* Contenido Principal - Vehículos del Vendedor */}
                <main className="flex-1 p-4 md:p-6 lg:p-10 bg-blue-100 bg-opacity-80 rounded-lg shadow-lg">
                    <div className="text-center bg-gray-200 p-4 rounded-lg shadow-md mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Publicaciones de {vendedorPerfil.nombre_vendedor || "Vendedor"}</h1>
                    </div>
                    {vehiculos.length === 0 && !loadingVehiculos && (
                         <div className="text-center text-xl text-gray-700 bg-white bg-opacity-90 p-10 rounded-lg">
                            Este vendedor no tiene vehículos publicados actualmente.
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {vehiculos.map((vehiculo) => (
                            <div
                                key={vehiculo.id_auto}
                                className="bg-white text-gray-900 p-3 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col"
                            >
                                <img
                                    src={vehiculo.foto_principal_auto || "/Imagenes/placeholder_auto.png"}
                                    alt={`${vehiculo.Marca_auto} ${vehiculo.Modelo_Auto}`}
                                    className="w-full h-40 object-cover rounded-md cursor-pointer"
                                    onClick={() => handleAutoClick(vehiculo.id_auto)}
                                />
                                <div className="mt-2 flex-grow">
                                    <h3 
                                        className="font-bold text-md md:text-lg truncate cursor-pointer hover:text-blue-600"
                                        onClick={() => handleAutoClick(vehiculo.id_auto)}
                                        title={`${vehiculo.Marca_auto} ${vehiculo.Modelo_Auto}`}
                                    >
                                        {`${vehiculo.Marca_auto} ${vehiculo.Modelo_Auto}`}
                                    </h3>
                                    <p className="text-green-600 font-semibold text-sm md:text-md">{formatPrice(vehiculo.Precio_auto)}</p>
                                    <p className="text-xs text-gray-500">Año: {vehiculo.Año_auto}</p>
                                </div>
                                {isOwner && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                                        <button 
                                            onClick={() => navigate(`/Editarpublicacion/${vehiculo.id_auto}`)} 
                                            className="flex-1 bg-yellow-500 text-white text-xs px-2 py-1.5 rounded hover:bg-yellow-600 transition"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAuto(vehiculo.id_auto)}
                                            className="flex-1 bg-red-500 text-white text-xs px-2 py-1.5 rounded hover:bg-red-600 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Catalogovendedor;