import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import CountdownTimer from "./CountdownTimer";

export default function ContentBlock({ item, onExplore, onOpenDatabase }) {
  const containerRef = useRef(null);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

  useEffect(() => {
    setSelectedMovieIndex(0);
  }, [item]);

  useEffect(() => {
    // When the item changes, run entrance animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(
        ".animate-subtitle",
        { opacity: 0, x: -30 },
        { opacity: 0.8, x: 0, duration: 0.6 }
      )
      .fromTo(
        ".animate-title",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        ".animate-desc",
        { opacity: 0, y: 20 },
        { opacity: 0.7, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ".animate-countdown",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ".animate-btns",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15 },
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [item]);

  return (
    <div
      ref={containerRef}
      className="content-block"
    >
      {/* Subtitle / Alter Ego */}
      <span className="animate-subtitle content-subtitle">
        {item.subtitle}
      </span>

      {/* Main Slide Title */}
      <h1 className="animate-title content-title">
        {item.title}
      </h1>

      {/* Description paragraph */}
      <p className="animate-desc content-desc">
        {item.description}
      </p>

      {/* Countdown Widget for Upcoming Movies */}
      {item.category === "upcoming" && item.items && item.items.length > 0 && (
        <div className="upcoming-countdown-container animate-countdown">
          <div className="movie-tabs">
            {item.items.map((movie, idx) => (
              <button
                key={idx}
                className={`movie-tab-btn ${selectedMovieIndex === idx ? "active" : ""}`}
                onClick={() => setSelectedMovieIndex(idx)}
              >
                {movie.name.split(":")[0]}
              </button>
            ))}
          </div>
          <div className="countdown-display-card">
            <div className="countdown-card-header">
              <span className="launch-text">TARGET LAUNCH:</span>
              <h4 className="countdown-movie-name">{item.items[selectedMovieIndex].name}</h4>
              <span className="countdown-movie-date">{item.items[selectedMovieIndex].year}</span>
            </div>
            <CountdownTimer targetDate={item.items[selectedMovieIndex].year} variant="large" />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="content-buttons animate-btns">
        <button
          onClick={onExplore}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <span>Explore Database</span>
          <svg 
            viewBox="0 0 24 24" 
            width="16" 
            height="16" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="explore-arrow-icon"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
