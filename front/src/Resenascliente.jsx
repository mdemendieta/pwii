import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation para obtener estado de ruta
import axios from "axios"; // Para enviar datos al backend
import Header from "./Componentes/Header";
import Footer from "./Componentes/Footer";

function CalificarVendedor() {
    const [rating, setRating] = useState(0);
    const [textoResena, setTextoResena] = useState(""); // Estado para el texto de la reseña
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [vendedorInfo, setVendedorInfo] = useState(null); // Para guardar ID y nombre del vendedor

    const navigate = useNavigate();
    const location = useLocation(); // Para acceder a los datos pasados en navigate

    useEffect(() => {
        // Obtener usuario logueado
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado && usuarioGuardado !== "undefined") {
            try {
                setLoggedInUser(JSON.parse(usuarioGuardado));
            } catch (error) {
                console.error("Error al parsear usuario de localStorage:", error);
                navigate("/Landing"); // Si hay error, mejor redirigir
            }
        } else {
            alert("Debes iniciar sesión para calificar.");
            navigate("/Landing");
        }

        // Obtener datos del vendedor pasados desde Comprarauto.jsx
        if (location.state && location.state.vendedorId) {
            setVendedorInfo({
                id: location.state.vendedorId,
                nombre: location.state.nombreVendedor || "Vendedor",
                // autoCompradoId: location.state.autoCompradoId // Si lo necesitas
            });
        } else {
            alert("No se pudo identificar al vendedor a calificar.");
            navigate("/"); // O a la pantalla principal
        }
    }, [navigate, location.state]);

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleTextoChange = (e) => {
        setTextoResena(e.target.value);
    };

    const handleSubmit = async () => {
        if (!loggedInUser || !vendedorInfo) {
            alert("Error: No se pudo identificar al comprador o al vendedor.");
            return;
        }
        if (rating === 0) {
            alert("Por favor, selecciona una calificación (estrellas).");
            return;
        }
        if (textoResena.trim() === "") {
            alert("Por favor, escribe tu opinión sobre el vendedor.");
            return;
        }

        const datosResena = {
            id_usuario_comprador: loggedInUser.idUsuario,
            id_usuario_vendedor: vendedorInfo.id,
            texto_resena: textoResena,
            calificacion_vendedor: rating,
            // autoId: vendedorInfo.autoCompradoId // Opcional, si tu tabla_resenas lo soporta
        };

        try {
            // **IMPORTANTE**: Debes crear este endpoint POST /api/resena en tu backend
            const response = await axios.post("http://localhost:3001/api/resena", datosResena);

            if (response.data.msg === "ok") {
                alert(`Has calificado al vendedor ${vendedorInfo.nombre} con ${rating} estrella(s). ¡Gracias por tu opinión!`);
                navigate("/PantallaPrincipal"); // O a donde quieras redirigir después de la reseña
            } else {
                alert(`Error al publicar la reseña: ${response.data.error || "Error desconocido."}`);
            }
        } catch (error) {
            console.error("Error al enviar reseña:", error);
            alert(`Ocurrió un error de red o servidor: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{backgroundImage:"url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')",}}>
            <Header />
            <div className="pt-20 md:pt-24 flex-grow"> {/* Added padding-top */}
                <div className="flex flex-grow justify-center items-center py-8 px-4">
                    <div className="bg-white shadow-lg p-8 sm:p-12 md:p-16 rounded-lg border border-gray-300 w-full max-w-2xl md:max-w-3xl text-center flex flex-col justify-center">
                        <h2 className="text-xl sm:text-2xl font-bold mb-6">Califica al vendedor: {vendedorInfo?.nombre || ""}</h2>
                        <hr className="mb-6" />
                        <p className="mb-4 text-lg sm:text-xl font-semibold">Tu Calificación:</p>

                        <div className="flex justify-center mb-6 space-x-1 sm:space-x-2">
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleStarClick(index)} 
                                    className={`cursor-pointer text-4xl sm:text-5xl transition-colors ${
                                        index < rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                                    }`}
                                    role="button" // For accessibility
                                    tabIndex={0} // For accessibility
                                    onKeyPress={(e) => e.key === 'Enter' && handleStarClick(index)} // For accessibility
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <p className="mb-4 text-lg sm:text-xl font-semibold">¿Cómo fue tu experiencia con el vendedor?</p>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-4 mb-6 h-32 sm:h-40 text-base sm:text-lg"
                            placeholder="Escribe tu opinión aquí..."
                            value={textoResena}
                            onChange={handleTextoChange}
                            required
                        ></textarea>

                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 text-lg sm:text-xl font-semibold transition shadow-md"
                            onClick={handleSubmit} 
                        >
                            Publicar Reseña
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CalificarVendedor;