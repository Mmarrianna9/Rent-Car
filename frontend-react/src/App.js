import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import VehicleDetail from './components/VehicleDetail';
import Auth from './components/Auth';
import './styles/app.css';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [user, setUser] = useState(null); 
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/vehicles')
      .then(res => {
        setVehicles(res.data);
      })
      .catch(err => console.error("Errore database:", err));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const resetToHome = () => {
    setShowResults(false);
    setSelectedVehicle(null);
    setIsAuthOpen(false);
  };

  const handleSearchClick = () => {
    setShowResults(true);
    setSelectedVehicle(null);
    setIsAuthOpen(false);
  };

  const getImageUrl = (imgName) => {
    if (!imgName) return 'https://via.placeholder.com/400x250?text=Immagine+Non+Disponibile';
    if (imgName.startsWith('http')) return imgName;
    return `/images/${imgName}`;
  };

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Navbar 
        onHomeClick={resetToHome} 
        onSearchClick={handleSearchClick} 
        onAuthClick={() => setIsAuthOpen(true)} 
      />

      {isAuthOpen && !user ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {user && (
            <div style={{ padding: '20px', textAlign: 'right', maxWidth: '1200px', margin: '0 auto' }}>
              <span style={{ fontWeight: 'bold' }}>Elite Member: {user.fullname}</span>
              <button onClick={() => setUser(null)} style={{ marginLeft: '15px', cursor: 'pointer' }}>Logout</button>
            </div>
          )}

          {selectedVehicle ? (
            <VehicleDetail vehicle={selectedVehicle} onBack={() => setSelectedVehicle(null)} getImageUrl={getImageUrl} />
          ) : !showResults ? (
            <HeroCarousel onExplore={handleSearchClick} />
          ) : (
            <div style={{ padding: '40px' }}>
              <h2 style={{ textAlign: 'center' }}>La Nostra Flotta ELITE</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {vehicles.map((v) => (
                  <div key={v.id} onClick={() => setSelectedVehicle(v)} className="vehicle-card" style={{ cursor: 'pointer', background: 'white' }}>
                    <img src={getImageUrl(v.photoExternal)} alt={v.model} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div style={{ padding: '20px' }}>
                      <h3>{v.brand} {v.model}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;