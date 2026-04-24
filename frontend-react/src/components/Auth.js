import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin 
      ? 'http://localhost:8080/api/auth/login' 
      : 'http://localhost:8080/api/auth/register';

    try {
      const response = await axios.post(url, formData);
      alert(isLogin ? "Accesso effettuato!" : "Registrazione riuscita!");
      
      // Passiamo i dati dell'utente al componente padre (App.js)
      onLoginSuccess(response.data); 
    } catch (error) {
      alert(error.response?.data || "Errore durante l'operazione");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Accedi' : 'Registrati'}</h2>
        <p style={styles.subtitle}>Elite Rent - Luxury Car Experience</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <User size={18} style={styles.icon} />
              <input name="fullname" placeholder="Nome Completo" onChange={handleChange} style={styles.input} required />
            </div>
          )}

          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <Phone size={18} style={styles.icon} />
              <input name="phone" placeholder="Telefono" onChange={handleChange} style={styles.input} required />
            </div>
          )}

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
          </div>

          <button type="submit" style={styles.button}>
            {isLogin ? 'ENTRA' : 'CREA ACCOUNT'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={styles.switchText}>
          {isLogin ? "Non hai un account?" : "Sei già registrato?"}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? ' Registrati ora' : ' Accedi qui'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { fontSize: '28px', marginBottom: '5px', fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: '14px', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '12px', border: '1px solid #eee' },
  icon: { color: '#d4a373', marginRight: '10px' },
  input: { border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  button: { backgroundColor: '#1a1a1b', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' },
  switchText: { marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#bc6c25', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }
};

export default Auth;
