import React from 'react';

const Footer = () => (
  <footer style={{background: '#222', color: 'white', padding: '40px', marginTop: '50px', textAlign: 'center'}}>
    <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '20px'}}>
      <div>
        <h4>Contatti</h4>
        <p>Email: info@rentcarai.com</p>
      </div>
      <div>
        <h4>Social</h4>
        <p>Instagram | Facebook | LinkedIn</p>
      </div>
    </div>
    <hr style={{borderColor: '#444'}} />
    <p>© 2026 RentCar AI - Progetto WebApp</p>
  </footer>
);

export default Footer;