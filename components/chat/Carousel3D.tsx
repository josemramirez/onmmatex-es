// src/components/Carousel3D.jsx
import React, { useState } from "react";
import "./Carousel3D.css";

const PDFportadas = [
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada_v1.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada2.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada3.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada21.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada31.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada41.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada51.pdf",
];

const Carousel3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    console.log("Prev clicked, activeIndex:", activeIndex); // Para depuración
    setActiveIndex((prev) => (prev === 0 ? PDFportadas.length - 1 : prev - 1));
  };

  const handleNext = () => {
    console.log("Next clicked, activeIndex:", activeIndex); // Para depuración
    setActiveIndex((prev) => (prev === PDFportadas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {PDFportadas.map((pdf, index) => {
          let offset = index - activeIndex;
          if (offset < -3) offset += PDFportadas.length;
          if (offset > 3) offset -= PDFportadas.length;

          const isActive = offset === 0;
          const className = `carousel-item ${
            isActive ? "active" : offset > 0 ? "right" : "left"
          } offset-${Math.abs(offset)}`;

          return (
            <div key={index} className={className}>
               <object
                data={pdf}
                type="application/pdf"
                width="100%"
                height="100%"
              >
                <p>
                  No se puede mostrar el PDF.{" "}
                  <a href={pdf} target="_blank" rel="noopener noreferrer">
                    Abrir PDF
                  </a>
                </p>
              </object>
            </div>
          );
        })}
      </div>
      <button className="carousel-btn prev" onClick={handlePrev}>
        ←
      </button>
      <button className="carousel-btn next" onClick={handleNext}>
        →
      </button>
    </div>
  );
};

export default Carousel3D;