import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Componentes/Footer";
import Header from "./Componentes/Header";
import { useNavigate } from "react-router-dom";

function Reportes() { // Renombrado de ReporteVentas para ser más genérico
    const [ventasVendedor, setVentasVendedor] = useState([]);
    const [comprasComprador, setComprasComprador] = useState([]);
    const [resumenIngresos, setResumenIngresos] = useState({
        totalDebito: 0,
        totalCredito: 0,
        ingresosTotales: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();

    // Para los filtros (aún no funcionales para el comprador)
    const [filtros, setFiltros] = useState({
        marca: "",
        categoria: "",
        anio: "",
        transmision: ""
    });

    useEffect(() => {
        const usuarioActual = localStorage.getItem("usuario");
        if (usuarioActual && usuarioActual !== "undefined") {
            const parsedUser = JSON.parse(usuarioActual);
            setLoggedInUser(parsedUser);
            // Redirección si el tipo de usuario no es ni 1 (comprador) ni 2 (vendedor)
            // o si no hay tipo de usuario definido.
            if (parsedUser.tipoUsuario !== 1 && parsedUser.tipoUsuario !== 2) {
                alert("Acceso no permitido a esta sección.");
                navigate("/PantallaPrincipal");
            }
        } else {
            alert("Debes iniciar sesión para ver esta sección.");
            navigate("/Landing");
        }
    }, [navigate]);

    useEffect(() => {
        if (loggedInUser && loggedInUser.idUsuario) {
            setLoading(true);
            setError(null);

            if (loggedInUser.tipoUsuario === 2) { // Es Vendedor
                const fetchVentasVendedor = async () => {
                    try {
                        const response = await axios.get(`http://localhost:3001/api/vendedor/${loggedInUser.idUsuario}/ventas`);
                        setVentasVendedor(response.data || []);

                        let debito = 0;
                        let credito = 0;
                        let total = 0;
                        (response.data || []).forEach(venta => {
                            total += venta.Precio_pagado;
                            if (venta.metodo_pago_venta === 0) { // Asumiendo 0 para Débito
                                debito += venta.Precio_pagado;
                            } else if (venta.metodo_pago_venta === 1) { // Asumiendo 1 para Crédito
                                credito += venta.Precio_pagado;
                            }
                        });
                        setResumenIngresos({
                            totalDebito: debito,
                            totalCredito: credito,
                            ingresosTotales: total,
                        });
                    } catch (err) {
                        console.error("Error al obtener el reporte de ventas:", err);
                        setError("No se pudo cargar el reporte de ventas.");
                    } finally {
                        setLoading(false);
                    }
                };
                fetchVentasVendedor();
            } else if (loggedInUser.tipoUsuario === 1) { // Es Comprador
                const fetchComprasComprador = async () => {
                    try {
                        // **IMPORTANTE**: Necesitas crear este endpoint en tu backend
                        const response = await axios.get(`http://localhost:3001/api/comprador/${loggedInUser.idUsuario}/compras`);
                        setComprasComprador(response.data || []);
                    } catch (err) {
                        console.error("Error al obtener el historial de compras:", err);
                        setError("No se pudo cargar el historial de compras.");
                    } finally {
                        setLoading(false);
                    }
                };
                fetchComprasComprador();
            } else {
                setLoading(false); // Si no es ni vendedor ni comprador, o tipo no definido
            }
        }
    }, [loggedInUser]);

    const handleFiltroChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

    const handleBuscarClick = () => {
        alert("Funcionalidad de búsqueda/filtrado aún no implementada para esta vista.");
    };

    const formatPrice = (price) => { /* ... (sin cambios) ... */ };
    const formatMetodoPago = (metodo) => { /* ... (sin cambios) ... */ };

    if (loading) { /* ... (UI de carga sin cambios) ... */ }
    if (error) { /* ... (UI de error sin cambios) ... */ }
    
    const renderReporteVendedor = () => (
        <>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Reporte de Mis Ventas</h2>
            <hr className="mb-6" />
            {/* Filtros (Visuales por ahora para vendedor) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <input type="text" name="marca" value={filtros.marca} onChange={handleFiltroChange} placeholder="Marca" className="border p-2 rounded" />
                {/* ... otros filtros ... */}
            </div>
            <div className="text-center mb-6">
                <button onClick={handleBuscarClick} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow-md">
                    Buscar / Filtrar Ventas
                </button>
            </div>
            <div className="overflow-x-auto mt-4">
                <table className="w-full border border-collapse text-sm md:text-base">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Auto Vendido</th>
                            <th className="border p-2">Fecha Venta</th>
                            <th className="border p-2">Comprador</th>
                            <th className="border p-2 text-right">Precio Venta</th>
                            <th className="border p-2">Método Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasVendedor.length > 0 ? ventasVendedor.map((venta) => (
                            <tr key={venta.id_venta}>
                                <td className="border p-2">{`${venta.Marca_auto || ''} ${venta.Modelo_Auto || ''} (${venta.Anio_auto || ''})`}</td>
                                <td className="border p-2">{new Date(venta.fecha_venta).toLocaleDateString('es-MX')}</td>
                                <td className="border p-2">{venta.nombre_comprador || 'N/A'}</td>
                                <td className="border p-2 text-right">{formatPrice(venta.Precio_pagado)}</td>
                                <td className="border p-2">{formatMetodoPago(venta.metodo_pago_venta)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center border p-4">No has realizado ventas aún.</td></tr>
                        )}
                    </tbody>
                    {ventasVendedor.length > 0 && (
                        <tfoot>
                            {/* ... tfoot con resumen de ingresos ... */}
                             <tr className="bg-gray-100 font-semibold">
                                <td className="border p-2 text-right" colSpan="4">Ingresos con Tarjeta de Débito:</td>
                                <td className="border p-2 text-right">{formatPrice(resumenIngresos.totalDebito)}</td>
                            </tr>
                            <tr className="bg-gray-100 font-semibold">
                                <td className="border p-2 text-right" colSpan="4">Ingresos con Tarjeta de Crédito:</td>
                                <td className="border p-2 text-right">{formatPrice(resumenIngresos.totalCredito)}</td>
                            </tr>
                            <tr className="bg-gray-200 font-bold">
                                <td className="border p-2 text-right" colSpan="4">Ingresos Totales:</td>
                                <td className="border p-2 text-right">{formatPrice(resumenIngresos.ingresosTotales)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </>
    );

    const renderHistorialComprador = () => (
        <>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Mis Compras</h2>
            <hr className="mb-6" />
            {/* Podrías añadir filtros para compras si es relevante */}
            <div className="overflow-x-auto mt-4">
                <table className="w-full border border-collapse text-sm md:text-base">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Auto Comprado</th>
                            <th className="border p-2">Fecha Compra</th>
                            <th className="border p-2">Vendedor</th>
                            <th className="border p-2 text-right">Precio Pagado</th>
                            <th className="border p-2">Método Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comprasComprador.length > 0 ? comprasComprador.map((compra) => (
                            <tr key={compra.id_venta}>
                                <td className="border p-2">{`${compra.Marca_auto || ''} ${compra.Modelo_Auto || ''} (${compra.Anio_auto || ''})`}</td>
                                <td className="border p-2">{new Date(compra.fecha_venta).toLocaleDateString('es-MX')}</td>
                                <td className="border p-2">{compra.nombre_vendedor || 'N/A'}</td>
                                <td className="border p-2 text-right">{formatPrice(compra.Precio_pagado)}</td>
                                <td className="border p-2">{formatMetodoPago(compra.metodo_pago_venta)}</td>
                            </tr>
                        )) : (
                             <tr><td colSpan="5" className="text-center border p-4">No has realizado compras aún.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex flex-col bg-cover items-center bg-center w-full" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            <Header />
            <div className="pt-20 md:pt-24 w-full">
                <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-7xl mx-auto my-8 bg-opacity-95 min-h-[600px]">
                    {loggedInUser && loggedInUser.tipoUsuario === 2 && renderReporteVendedor()}
                    {loggedInUser && loggedInUser.tipoUsuario === 1 && renderHistorialComprador()}
                    {/* Podrías mostrar un mensaje si el tipo de usuario no es ni 1 ni 2, aunque el useEffect ya redirige */}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Reportes;