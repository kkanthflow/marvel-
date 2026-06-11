import React from "react";

export default function Pagination({ total, currentIndex, setCurrentIndex }) {
  return (
    <div className="pagination-container">
      {/* Vertical line indicator */}
      <div className="pagination-line">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`pagination-dot ${currentIndex === idx ? "active" : ""}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
