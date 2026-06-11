import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MetadataPanel({ metadata }) {
  const panelRef = useRef(null);

  useEffect(() => {
    // Animate entries when metadata updates
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".metadata-item",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }, panelRef);

    return () => ctx.revert();
  }, [metadata]);

  return (
    <div
      ref={panelRef}
      className="metadata-panel"
    >
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key} className="metadata-item">
          {/* Metadata Category Label */}
          <span className="metadata-label">
            {key}
          </span>
          {/* Metadata Value */}
          <span className="metadata-value">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
