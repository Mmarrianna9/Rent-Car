import React, { useState } from 'react';
import { Home, Search, Globe, Menu, X, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onHomeClick, onAuthClick, onSearchClick }) => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'it';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <div style={{ cursor: 'pointer' }} onClick={() => { onHomeClick(); setMenuOpen(false); }}>
          <img src="/images/logo/logo.png" alt="RentCar" style={{ height: '35px' }} />
        </div>

        {/* Parte destra: Selettore Lingua + Pulsante Menu (Hamburger) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Selettore Lingua */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Globe size={16} color="#d4a373" />
            <select
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              style={selectStyle}
            >
              <option value="it" style={optionStyle}>IT</option>
              <option value="en" style={optionStyle}>EN</option>
              <option value="ru" style={optionStyle}>RU</option>
              <option value="ro" style={optionStyle}>RO</option>
            </select>
          </div>

          {/* Icona Menu Hamburger */}
          <div 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#d4a373' }}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </div>
        </div>
      </nav>

      {/* Menu a comparsa con icone e descrizioni (visibile solo dopo aver cliccato il menu) */}
      {menuOpen && (
        <div style={dropdownMenuStyle}>
          <div 
            style={menuItemStyle} 
            onClick={() => { onHomeClick(); setMenuOpen(false); }}
          >
            <Home size={20} color="#d4a373" />
            <div>
              <span style={menuItemTitleStyle}>Home</span>
              <p style={menuItemDescStyle}>Torna alla pagina principale</p>
            </div>
          </div>

          <div 
            style={menuItemStyle} 
            onClick={() => { onAuthClick(); setMenuOpen(false); }}
          >
            <User size={20} color="#d4a373" />
            <div>
              <span style={menuItemTitleStyle}>{t('nav.loginRegister', 'ACCEDI / REGISTRATI')}</span>
              <p style={menuItemDescStyle}>Gestisci il tuo account o registrati</p>
            </div>
          </div>

          <div 
            style={menuItemStyle} 
            onClick={() => { onSearchClick(); setMenuOpen(false); }}
          >
            <Search size={20} color="#d4a373" />
            <div>
              <span style={menuItemTitleStyle}>Cerca Veicolo</span>
              <p style={menuItemDescStyle}>Trova l'auto perfetta per le tue esigenze</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Stili CSS
const navStyle = {
  backgroundColor: '#1a1a1b', color: '#fefae0', display: 'flex',
  justifyContent: 'space-between', alignItems: 'center',
  padding: '0 20px', height: '60px', borderBottom: '1px solid #d4a373',
  position: 'sticky', top: 0, zIndex: 1000
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

const dropdownMenuStyle = {
  position: 'absolute',
  top: '60px',
  left: 0,
  width: '100%',
  backgroundColor: '#1a1a1b',
  borderBottom: '2px solid #d4a373',
  boxShadow: '0px 8px 16px rgba(0,0,0,0.5)',
  zIndex: 999,
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 0'
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '15px 25px',
  cursor: 'pointer',
  borderBottom: '1px solid rgba(212, 163, 115, 0.15)',
  transition: 'background 0.2s'
};

const menuItemTitleStyle = {
  color: '#fefae0',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'block'
};

const menuItemDescStyle = {
  color: '#a5a5a5',
  fontSize: '11px',
  margin: '2px 0 0 0'
};

export default Navbar;