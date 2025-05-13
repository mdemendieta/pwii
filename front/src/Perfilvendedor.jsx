import React, { useState } from "react";
import Perfildeusuarios from "./Componentes/Perfildeusuarios";
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";

function PerfilVendedor() {

    const autosVendidos = [
        { imagen: "Foto", modelo: "Corolla", marca: "Toyota", año: 2020, precio: "180,000", comprador: "Juan Rodriguez" },
        { imagen: "Foto", modelo: "City", marca: "Toyota", año: 2020, precio: "100,000", comprador: "Alejandro Lopez" },
        { imagen: "Foto", modelo: "Rav", marca: "Toyota", año: 2020, precio: "220,000", comprador: "Angel Melendez" },
    ];

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')",
            }}
        >
            {/* Header */}
            <Header />
            <br/>
            <br/>
            <br/>

            {/* Perfil de Vendedor */}
            <Perfildeusuarios/>

            {/* Autos Vendidos */}
            <div className="flex justify-center items-center py-8">
                <div className="border border-gray-400 p-8 bg-white bg-opacity-80 shadow-lg w-[900px]">
                    <h1 className="text-center text-2xl font-semibold mb-6">Autos vendidos.</h1>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-black text-center">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-black px-4 py-2">Imagen.</th>
                                    <th className="border border-black px-4 py-2">Modelo.</th>
                                    <th className="border border-black px-4 py-2">Marca.</th>
                                    <th className="border border-black px-4 py-2">Año.</th>
                                    <th className="border border-black px-4 py-2">Precio.</th>
                                    <th className="border border-black px-4 py-2">Comprador.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {autosVendidos.map((auto, index) => (
                                    <tr key={index}>
                                        <td className="border border-black px-4 py-2">
                                            <div className="w-16 h-16 bg-white-300 border border-black flex items-center justify-center">
                                                {auto.imagen}
                                            </div>
                                        </td>
                                        <td className="border border-black px-4 py-2">{auto.modelo}</td>
                                        <td className="border border-black px-4 py-2">{auto.marca}</td>
                                        <td className="border border-black px-4 py-2">{auto.año}</td>
                                        <td className="border border-black px-4 py-2">{auto.precio}</td>
                                        <td className="border border-black px-4 py-2">{auto.comprador}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default PerfilVendedor;