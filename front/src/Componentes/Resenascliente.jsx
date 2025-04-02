import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

function CalificarVendedor() {
    const [rating, setRating] = useState(0); // Estado para manejar la calificación

    const handleStarClick = (index) => {
        setRating(index + 1); // Actualiza el rating al número de estrellas seleccionadas
    };

    const handleSubmit = () => {
        alert(`Has calificado al vendedor con ${rating} estrella(s). ¡Gracias por tu opinión!`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-center" style={{backgroundImage:"url('https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/UJGAOWYYINE7RI3C2NK24KCJJ4.JPG?auth=d6132571f413b0a1cb4ec2dbc92e0ce4bbe75c140093dd9fbc646e59df9c18a6&height=1878&quality=80')",}}>
            {/* Header */}
            <Header />
            <br></br>
            <br></br>
            <br></br>

            <div className="flex flex-grow justify-center items-center">
                <div className="bg-white shadow-lg p-16 rounded-lg border border-gray-300 w-[800px] h-[700px] text-center flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-8">Califica al vendedor.</h2>
                    <hr className="mb-8" />
                    <p className="mb-6 text-xl font-semibold">Calificación:</p>

                    <div className="flex justify-center mb-8 space-x-2">
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index}
                                onClick={() => handleStarClick(index)} 
                                className={`cursor-pointer text-5xl ${
                                    index < rating ? "text-yellow-400" : "text-gray-400"
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <p className="mb-6 text-xl font-semibold">¿Cómo fue el vendedor?</p>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-6 mb-8 h-40 text-xl"
                        placeholder="Escribe tu opinión..."
                    ></textarea>

                    <button
                        className="bg-blue-500 text-white px-3 py-3 rounded-lg hover:bg-blue-600 text-xl font-semibold"
                        onClick={handleSubmit} 
                    >
                        Publicar
                    </button>
                </div>
            </div>

            <br />
            <Footer />
        </div>
    );
}

export default CalificarVendedor;