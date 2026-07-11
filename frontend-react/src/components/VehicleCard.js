import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; 

const API_URL = "https://rent-car-ai-engine.onrender.com";

const VehicleCard = ({ vehicle }) => {
    const [suggestions, setSuggestions] = useState([]);
    const { t } = useTranslation(); 

    const handleGetAIInfo = async (id) => {
        try {
            // Puntiamo al server online, non al localhost
            const res = await axios.get(`${API_URL}/ai/suggest/${id}`);
            setSuggestions(res.data.suggestions);
        } catch (err) {
            console.error("L'AI Engine non risponde", err);
        }
    };
    
    // ... (restante codice)
};
export default VehicleCard;