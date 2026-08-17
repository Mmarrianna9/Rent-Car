import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeroCarousel = ({ onExplore }) => {
  // Stato per mantenere sincronizzati i due caroselli
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

  // Funzione di callback per gestire il cambio di slide
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // Stili in linea per il layout principale (sfondo scuro, layout a colonna)
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: 'calc(100vh - 60px)', // Altezza meno l'altezza della navbar
    backgroundColor: '#1a1a1b', // Sfondo scuro per evitare il bianco
    overflow: 'hidden'
  };

  // Stile per il contenitore delle immagini (sopra)
  const imgCarouselStyle = {
    width: '100%',
    height: '50%', // Esattamente metà schermo
  };

  // Stile per il contenitore dei testi (sotto)
  const textCarouselStyle = {
    width: '100%',
    height: '50%', // Esattamente metà schermo
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1b', // Sfondo scuro sotto
    padding: '20px',
  };

  // Stile per il blocco di testo interno
  const textContentWrapper = {
    textAlign: 'center',
    maxWidth: '800px',
    color: '#fefae0'
  };

  return (
    <div style={mainContainerStyle}>
      {/* --- CAROSELLO IMMAGINI (SOPRA) --- */}
      <div style={imgCarouselStyle}>
        <Carousel
          autoPlay
          infiniteLoop
          showStatus={false}
          showThumbs={false}
          showIndicators={false} // Niente pallini sopra
          interval={7000}
          transitionTime={1200}
          stopOnHover={false}
          selectedItem={currentSlide} // Sincronizzazione: elemento selezionato
          onChange={handleSlideChange} // Sincronizzazione: aggiorna stato al cambio
        >
          {slides.map((slide, index) => (
            <div key={`img-${index}`} style={{ height: '50vh', width: '100%' }}>
              <img
                src={slide.img}
                alt={slide.title}
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* --- CAROSELLO TESTI (SOTTO) --- */}
      <div style={textCarouselStyle}>
        <Carousel
          showStatus={false}
          showThumbs={false}
          showIndicators={true} // Pallini sotto per il testo
          showArrows={false} // Niente frecce sotto
          infiniteLoop
          selectedItem={currentSlide} // Sincronizzazione: elemento selezionato
          onChange={handleSlideChange} // Sincronizzazione: aggiorna stato al cambio
          // Disabilitiamo autoplay e swipe sul testo per evitare disallineamento, 
          // si muoverà solo se l'utente clicca i pallini o le frecce sopra
          autoPlay={false} 
          swipeable={false}
        >
          {slides.map((slide, index) => (
            <div key={`text-${index}`} style={textContentWrapper}>
              <h2 style={{
                color: 'white',
                fontSize: '36px',
                fontWeight: '900',
                margin: 0,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                lineHeight: '1.1'
              }}>
                {slide.title.split(' ')[0]} <span style={{ color: '#d4a373' }}>{slide.title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p style={{ fontSize: '16px', marginTop: '15px', color: '#e0e0e0' }}>
                {slide.desc}
              </p>
              <button
                onClick={onExplore}
                style={{
                  marginTop: '25px',
                  padding: '10px 30px',
                  backgroundColor: '#d4a373',
                  color: '#1a1a1b',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e67e22'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#d4a373'}
              >
                {slide.btn}
              </button>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default HeroCarousel;