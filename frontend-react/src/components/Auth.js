
import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

// URL del backend su Render
const API_URL = "https://rent-car-ai-engine.onrender.com";

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullname: '', email: '', phone: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      alert(isLogin ? "Accesso effettuato!" : "Registrazione riuscita!");
      onLoginSuccess(response.data); 
    } catch (error) {
      alert(error.response?.data?.message || "Errore durante l'operazione");
    }
  };

  // ... (ritorna il JSX come nel tuo codice originale)
};
export default Auth;