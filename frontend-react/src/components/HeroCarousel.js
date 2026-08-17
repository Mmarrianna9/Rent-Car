import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeroCarousel = ({ onExplore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#1a1a1b',
      overflow: 'hidden'
    }}>
      {/* --- CAROSELLO IMMAGINI (SOPRA) --- */}
      <div style={{ width: '100%', height: '35vh', backgroundColor: '#111' }}>
        <Carousel
          autoPlay
          infiniteLoop
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          interval={7000}
          transitionTime={1200}
          stopOnHover={false}
          selectedItem={currentSlide}
          onChange={handleSlideChange}
        >
          {slides.map((slide, index) => (
            <div key={`img-${index}`} style={{ height: '35vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={slide.img}
                alt={slide.title}
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  objectFit: 'contain' /* <-- IMPORTANTE: Mostra l'auto intera senza tagliarla a metà */
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* --- CAROSELLO TESTI (SOTTO) --- */}
      <div style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1b',
        padding: '10px 20px 30px 20px',
      }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <Carousel
            showStatus={false}
            showThumbs={false}
            showIndicators={true}
            showArrows={false}
            infiniteLoop
            selectedItem={currentSlide}
            onChange={handleSlideChange}
            autoPlay={false}
            swipeable={false}
          >
            {slides.map((slide, index) => (
              <div key={`text-${index}`} style={{ textAlign: 'center', padding: '0 10px' }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '22px', /* Ridimensionato per essere perfetto su mobile */
                  fontWeight: '900',
                  margin: 0,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}>
                  {slide.title.split(' ')[0]} <span style={{ color: '#d4a373' }}>{slide.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p style={{ 
                  fontSize: '13px', /* Più compatto e leggibile */
                  marginTop: '8px', 
                  color: '#e0e0e0',
                  lineHeight: '1.4',
                  marginBottom: '15px'
                }}>
                  {slide.desc}
                </p>
                <button
                  onClick={onExplore}
                  style={{
                    padding: '8px 22px',
                    backgroundColor: '#d4a373',
                    color: '#1a1a1b',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  {slide.btn}
                </button>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;