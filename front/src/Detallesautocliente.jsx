// pwii/front/src/Detallesautocliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";

// --- ImageGallery Component (definido fuera de DetallesAutoCliente) ---
function ImageGallery({ imagenes, nombreAuto }) {
    const fallbackImage = "/Imagenes/placeholder_auto.png"; // Define un placeholder
    const [imagenPrincipal, setImagenPrincipal] = useState(
        imagenes && imagenes.length > 0 && imagenes[0].contenido ? imagenes[0].contenido : fallbackImage
    );

    useEffect(() => {
        if (imagenes && imagenes.length > 0 && imagenes[0].contenido) {
            setImagenPrincipal(imagenes[0].contenido);
        } else {
            setImagenPrincipal(fallbackImage);
        }
    }, [imagenes]); // Se ejecuta cuando 'imagenes' cambia

    if (!imagenes || imagenes.length === 0) {
        return (
            <div className="border rounded-xl h-96 flex items-center justify-center bg-gray-100 text-gray-600 text-xl">
                <img src={fallbackImage} alt="No hay imágenes disponibles" className="w-full h-full object-contain p-4" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-xl h-80 md:h-96 flex items-center justify-center bg-gray-100 overflow-hidden">
                <img src={imagenPrincipal} alt={`Imagen principal de ${nombreAuto}`} className="w-full h-full object-contain" />
            </div>
            {imagenes.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {imagenes.map((img, index) => (
                        img.contenido && ( // Solo renderiza si hay contenido de imagen
                            <div
                                key={img.id_foto || index}
                                className="border rounded-md h-20 w-full cursor-pointer overflow-hidden hover:opacity-75 focus:ring-2 focus:ring-blue-500"
                                onClick={() => setImagenPrincipal(img.contenido)}
                                onKeyPress={(e) => e.key === 'Enter' && setImagenPrincipal(img.contenido)}
                                tabIndex={0} // Hace el div enfocable
                            >
                                <img src={img.contenido} alt={`Miniatura ${index + 1} de ${nombreAuto}`} className="w-full h-full object-cover" />
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

// --- DetallesAutoCliente Component ---
function DetallesAutoCliente() {
    const [autoDetalles, setAutoDetalles] = useState(null);
    const [otrasPublicacionesVendedor, setOtrasPublicacionesVendedor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { autoId } = useParams();
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado && usuarioGuardado !== "undefined") {
            try {
                setLoggedInUser(JSON.parse(usuarioGuardado));
            } catch (e) {
                console.error("Error al parsear usuario de localStorage:", e);
                localStorage.removeItem("usuario");
            }
        }
    }, []); // Se ejecuta solo una vez al montar para cargar el usuario

    useEffect(() => {
        if (autoId) {
            const fetchAutoDetalles = async () => {
                setLoading(true);
                setAutoDetalles(null); // Resetea detalles al cambiar de autoId
                setError(null); // Resetea errores
                setOtrasPublicacionesVendedor([]); // Resetea otras publicaciones
                try {
                    const response = await axios.get(`http://localhost:3001/api/auto/${autoId}`);
                    if (response.data && typeof response.data === 'object' && response.data.id_auto) {
                        setAutoDetalles(response.data);
                        if (response.data.id_vendedor_usuario) {
                            fetchOtrasPublicaciones(response.data.id_vendedor_usuario, response.data.id_auto);
                        }
                    } else {
                        console.error("Datos del auto no válidos o vacíos recibidos:", response.data);
                        setError("No se encontraron detalles para este auto o los datos son incorrectos.");
                    }
                } catch (err) {
                    console.error(`Error al obtener detalles del auto ${autoId}:`, err.response || err.message);
                    setError("No se pudieron cargar los detalles del vehículo. Intente más tarde.");
                } finally {
                    setLoading(false);
                }
            };

            const fetchOtrasPublicaciones = async (vendedorId, autoActualId) => {
                try {
                    const res = await axios.get(`http://localhost:3001/api/autos/vendedor/${vendedorId}?excluir=${autoActualId}&limite=4`);
                    setOtrasPublicacionesVendedor(res.data || []);
                } catch (err) {
                    console.error("Error al obtener otras publicaciones del vendedor:", err);
                }
            };

            fetchAutoDetalles();
        } else {
            setError("No se especificó un ID de vehículo.");
            setLoading(false);
        }
    }, [autoId]); // Se re-ejecuta si autoId cambia

    const handleAutoRecomendadoClick = (idRecomendado) => {
        navigate(`/Detallesautocliente/${idRecomendado}`);
        window.scrollTo(0, 0);
    };

    const handleComprarClick = () => {
        if (!loggedInUser) {
            alert("Debes iniciar sesión para comprar un auto.");
            navigate("/Landing", { state: { from: `/Detallesautocliente/${autoId}` } });
            return;
        }
        navigate(`/Comprarauto`, { state: { auto: autoDetalles } });
    };

    const handleDudasClick = () => {
        if (!loggedInUser) {
            alert("Debes iniciar sesión para contactar al vendedor.");
            navigate("/Landing", { state: { from: `/Detallesautocliente/${autoId}` } });
            return;
        }
        navigate(`/ChatCliente`, { state: { vendedorId: autoDetalles?.id_vendedor_usuario, nombreVendedor: autoDetalles?.nombre_vendedor, autoId: autoDetalles?.id_auto } });
    };

    const handleEditarPublicacion = () => {
        navigate(`/Editarpublicacion/${autoId}`);
    };
    
    const formatPrice = (price) => { /* ... (sin cambios) ... */ };
    const formatKilometraje = (km) => { /* ... (sin cambios) ... */ };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-xl text-gray-700">Cargando detalles del auto...</div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-red-600 bg-red-100 border border-red-400 text-xl p-8 text-center rounded-md shadow-md mx-4">{error}</div>
                <Footer />
            </div>
        );
    }

    if (!autoDetalles) { // Si no hay error pero autoDetalles es null (ej. API devolvió datos no válidos)
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-gray-600 text-xl p-8 text-center">No se encontraron detalles para este vehículo.</div>
                <Footer />
            </div>
        );
    }

    const esVendedorDelAuto = loggedInUser && autoDetalles && loggedInUser.idUsuario === autoDetalles.id_vendedor_usuario;
    const esUsuarioVendedor = loggedInUser && loggedInUser.tipoUsuario === 2;

    let actionButtons = null;

if (loggedInUser) {
    if (esVendedorDelAuto) {
        // Opción 2: El usuario es el vendedor que publicó el auto
        actionButtons = (
            <button
                className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-md md:text-lg hover:bg-green-700 transition shadow"
                onClick={handleEditarPublicacion}
            >
                Modificar Publicación
            </button>
        );
    } else if (loggedInUser.tipoUsuario === 1) {
        // Opción 1: El usuario es un Comprador (Tipo_usuario = 1)
        actionButtons = (
            <>
                <button
                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-md md:text-lg hover:bg-blue-700 transition shadow"
                    onClick={handleComprarClick}
                >
                    Comprar
                </button>
                <button
                    className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg text-md md:text-lg hover:bg-gray-700 transition shadow"
                    onClick={handleDudasClick}
                >
                    Contactar al vendedor
                </button>
            </>
        );
    }
    // Opción 3: Si es vendedor NO PROPIETARIO, actionButtons permanece null y no se renderiza nada.
    // Si no está logueado, actionButtons permanece null.
} else {
    // Usuario no logueado: Podrías mostrar un botón para iniciar sesión o solo "Contactar"
    // Por ahora, para simplificar y dado que Comprar/Dudas ya redirigen si no hay sesión,
    // podríamos mostrar el botón de "Contactar" que internamente pedirá login.
     actionButtons = (
        <button
            className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg text-md md:text-lg hover:bg-gray-700 transition shadow"
            onClick={handleDudasClick} // handleDudasClick ya verifica si está logueado
        >
            Contactar al vendedor
        </button>
    );
}

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <div className="pt-20 md:pt-24">
                <main className="flex-grow flex justify-center items-start p-3 sm:p-4 md:p-8 lg:p-12">
                    <div className="max-w-7xl w-full p-4 sm:p-6 md:p-8 lg:p-10 border rounded-xl bg-white bg-opacity-95 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                <ImageGallery 
                                    imagenes={autoDetalles.imagenes || []} 
                                    nombreAuto={`${autoDetalles.Marca_auto} ${autoDetalles.Modelo_Auto}`}
                                />
                                {otrasPublicacionesVendedor.length > 0 && (
                                    <div className="border rounded-xl p-4 md:p-6 bg-white mt-6 shadow">
                                        <h2 className="font-semibold text-center mb-4 text-lg md:text-xl">
                                            Más publicaciones de este vendedor
                                        </h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {otrasPublicacionesVendedor.map((auto) => (
                                                <div
                                                    key={auto.id_auto}
                                                    className="border rounded-lg p-2 text-center bg-gray-50 cursor-pointer hover:shadow-md flex flex-col justify-between"
                                                    onClick={() => handleAutoRecomendadoClick(auto.id_auto)}
                                                >
                                                    <img 
                                                        src={auto.foto_principal_auto || "/Imagenes/placeholder_auto.png"} 
                                                        alt={`${auto.Marca_auto} ${auto.Modelo_Auto}`} 
                                                        className="w-full h-20 sm:h-24 object-cover rounded-md mb-2"
                                                    />
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-semibold truncate">{`${auto.Marca_auto} ${auto.Modelo_Auto}`}</div>
                                                        <div className="text-xs sm:text-sm font-bold text-green-600">{formatPrice(auto.Precio_auto)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-1 space-y-6 md:space-y-8">
                                <div className="border rounded-xl p-4 md:p-6 bg-white shadow">
                                    <div className="flex justify-between text-md md:text-lg text-gray-700 mb-2">
                                        <span>Año: {autoDetalles.Año_auto}</span>
                                        <span>{formatKilometraje(autoDetalles.Kilometraje_auto)}</span>
                                    </div>
                                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mt-1">{`${autoDetalles.Marca_auto} ${autoDetalles.Modelo_Auto}`}</h1>
                                    <p className="text-lg md:text-xl lg:text-2xl font-semibold text-green-700 mt-1">{formatPrice(autoDetalles.Precio_auto)}</p>
                                    
                                    <div className="mt-3 text-xs sm:text-sm text-gray-600">
                                        Vendido por: {' '}
                                        <Link 
                                            to={`/Catalogovendedor/${autoDetalles.id_vendedor_usuario}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                        >
                                            {autoDetalles.nombre_vendedor || "Vendedor Desconocido"}
                                        </Link>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        {actionButtons}
                                    </div>
                                </div>

                                <div className="border rounded-xl p-4 md:p-6 bg-white shadow">
                                    <h2 className="font-semibold text-lg md:text-xl mb-3">Descripción:</h2>
                                    <div className="space-y-1 text-gray-700 text-sm md:text-base leading-relaxed">
                                        <p><strong>Marca:</strong> {autoDetalles.Marca_auto}</p>
                                        <p><strong>Modelo:</strong> {autoDetalles.Modelo_Auto}</p>
                                        <p><strong>Color:</strong> {autoDetalles.Color_auto}</p>
                                        <p><strong>Año:</strong> {autoDetalles.Año_auto}</p>
                                        <p><strong>Transmisión:</strong> {autoDetalles.Transmision_auto}</p>
                                        <p><strong>Condición:</strong> {autoDetalles.Estado_auto}</p>
                                        <p><strong>Ubicación:</strong> {`${autoDetalles.Ciudad}, ${autoDetalles.Estado}`}</p>
                                        {autoDetalles.Colonia && <p><strong>Colonia:</strong> {autoDetalles.Colonia}</p>}
                                        {autoDetalles.Calle && <p><strong>Calle:</strong> {autoDetalles.Calle}</p>}
                                        {/* Puedes agregar más detalles si los devuelve el backend */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default DetallesAutoCliente;