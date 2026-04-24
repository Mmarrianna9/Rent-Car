import React from 'react';
import { Home, Search } from 'lucide-react';

const Navbar = ({ onHomeClick, onAuthClick, onSearchClick }) => {
  return (
    <nav style={navStyle}>
      {/* Logo in public/images/logo/logo.png */}
      <div style={{ cursor: 'pointer' }} onClick={onHomeClick}>
        <img src="/images/logo/logo.png" alt="RentCar" style={{ height: '40px' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <Home size={18} onClick={onHomeClick} style={{ cursor: 'pointer' }} />
        <button onClick={onAuthClick} style={btnStyle}>ACCEDI / REGISTRATI</button>
        <Search size={18} onClick={onSearchClick} style={{ cursor: 'pointer' }} />
      </div>
    </nav>
  );
};

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

export default Navbar;