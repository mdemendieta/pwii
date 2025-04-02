import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook para navegación
import Footer from "./Footer";
import Header from "./Header";

function PantallaPrincipal() {
    const [vehiculos, setVehiculos] = useState([
        { id: 1, nombre: "Carro 1", precio: "$XX,XXX", vendedor: "Juan", img: "/Imagenes/carro1.jpg" },
        { id: 2, nombre: "Carro 2", precio: "$XX,XXX", vendedor: "María", img: "/Imagenes/carro2.jpg" },
        { id: 3, nombre: "Carro 3", precio: "$XX,XXX", vendedor: "Carlos", img: "/Imagenes/carro3.jpg" },
        { id: 4, nombre: "Carro 4", precio: "$XX,XXX", vendedor: "Lucía", img: "/Imagenes/carro4.jpg" },
    ]);

    const navigate = useNavigate(); // Hook para redireccionar

    const handleClick = (vehiculoId) => {
        navigate(`/Componentes/Detallesautocliente`); // Redirige con el ID del vehículo
    };

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')" }}>
            {/* Header */}
            <Header />
            <br />
            <br />
            <br />

            <main className="container mx-auto my-8 px-4">
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <input type="text" placeholder="Buscar por nombre..." className="border rounded-lg px-4 py-2 w-full sm:w-1/3" />
                    <select className="border rounded-lg px-4 py-2">
                        <option value="">Marca</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Ford">Ford</option>
                        <option value="Honda">Honda</option>
                    </select>
                    <select className="border rounded-lg px-4 py-2">
                        <option value="">Modelo</option>
                        <option value="Corolla">Corolla</option>
                        <option value="Civic">Civic</option>
                        <option value="Mustang">Mustang</option>
                    </select>
                    <select className="border rounded-lg px-4 py-2">
                        <option value="">Año</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                    </select>
                    <select className="border rounded-lg px-4 py-2">
                        <option value="">Categoría</option>
                        <option value="Sedán">Sedán</option>
                        <option value="SUV">SUV</option>
                        <option value="Deportivo">Deportivo</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                        Filtrar
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vehiculos.map((vehiculo) => (
                        <div
                            key={vehiculo.id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                            onClick={() => handleClick(vehiculo.id)} // Llama a la función para redirigir
                        >
                            <img src={vehiculo.img} alt={vehiculo.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                            <p className="text-lg font-semibold">{vehiculo.nombre}</p>
                            <p>Precio: {vehiculo.precio}</p>
                            <p>Vendedor: {vehiculo.vendedor}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default PantallaPrincipal;