// pwii/front/src/Comprarauto.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";

function ComprarAuto() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [autoParaComprar, setAutoParaComprar] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [metodoPago, setMetodoPago] = useState("2"); // Default to "2" (Débito)
    const [formData, setFormData] = useState({ // For card details (optional for this scope)
        numeroTarjeta: "",
        fechaVencimiento: "",
        cvv: "",
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado && usuarioGuardado !== "undefined") {
            try {
                setLoggedInUser(JSON.parse(usuarioGuardado));
            } catch (error) {
                console.error("Error al parsear usuario de localStorage:", error);
                localStorage.removeItem("usuario");
                navigate("/Landing"); // Redirect if user data is corrupted
            }
        } else {
            alert("Debes iniciar sesión para comprar un auto.");
            navigate("/Landing");
        }

        if (location.state && location.state.auto) {
            setAutoParaComprar(location.state.auto);
        } else {
            alert("No se han proporcionado detalles del auto para la compra.");
            navigate(-1); // Go back to the previous page
        }
    }, [location.state, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMetodoChange = (e) => {
        setMetodoPago(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!autoParaComprar || !loggedInUser) {
            alert("Faltan datos para procesar la compra.");
            return;
        }

        setIsProcessing(true);

        const datosVenta = {
            id_usuario_comprador: loggedInUser.idUsuario,
            id_usuario_vendedor: autoParaComprar.id_vendedor_usuario, // or autoParaComprar.id_vendedor
            id_auto_venta: autoParaComprar.id_auto,
            metodo_pago_venta: parseInt(metodoPago, 10), // "1" for Crédito, "2" for Débito
            Precio_pagado: autoParaComprar.Precio_auto,
            // Card details (formData) are not explicitly sent unless your backend /api/venta needs them
        };

        console.log("Enviando datos de venta:", datosVenta);

        try {
            // **IMPORTANTE**: Debes crear este endpoint POST /api/venta en tu backend
            const response = await axios.post("http://localhost:3001/api/venta", datosVenta);

            if (response.data.msg === "ok") {
                alert("¡Compra realizada con éxito!");
                // Pasar datos necesarios a la página de reseñas
                navigate(`/Resenascliente`, { 
                    state: { 
                        vendedorId: autoParaComprar.id_vendedor_usuario, // or autoParaComprar.id_vendedor
                        nombreVendedor: autoParaComprar.nombre_vendedor,
                        autoCompradoId: autoParaComprar.id_auto 
                    } 
                });
            } else {
                alert(`Error en la compra: ${response.data.error || "Ocurrió un error desconocido."}`);
            }
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            alert(`Error de red o servidor: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const formatPrice = (price) => {
        if (typeof price !== 'number' && typeof price !== 'string') return "N/A";
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return "N/A";
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numericPrice);
    };

    if (!autoParaComprar) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-xl">Cargando información del auto...</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <div className="pt-20 md:pt-24">
                <main className="w-full max-w-2xl md:max-w-3xl bg-white p-6 md:p-10 border border-gray-300 bg-opacity-90 rounded-lg shadow-lg mx-auto my-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Confirmar Compra</h1>
                    <hr className="mb-6" />

                    {/* Detalles del Auto */}
                    <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h2 className="text-xl font-semibold mb-3">{`${autoParaComprar.Marca_auto} ${autoParaComprar.Modelo_Auto}`}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                            <p><strong>Año:</strong> {autoParaComprar.Año_auto}</p>
                            <p><strong>Color:</strong> {autoParaComprar.Color_auto}</p>
                            <p><strong>Kilometraje:</strong> {autoParaComprar.Kilometraje_auto} km</p>
                            <p><strong>Transmisión:</strong> {autoParaComprar.Transmision_auto}</p>
                            <p><strong>Condición:</strong> {autoParaComprar.Estado_auto}</p>
                            <p><strong>Vendedor:</strong> {autoParaComprar.nombre_vendedor}</p>
                            <p className="sm:col-span-2"><strong>Ubicación:</strong> {`${autoParaComprar.Ciudad}, ${autoParaComprar.Estado}`}</p>
                            <p className="sm:col-span-2 text-lg font-bold text-green-600"><strong>Precio Final:</strong> {formatPrice(autoParaComprar.Precio_auto)}</p>
                        </div>
                         {autoParaComprar.imagenes && autoParaComprar.imagenes.length > 0 && (
                            <img 
                                src={autoParaComprar.imagenes[0].contenido} 
                                alt="Auto a comprar" 
                                className="mt-4 w-full max-w-sm mx-auto h-auto object-contain rounded-md"
                            />
                        )}
                    </div>

                    {/* Formulario de Pago */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
                            <h2 className="text-lg font-bold text-center mb-4">Método de pago</h2>
                            <hr className="my-4" />
                            <div className="mb-4">
                                <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 mb-1">Selecciona tu método de pago:</label>
                                <select
                                    id="metodoPago"
                                    name="metodoPago"
                                    value={metodoPago}
                                    onChange={handleMetodoChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="2">Tarjeta de Débito</option>
                                    <option value="1">Tarjeta de Crédito</option>
                                </select>
                            </div>

                            {/* Campos de tarjeta (opcionales para este ejercicio si no se procesa pago real) */}
                            <label className="block text-sm font-medium text-gray-700">
                                Número de tarjeta:
                                <input type="text" name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="XXXX XXXX XXXX XXXX" />
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Fecha de vencimiento:
                                    <input type="text" name="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="MM/AA" />
                                </label>
                                <label className="block text-sm font-medium text-gray-700">
                                    CVV:
                                    <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="XXX" />
                                </label>
                            </div>
                        </div>
                        
                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Procesando Compra..." : "Confirmar y Pagar"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default ComprarAuto;