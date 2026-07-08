import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; 

const VehicleCard = ({ vehicle }) => {
    const [suggestions, setSuggestions] = useState([]);
    const { t } = useTranslation(); 

    const handleGetAIInfo = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/ai/suggest/${id}`);
            setSuggestions(res.data.suggestions);
        } catch (err) {
            console.error("L'AI Engine non risponde", err);
        }
    };

    return (
        <div style={cardStyle}>
            <h3>{vehicle.brand} {vehicle.model}</h3>
            {/* Usiamo le chiavi di traduzione  "Carburante" */}
            <p>{t('vehicle.fuel', 'Carburante')}: <strong>{vehicle.fuelType}</strong></p>
            
            <button onClick={() => handleGetAIInfo(vehicle.id)} style={buttonStyle}>
                {t('vehicle.askAi', 'Chiedi suggerimenti AI')}
            </button>

            {suggestions.length > 0 && (
                <div style={aiBoxStyle}>
                    <small>{t('vehicle.aiSuggests', "L'AI suggerisce anche:")}</small>
                    <ul>
                        {suggestions.map(s => <li key={s.id}>{s.brand} {s.model}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};


const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '10px', width: '200px', backgroundColor: '#f9f9f9' };
const buttonStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' };
const aiBoxStyle = { marginTop: '10px', fontSize: '0.8rem', color: '#555', borderTop: '1px dashed #ccc' };

export default VehicleCard;