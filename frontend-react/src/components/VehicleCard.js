import React, { useState } from 'react';
import axios from 'axios';

const VehicleCard = ({ vehicle }) => {
    const [suggestions, setSuggestions] = useState([]);

    const handleGetAIInfo = async (id) => {
        try {
            // Chiamata all'AI Engine (Python)
            const res = await axios.get(`http://localhost:8000/ai/suggest/${id}`);
            setSuggestions(res.data.suggestions);
        } catch (err) {
            console.error("L'AI Engine non risponde", err);
        }
    };

    return (
        <div style={cardStyle}>
            <h3>{vehicle.brand} {vehicle.model}</h3>
            <p>Carburante: <strong>{vehicle.fuelType}</strong></p>
            <button onClick={() => handleGetAIInfo(vehicle.id)} style={buttonStyle}>
                Chiedi suggerimenti AI
            </button>

            {suggestions.length > 0 && (
                <div style={aiBoxStyle}>
                    <small>L'AI suggerisce anche:</small>
                    <ul>
                        {suggestions.map(s => <li key={s.id}>{s.brand} {s.model}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Semplici stili inline per non impazzire con i CSS ora
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '10px', width: '200px', backgroundColor: '#f9f9f9' };
const buttonStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' };
const aiBoxStyle = { marginTop: '10px', fontSize: '0.8rem', color: '#555', borderTop: '1px dashed #ccc' };

export default VehicleCard;