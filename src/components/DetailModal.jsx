import React, { useState, useEffect, useRef } from "react";
import { X, Search, Monitor, Tv, Smartphone, Gamepad2 } from "lucide-react";
import gsap from "gsap";
import { fetchMediaDetails, fetchMediaSummary, fetchMediaNews } from "../services/api";
import CountdownTimer from "./CountdownTimer";


export default function DetailModal({ isOpen, onClose, item }) {
  const [search, setSearch] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [news, setNews] = useState("");
  const [loadingNews, setLoadingNews] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Setup list based on current active item
  useEffect(() => {
    if (!isOpen) {
      setSelectedMedia(null);
      setSummary("");
      setNews("");
      return;
    }

    // Load initial media directly from the active item's items array
    const initialList = item.items || [];

    setLoading(true);
    // Resolve dynamic posters/metadata for each list item
    const resolveList = async () => {
      const resolved = await Promise.all(
        initialList.map(async (media) => {
          const title = media.name || media.title;
          const type = media.type || "movie";
          const details = await fetchMediaDetails(title, type);
          return {
            ...media,
            title,
            type,
            ...details,
            // Keep overrides if present
            platforms: media.platforms || details.platforms,
            year: media.year || details.year
          };
        })
      );
      setMediaList(resolved);
      setLoading(false);
    };

    resolveList();
  }, [isOpen, item]);

  // Modal open/close animations using GSAP
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.timeline()
        .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo(modalRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "power3.out" }, "-=0.2");
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.timeline()
      .to(modalRef.current, { xPercent: 100, duration: 0.4, ease: "power3.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.3 }, "-=0.2")
      .call(onClose);
  };

  const getPlatformIcon = (type) => {
    switch (type) {
      case "game": return <Gamepad2 size={14} className="text-blue-400" />;
      case "show": return <Tv size={14} className="text-green-400" />;
      default: return <Monitor size={14} className="text-red-400" />;
    }
  };

  const handleMediaClick = async (media) => {
    setSelectedMedia(media);
    setLoadingSummary(true);
    setLoadingNews(true);
    setSummary("");
    setNews("");
    try {
      const extractPromise = fetchMediaSummary(media.title, media.type);
      const newsPromise = fetchMediaNews(media.title);
      
      const [extract, newsData] = await Promise.all([extractPromise, newsPromise]);
      setSummary(extract);
      setNews(newsData);
    } catch (err) {
      setSummary("Could not load description details.");
    } finally {
      setLoadingSummary(false);
      setLoadingNews(false);
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.genre && m.genre.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-overlay"
    >
      <div
        ref={modalRef}
        className="modal-box"
      >
        {/* Header bar */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{item.title} Media Database</h2>
            <p className="modal-subtitle">{item.subtitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Statistics */}
        <div className="modal-search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search movies, games, shows, or genres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-stats">
            <span>Total Matches: {filteredMedia.length}</span>
            <span>Category: {item.category}</span>
          </div>
        </div>

        {/* Media Grid & Details Container (Split View) */}
        <div className={`modal-body-container ${selectedMedia ? "split-view" : ""}`}>
          <div className="media-grid-container custom-scrollbar">
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading database assets...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="spinner-container" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                <p className="font-serif" style={{ fontSize: "1.2rem", marginBottom: "8px" }}>No media assets found</p>
                <p style={{ fontSize: "0.8rem", textAlign: "center", maxWidth: "250px" }}>Try looking up other keywords or verify spelling details.</p>
              </div>
            ) : (
              <div className="media-grid">
                {filteredMedia.map((media, idx) => (
                  <div
                    key={idx}
                    className={`media-card ${selectedMedia?.title === media.title ? "selected" : ""}`}
                    onClick={() => handleMediaClick(media)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Media Poster Art */}
                    <div className="poster-wrapper">
                      <img
                        src={media.poster}
                        alt={media.title}
                        className="poster-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=400";
                        }}
                      />
                      {media.rating && (
                        <div className="rating-tag">
                          {media.rating}
                        </div>
                      )}
                    </div>

                    {/* Media Technical Info */}
                    <div className="info-wrapper">
                      <div>
                        <div className="media-type-header">
                          {getPlatformIcon(media.type)}
                          <span className="media-type-label">
                            {media.type}
                          </span>
                        </div>
                        <h4 className="media-card-title">
                          {media.title}
                        </h4>
                        {media.genre && (
                          <p className="media-genre">{media.genre}</p>
                        )}
                      </div>

                      {item.category === "upcoming" && (
                        <div className="card-countdown-wrapper">
                          <CountdownTimer targetDate={media.year} variant="compact" />
                        </div>
                      )}

                      <div className="media-card-footer">
                        <span className="media-year">{media.year}</span>
                        <div className="platform-tags-container">
                          {media.platforms && media.platforms.slice(0, 2).map((plat, pIdx) => (
                            <span
                              key={pIdx}
                              className="platform-tag"
                            >
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Media Detail Panel */}
          {selectedMedia && (
            <div className="side-detail-panel custom-scrollbar">
              <button className="side-close-btn" onClick={() => setSelectedMedia(null)}>
                <X size={18} />
              </button>

              <div className="side-detail-content">
                <div className="side-poster-wrapper">
                  <img
                    src={selectedMedia.poster}
                    alt={selectedMedia.title}
                    className="side-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  {selectedMedia.rating && (
                    <div className="side-rating-badge">
                      ★ {selectedMedia.rating}
                    </div>
                  )}
                </div>

                <div className="side-detail-info">
                  <span className="side-type-label">{selectedMedia.type}</span>
                  <h3 className="side-title font-serif">{selectedMedia.title}</h3>

                  <div className="side-meta-grid">
                    <div className="side-meta-item">
                      <span className="side-meta-label">Released</span>
                      <span className="side-meta-value">{selectedMedia.year}</span>
                    </div>
                    {selectedMedia.developer && (
                      <div className="side-meta-item">
                        <span className="side-meta-label">Developer</span>
                        <span className="side-meta-value">{selectedMedia.developer}</span>
                      </div>
                    )}
                    {selectedMedia.genre && (
                      <div className="side-meta-item">
                        <span className="side-meta-label">Genre</span>
                        <span className="side-meta-value">{selectedMedia.genre}</span>
                      </div>
                    )}
                  </div>

                  {selectedMedia.platforms && selectedMedia.platforms.length > 0 && (
                    <div className="side-platforms-section">
                      <span className="side-meta-label">Available Platforms</span>
                      <div className="side-platforms-list">
                        {selectedMedia.platforms.map((p, idx) => (
                          <span key={idx} className="side-platform-pill">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.category === "upcoming" && (
                    <div className="side-countdown-section">
                      <span className="side-meta-label">Time Remaining Until Release</span>
                      <CountdownTimer targetDate={selectedMedia.year} variant="large" />
                    </div>
                  )}

                  <div className="side-overview-section">
                    <span className="side-meta-label">Plot Overview</span>
                    {loadingSummary ? (
                      <div className="summary-skeleton">
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                      </div>
                    ) : (
                      <p className="side-summary-text">{summary}</p>
                    )}
                  </div>

                  {loadingNews ? (
                    <div className="side-overview-section" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "1.2rem", paddingTop: "1.2rem" }}>
                      <span className="side-meta-label">Checking for Official News...</span>
                      <div className="summary-skeleton">
                        <div className="skeleton-line"></div>
                      </div>
                    </div>
                  ) : news ? (
                    <div className="side-overview-section" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "1.2rem", paddingTop: "1.2rem" }}>
                      <span className="side-meta-label">Official News & Developments</span>
                      <p className="side-summary-text" style={{ color: "rgba(255, 255, 255, 0.85)" }}>{news}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
