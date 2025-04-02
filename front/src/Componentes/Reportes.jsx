import React from "react";
import Footer from "./Footer";
import Header from "./Header";

function ReporteVentas() {
    const datosTabla = [
        { marca: "Toyota", cantidad: 5, ingresos: 150000, porcentaje: "33.333%" },
        { marca: "Honda", cantidad: 4, ingresos: 120000, porcentaje: "35%" },
        { marca: "Ford", cantidad: 3, ingresos: 90000, porcentaje: "20%" },
        { marca: "BMW", cantidad: 3, ingresos: 90000, porcentaje: "15%" },
    ];

    const resumenIngresos = [
        { tipo: "Ingresos con Tarjeta de Débito", monto: 225000 },
        { tipo: "Ingresos con Tarjeta de Crédito", monto: 225000 },
    ];

    const ingresosTotales = 450000;

    return (
        <div className="min-h-screen flex flex-col bg-cover items-center bg-center w-full" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            {/* Header */}
            <Header />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
            {/* Contenedor Principal */}
            <div className="bg-white p-10 rounded-lg shadow-lg w-full bg-opacity-95 max-w-7xl min-h-[600px]">
                <h2 className="text-xl font-bold text-center mb-4">Reporte de ventas</h2>
                <hr className="mb-4" />

                {/* Filtros */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <input type="text" placeholder="Marca" className="border p-2 rounded" />
                    <input type="text" placeholder="Categoría" className="border p-2 rounded" />
                    <input type="text" placeholder="Año" className="border p-2 rounded" />
                    <input type="text" placeholder="Transmisión" className="border p-2 rounded" />
                </div>

                {/* Botón Buscar */}
                <div className="text-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Buscar
                    </button>
                </div>

                {/* Tabla de Ventas */}
                <div className="overflow-x-auto mt-4">
                    <table className="w-full border border-collapse mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Marca</th>
                                <th className="border p-2">Cantidad vendida</th>
                                <th className="border p-2">Ingresos</th>
                                <th className="border p-2">Porcentajes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosTabla.map((dato, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{dato.marca}</td>
                                    <td className="border p-2">{dato.cantidad}</td>
                                    <td className="border p-2">{dato.ingresos.toLocaleString()}</td>
                                    <td className="border p-2">{dato.porcentaje}</td>
                                </tr>
                            ))}
                            {resumenIngresos.map((resumen, index) => (
                                <tr className="bg-gray-100" key={index}>
                                    <td className="border p-2" colSpan="3">
                                        {resumen.tipo}
                                    </td>
                                    <td className="border p-2">{resumen.monto.toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="bg-gray-200 font-bold">
                                <td className="border p-2" colSpan="3">Ingresos Totales</td>
                                <td className="border p-2">{ingresosTotales.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <br />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default ReporteVentas;