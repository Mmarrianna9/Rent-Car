import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeroCarousel = ({ onExplore }) => {
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1920&q=80",
      title: "OVUNQUE TU VADA",
      desc: "SUV e 4x4 pronti per ogni tipo di strada, dallo sterrato ai sentieri più impervi.",
      btn: "ESPLORA FUORISTRADA"
    },
    {
      img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1920&q=80",
      title: "LIBERTÀ IN CITTÀ",
      desc: "City car scattanti ed economiche per muoverti agilmente in ogni vicolo.",
      btn: "VEDI CITY CAR"
    },
    {
      img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1920&q=80",
      title: "COMFORT PER TUTTI",
      desc: "Berline e familiari spaziose per i tuoi viaggi in totale relax, a prezzi imbattibili.",
      btn: "NOLEGGIA ORA"
    }
  ];

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 50px)', overflow: 'hidden', backgroundColor: '#1a1a1b' }}>
      <Carousel 
        autoPlay 
        infiniteLoop 
        showStatus={false} 
        showThumbs={false} 
        interval={7000} // Durata estesa 
        transitionTime={1200}
        stopOnHover={false}
      >
        {slides.map((slide, index) => (
          <div key={index} style={{ position: 'relative', height: 'calc(100vh - 50px)' }}>
            <img src={slide.img} style={{ height: '100%', width: '100%', objectFit: 'cover' }} alt={slide.title} />
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', 
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px' 
            }}>
              <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                <h2 style={{ color: 'white', fontSize: '50px', fontWeight: '900', margin: 0, fontStyle: 'italic', textTransform: 'uppercase' }}>
                  {slide.title.split(' ')[0]} <span style={{ color: '#d4a373' }}>{slide.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p style={{ color: '#fefae0', fontSize: '20px', marginTop: '15px' }}>{slide.desc}</p>
                <button 
                  onClick={onExplore}
                  style={{ 
                    marginTop: '30px', padding: '12px 35px', backgroundColor: '#d4a373', 
                    color: '#1a1a1b', border: 'none', borderRadius: '50px', 
                    fontWeight: 'bold', cursor: 'pointer' 
                  }}
                >
                  {slide.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;