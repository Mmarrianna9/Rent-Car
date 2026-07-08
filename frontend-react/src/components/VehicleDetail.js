import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Fuel, Settings, Calendar, User, Phone, Mail, Sparkles, FileText, Zap, Users, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Gestione multilingue
import axios from 'axios';

const VehicleDetail = ({ vehicle, onBack, getImageUrl }) => {
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); 
  const suggestionsRef = useRef(null);
  const { t, i18n } = useTranslation(); // Recuperiamo sia 't' che 'i18n' per la lingua attiva

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  // Funzione dinamica per pescare la descrizione corretta dal database
  const getDynamicDescription = () => {
    if (!vehicle) return "";
    return vehicle.description || t('vehicle.noDescription', 'Nessuna descrizione tecnica disponibile.');
  };

  // Effetto per gestire lo scorrimento automatico verso le alternative AI senza crash
  useEffect(() => {
    if (suggestions && suggestions.length > 0 && suggestionsRef.current) {
      const timer = setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
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
      alert(t('form.alertMissing', "⚠️ Attenzione: Devi inserire Nome, Email, Telefono e Date per procedere!"));
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

      // Invia la richiesta a FastAPI passando l'header della lingua corrente
      const response = await axios.post('http://127.0.0.1:8000/ai/process-booking', payload, {
        headers: {
          'Accept-Language': i18n.language || 'it'
        }
      });

      if (response.data.status === "busy") {
        // 1. Mostriamo prima l'alert per avvisare l'utente
        alert(response.data.message || t('form.busyCar', "❌ Auto occupata. Proponiamo delle alternative."));
        
        // 2. Normalizziamo l'array delle alternative per digerire sia snake_case che camelCase
        const normalizedSuggestions = (response.data.suggestions || []).map(item => ({
          id: item.id,
          brand: item.brand,
          model: item.model,
          pricePerDay: item.pricePerDay || item.price_per_day || 50,
          photoExternal: item.photoExternal || item.photo_external || '',
          description: item.description || ''
        }));

        // 3. Carichiamo lo stato in modo pulito
        setSuggestions(normalizedSuggestions);
      } else {
        alert(`${t('form.success', '✅ PRENOTAZIONE CONFERMATA!')}\nTotale: €${response.data.total_price}`);
      }
    } catch (err) {
      alert(t('form.errorApi', "Errore di connessione con il server AI."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#333' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#d4a373', fontWeight: 'bold', marginBottom: '20px' }}>
        <ArrowLeft size={20} /> {t('nav.backToFleet', 'TORNA ALLA FLOTTA')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* PARTE SINISTRA: FOTO E INFO TECNICHE */}
        <div>
          {mainImage && <img src={mainImage} alt={vehicle.model} style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />}
          
          {/* GRIGLIA DETTAGLI TECNICI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
            <DetailBox icon={<Fuel size={18}/>} label={t('vehicle.fuel', 'Carburante')} value={vehicle.fuel_type || vehicle.fuelType || "Diesel"} />
            <DetailBox icon={<Settings size={18}/>} label={t('vehicle.transmission', 'Cambio')} value={vehicle.transmission || "Automatico"} />
            <DetailBox icon={<Zap size={18}/>} label={t('vehicle.power', 'Potenza')} value={vehicle.power || "N/D"} />
            <DetailBox icon={<Users size={18}/>} label={t('vehicle.seats', 'Posti')} value={vehicle.seats || "5"} />
            <DetailBox icon={<Droplets size={18}/>} label={t('vehicle.consumption', 'Consumo')} value={vehicle.consumption || "N/D"} />
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '15px', borderLeft: '5px solid #d4a373' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0', color: '#d4a373' }}>
              <FileText size={18} /> {t('vehicle.technicalDescription', 'DESCRIZIONE TECNICA')}
            </h4>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px', color: '#555', fontStyle: 'italic' }}>
              {getDynamicDescription()}
            </p>
          </div>
        </div>

        {/* PARTE DESTRA: FORM PRENOTAZIONE */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '5px' }}>{vehicle.brand} <span style={{ color: '#d4a373' }}>{vehicle.model}</span></h2>
          <p style={{ color: '#bc6c25', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>€{vehicle.price_per_day || vehicle.pricePerDay || '50'} / {t('vehicle.day', 'giorno')}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={inputContainerStyle}><User size={18} color="#888" /><input name="fullname" placeholder={t('form.placeholderName', 'Nome e Cognome')} onChange={handleInputChange} style={inputStyle} /></div>
            <div style={inputContainerStyle}><Mail size={18} color="#888" /><input name="email" type="email" placeholder={t('form.placeholderEmail', 'La tua Email')} onChange={handleInputChange} style={inputStyle} /></div>
            <div style={inputContainerStyle}><Phone size={18} color="#888" /><input name="phone" placeholder={t('form.placeholderPhone', 'Telefono')} onChange={handleInputChange} style={inputStyle} /></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ ...inputContainerStyle, flex: 1 }}><Calendar size={18} color="#888" /><input name="startDate" type="date" onChange={handleInputChange} style={inputStyle} /></div>
              <div style={{ ...inputContainerStyle, flex: 1 }}><Calendar size={18} color="#888" /><input name="endDate" type="date" onChange={handleInputChange} style={inputStyle} /></div>
            </div>
            <button onClick={handlePrenota} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#1a1a1b', color: 'white', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px' }}>
              {loading ? t('form.checking', 'CONTROLLO DISPONIBILITÀ...') : t('form.bookNow', 'PRENOTA ORA')}
            </button>
          </div>
        </div>
      </div>

      {/* SEZIONE ALTERNATIVE CONSIGLIATE DALL'AI */}
      {suggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} style={{ marginTop: '50px', padding: '30px', backgroundColor: '#fdfaf5', borderRadius: '25px', border: '2px solid #f5e6d3', scrollMarginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles color="#d4a373" />
            <h3 style={{ margin: 0, fontSize: '22px' }}>{t('ai.suggestionsTitle', "L'AI consiglia: Alternative allo stesso prezzo")}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {suggestions.map((alt) => (
              <div key={alt.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <img src={getImageUrl(alt.photoExternal)} alt={alt.model} style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 5px 0' }}>{alt.brand} {alt.model}</h4>
                <p style={{ color: '#bc6c25', fontWeight: 'bold' }}>€{alt.pricePerDay} / {t('vehicle.day', 'giorno')}</p>
                <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', padding: '0 10px' }}>{alt.description}</p>
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