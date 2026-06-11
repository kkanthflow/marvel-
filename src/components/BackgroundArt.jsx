import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BackgroundArt({ activeImage }) {
  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);
  const activeImageRef = useRef(activeImage);

  useEffect(() => {
    // If the image changed, execute cross-fade animation
    if (activeImage !== activeImageRef.current) {
      const currentPrimary = primaryRef.current;
      const currentSecondary = secondaryRef.current;

      // Set the secondary layer image to the new image
      currentSecondary.style.backgroundImage = `url(${activeImage})`;
      currentSecondary.style.opacity = 0;

      // GSAP cross-fade + spherical globe rotation effect
      gsap.timeline()
        .to(currentPrimary, { 
          opacity: 0, 
          rotation: -6, 
          scale: 0.95, 
          duration: 1.2, 
          ease: "power2.inOut" 
        })
        .fromTo(currentSecondary, 
          { opacity: 0, rotation: 6, scale: 1.15 }, 
          { opacity: 1, rotation: 0, scale: 1.08, duration: 1.2, ease: "power2.inOut" }, 
          "<"
        )
        .call(() => {
          // Swap background images so primary always has active
          currentPrimary.style.backgroundImage = `url(${activeImage})`;
          currentPrimary.style.opacity = 1;
          gsap.set(currentPrimary, { rotation: 0, scale: 1.08 });
          currentSecondary.style.opacity = 0;
          activeImageRef.current = activeImage;
        });
    }
  }, [activeImage]);

  return (
    <div className="bg-art-container">
      {/* Primary Art Layer */}
      <div
        ref={primaryRef}
        className="bg-art-layer"
        style={{
          backgroundImage: `url(${activeImage})`,
          filter: "grayscale(15%) brightness(40%) contrast(110%)",
        }}
      />
      
      {/* Secondary Art Layer for Crossfade */}
      <div
        ref={secondaryRef}
        className="bg-art-layer"
        style={{
          filter: "grayscale(15%) brightness(40%) contrast(110%)",
          opacity: 0,
        }}
      />

      {/* Deep Red to Dark Vignette Overlays matching reference image style */}
      <div className="bg-gradient-left" />
      <div className="bg-radial-overlay" />
    </div>
  );
}
