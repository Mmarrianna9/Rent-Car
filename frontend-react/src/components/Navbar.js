import React from 'react';
import { Home, Search, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onHomeClick, onAuthClick, onSearchClick }) => {
  const { t, i18n } = useTranslation();

  // Estraiamo in modo sicuro la lingua corrente (prendendo solo i primi 2 caratteri)
  // Se i18n.language è 'it-IT' o 'it-CH', diventerà semplicemente 'it'
  const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'it';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav style={navStyle}>
      {/* Logo in public/images/logo/logo.png */}
      <div style={{ cursor: 'pointer' }} onClick={onHomeClick}>
        <img src="/images/logo/logo.png" alt="RentCar" style={{ height: '40px' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <Home size={18} onClick={onHomeClick} style={{ cursor: 'pointer' }} />

        {/* Pulsante Accedi / Registrati Tradotto dinamicamente */}
        <button onClick={onAuthClick} style={btnStyle}>
          {t('nav.loginRegister', 'ACCEDI / REGISTRATI')}
        </button>

        <Search size={18} onClick={onSearchClick} style={{ cursor: 'pointer' }} />

        {/* 🌐 SELETTORE DELLA LINGUA STILIZZATO INLINE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '10px' }}>
          <Globe size={16} color="#d4a373" />
          <select
            value={currentLang} /* 👈 MODIFICATO: Usa la stringa pulita a due lettere */
            onChange={(e) => changeLanguage(e.target.value)}
            style={selectStyle}
          >
            <option value="it" style={optionStyle}> IT</option>
            <option value="en" style={optionStyle}> EN</option>
            <option value="ru" style={optionStyle}> RU</option>
            <option value="ro" style={optionStyle}> RO</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

// I tuoi stili originali intatti
const navStyle = {
  backgroundColor: '#1a1a1b', color: '#fefae0', display: 'flex',
  justifyContent: 'space-between', alignItems: 'center',
  padding: '0 40px', height: '60px', borderBottom: '1px solid #d4a373',
  position: 'sticky', top: 0, zIndex: 1000
};

const btnStyle = {
  border: '1px solid #d4a373', padding: '4px 15px', borderRadius: '15px',
  fontSize: '11px', background: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold'
};

const selectStyle = {
  background: 'transparent',
  color: '#fefae0',
  border: '1px solid #d4a373',
  borderRadius: '8px',
  padding: '2px 5px',
  fontSize: '12px',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const optionStyle = {
  backgroundColor: '#1a1a1b',
  color: '#fefae0'
};

export default Navbar;