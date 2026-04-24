import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Fuel, Settings, Calendar, User, Phone, Mail, Sparkles, FileText, Zap, Users, Droplets } from 'lucide-react';
import axios from 'axios';

const VehicleDetail = ({ vehicle, onBack, getImageUrl }) => {
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); 
  const suggestionsRef = useRef(null);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (suggestions.length > 0 && suggestionsRef.current) {
      setTimeout(() => {
        suggestionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [suggestions]);

  useEffect(() => {
    if (vehicle && (vehicle.photoExternal || vehicle.photo_external)) {
      setMainImage(getImageUrl(vehicle.photoExternal || vehicle.photo_external));
    }
    setSuggestions([]); 
  }, [vehicle, getImageUrl]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrenota = async () => {
    if (!formData.fullname || !formData.email || !formData.phone || !formData.startDate || !formData.endDate) {
      alert("⚠️ Attenzione: Devi inserire Nome, Email, Telefono e Date per procedere!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        vehicle_id: Number(vehicle.id),
        customer_name: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        start_date: formData.startDate,
        end_date: formData.endDate
      };
      const response = await axios.post('http://127.0.0.1:8000/ai/process-booking', payload);
      if (response.data.status === "busy") {
        setSuggestions(response.data.suggestions);
        alert(response.data.message || "❌ Auto occupata. Proponiamo delle alternative.");
      } else {
        alert(`✅ PRENOTAZIONE CONFERMATA!\nTotale: €${response.data.total_price}`);
      }
    } catch (err) {
      alert("Errore di connessione con il server AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#333' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#d4a373', fontWeight: 'bold', marginBottom: '20px' }}>
        <ArrowLeft size={20} /> TORNA ALLA FLOTTA
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* PARTE SINISTRA: FOTO E INFO TECNICHE */}
        <div>
          <img src={mainImage} alt={vehicle.model} style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
          
          {/* GRIGLIA DETTAGLI TECNICI AGGIORNATA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
            <DetailBox icon={<Fuel size={18}/>} label="Carburante" value={vehicle.fuel_type || vehicle.fuelType || "Diesel"} />
            <DetailBox icon={<Settings size={18}/>} label="Cambio" value={vehicle.transmission || "Automatico"} />
            <DetailBox icon={<Zap size={18}/>} label="Potenza" value={vehicle.power || "N/D"} />
            <DetailBox icon={<Users size={18}/>} label="Posti" value={vehicle.seats || "5"} />
            {/* NOTA: Qui usiamo .consumption come richiesto */}
            <DetailBox icon={<Droplets size={18}/>} label="Consumo" value={vehicle.consumption || "N/D"} />
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '15px', borderLeft: '5px solid #d4a373' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0', color: '#d4a373' }}>
              <FileText size={18} /> DESCRIZIONE TECNICA
            </h4>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px', color: '#555', fontStyle: 'italic' }}>
              {vehicle.description || vehicle.descrizione || "Nessuna descrizione tecnica disponibile."}
            </p>
          </div>
        </div>

        {/* PARTE DESTRA: FORM */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '5px' }}>{vehicle.brand} <span style={{ color: '#d4a373' }}>{vehicle.model}</span></h2>
          <p style={{ color: '#bc6c25', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>€{vehicle.price_per_day || vehicle.pricePerDay || '50'} / giorno</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={inputContainerStyle}><User size={18} color="#888" /><input name="fullname" placeholder="Nome e Cognome" onChange={handleInputChange} style={inputStyle} /></div>
            <div style={inputContainerStyle}><Mail size={18} color="#888" /><input name="email" type="email" placeholder="La tua Email" onChange={handleInputChange} style={inputStyle} /></div>
            <div style={inputContainerStyle}><Phone size={18} color="#888" /><input name="phone" placeholder="Telefono" onChange={handleInputChange} style={inputStyle} /></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ ...inputContainerStyle, flex: 1 }}><Calendar size={18} color="#888" /><input name="startDate" type="date" onChange={handleInputChange} style={inputStyle} /></div>
              <div style={{ ...inputContainerStyle, flex: 1 }}><Calendar size={18} color="#888" /><input name="endDate" type="date" onChange={handleInputChange} style={inputStyle} /></div>
            </div>
            <button onClick={handlePrenota} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#1a1a1b', color: 'white', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px' }}>
              {loading ? 'CONTROLLO DISPONIBILITÀ...' : 'PRENOTA ORA'}
            </button>
          </div>
        </div>
      </div>

      {/* SEZIONE ALTERNATIVE */}
      {suggestions.length > 0 && (
        <div ref={suggestionsRef} style={{ marginTop: '50px', padding: '30px', backgroundColor: '#fdfaf5', borderRadius: '25px', border: '2px solid #f5e6d3', scrollMarginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles color="#d4a373" />
            <h3 style={{ margin: 0, fontSize: '22px' }}>L'AI consiglia: Alternative allo stesso prezzo</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {suggestions.map((alt) => (
              <div key={alt.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <img src={getImageUrl(alt.photo_external || alt.photoExternal)} alt={alt.model} style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 5px 0' }}>{alt.brand} {alt.model}</h4>
                <p style={{ color: '#bc6c25', fontWeight: 'bold' }}>€{alt.price_per_day || alt.pricePerDay} / giorno</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
const inputContainerStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fdfdfd' };
const inputStyle = { border: 'none', outline: 'none', width: '100%', background: 'transparent' };
const DetailBox = ({ icon, label, value }) => (
  <div style={{ flex: 1, padding: '15px', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
    <div style={{ color: '#d4a373', marginBottom: '5px' }}>{icon}</div>
    <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontWeight: 'bold' }}>{value}</div>
  </div>
);

export default VehicleDetail;