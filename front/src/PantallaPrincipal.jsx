import React, { useState, useEffect } from "react"; // useEffect importado
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importar axios para hacer la petición
import Footer from "./Componentes/Footer";
import Header from "./Componentes/Header";

function PantallaPrincipal() {
    // Inicializa vehiculos como un array vacío. Se llenará con datos del backend.
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true); // Para manejar el estado de carga
    const [error, setError] = useState(null); // Para manejar errores de carga

    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener los vehículos del backend
        const fetchVehiculos = async () => {
            try {
                setLoading(true);
                // **IMPORTANTE**: Debes crear este endpoint en tu backend (pwii/server/index.js)
                // Debería devolver un array de autos, cada uno con:
                // id_auto, Marca_auto, Modelo_Auto, Precio_auto, nombre_vendedor, y foto_principal_auto (Base64 o URL)
                const response = await axios.get("http://localhost:3001/api/autosPublicados"); 
                setVehiculos(response.data);
                setError(null);
            } catch (err) {
                console.error("Error al obtener vehículos:", err);
                setError("No se pudieron cargar los vehículos. Intente más tarde.");
                // Podrías dejar los vehículos de ejemplo si falla la carga, o mostrar un mensaje.
                // setVehiculos([ /* tus vehículos de ejemplo como fallback */ ]);
            } finally {
                setLoading(false);
            }
        };

        fetchVehiculos();
    }, []); // El array vacío [] asegura que esto se ejecute solo una vez cuando el componente se monte

    const handleClick = (vehiculoId) => {
        // Navegar a la página de detalles del auto, pasando el ID del vehículo
        // Asegúrate de que tu ruta en App.js esté configurada para aceptar un ID, ej: /Detallesautocliente/:autoId
        navigate(`/Detallesautocliente/${vehiculoId}`); 
    };

    // Formateador de moneda (opcional, pero útil)
    const formatPrice = (price) => {
        if (typeof price !== 'number') {
            return price; // Devuelve el valor original si no es un número
        }
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
                <Header />
                <div className="flex-grow flex items-center justify-center text-white text-2xl">Cargando vehículos...</div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
             <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
                <Header />
                <div className="flex-grow flex items-center justify-center text-red-500 text-2xl bg-white bg-opacity-70 p-10 rounded">{error}</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <div className="pt-20"> {/* Ajusta este padding si tu Header es fijo */}
                <main className="container mx-auto my-8 px-4">
                    <div className="flex flex-wrap justify-center gap-4 mb-8 bg-gray-100 bg-opacity-80 p-4 rounded-lg">
                        {/* TODO: Implementar la lógica de filtrado */}
                        <input type="text" placeholder="Buscar por nombre..." className="border rounded-lg px-4 py-2 w-full sm:w-auto" />
                        <select className="border rounded-lg px-4 py-2 sm:w-auto">
                            <option value="">Marca</option>
                            {/* Estas opciones deberían cargarse dinámicamente o ser más completas */}
                        </select>
                        <select className="border rounded-lg px-4 py-2 sm:w-auto">
                            <option value="">Modelo</option>
                        </select>
                        <select className="border rounded-lg px-4 py-2 sm:w-auto">
                            <option value="">Año</option>
                        </select>
                        <select className="border rounded-lg px-4 py-2 sm:w-auto">
                            <option value="">Categoría</option>
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            Filtrar
                        </button>
                    </div>

                    {vehiculos.length === 0 && !loading && (
                        <div className="text-center text-xl text-gray-700 bg-white bg-opacity-70 p-10 rounded-lg">
                            No hay vehículos publicados por el momento.
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {vehiculos.map((vehiculo) => (
                            <div
                                key={vehiculo.id_auto} // Usa el ID real del auto
                                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
                                onClick={() => handleClick(vehiculo.id_auto)}
                            >
                                <img 
                                    // Asumiendo que el backend envía la imagen como Base64 o una URL completa
                                    src={vehiculo.foto_principal_auto || "/Imagenes/placeholder_auto.png"} // Usa un placeholder si no hay imagen
                                    alt={`${vehiculo.Marca_auto} ${vehiculo.Modelo_Auto}`} 
                                    className="w-full h-48 object-cover rounded-md mb-3" 
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{`${vehiculo.Marca_auto} ${vehiculo.Modelo_Auto}`}</h3>
                                    <p className="text-md text-green-600 font-bold">{formatPrice(vehiculo.Precio_auto)}</p>
                                    <p className="text-sm text-gray-600">Año: {vehiculo.Año_auto}</p>
                                    <p className="text-sm text-gray-500">Vendedor: {vehiculo.nombre_vendedor || "No disponible"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default PantallaPrincipal;