import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Pagination from "./components/Pagination";
import ContentBlock from "./components/ContentBlock";
import MetadataPanel from "./components/MetadataPanel";
import BackgroundArt from "./components/BackgroundArt";
import DetailModal from "./components/DetailModal";
import { marvelData } from "./data/marvelData";
import { Analytics } from "@vercel/analytics/react";

const categories = [
  { id: "movies", label: "Movies" },
  { id: "games", label: "Games" },
  { id: "animated", label: "Animated Series" },
  { id: "liveaction", label: "Live Action" },
  { id: "upcoming", label: "Upcoming Movies" },
  { id: "comics", label: "Comics" }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("movies");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);

  // Get active slide dataset
  const activeSet = marvelData[activeCategory] || [];
  const activeItem = activeSet[currentIndex] || activeSet[0] || {};

  // Reset slide index on category switch
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Handle slide changing with wheel/scroll with debouncing
  useEffect(() => {
    const handleWheel = (e) => {
      if (isModalOpen) return; // Ignore when modal is open
      
      e.preventDefault();

      if (scrollTimeoutRef.current) return;

      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 800); // 800ms debounce window matching transition times

      if (e.deltaY > 15) {
        // Scroll down: Next slide
        setCurrentIndex((prev) => (prev + 1) % activeSet.length);
      } else if (e.deltaY < -15) {
        // Scroll up: Previous slide
        setCurrentIndex((prev) => (prev - 1 + activeSet.length) % activeSet.length);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeSet, isModalOpen]);

  // Keyboard Navigation (Arrow Keys) for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % activeSet.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + activeSet.length) % activeSet.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSet, isModalOpen]);

  return (
    <div className="app-container">
      <Analytics />
      {/* Background Graphic Crossfade */}
      <BackgroundArt activeImage={activeItem.bgImage} />

      {/* Main Header / Navigation */}
      <Navbar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Left Vertical Pagination Dot indicators */}
      {activeSet.length > 1 && (
        <Pagination
          total={activeSet.length}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}

      {/* Center Left Main Description & Buttons */}
      {activeItem.title && (
        <ContentBlock
          item={activeItem}
          onExplore={() => setIsModalOpen(true)}
          onOpenDatabase={() => setIsModalOpen(true)}
        />
      )}

      {/* Right-aligned Vertical Metadata list */}
      {activeItem.metadata && (
        <MetadataPanel metadata={activeItem.metadata} />
      )}

      {/* Interactive Detail database modal */}
      {activeItem.title && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={activeItem}
        />
      )}
    </div>
  );
}
