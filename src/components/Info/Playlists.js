// Renders a text box with info - like a table with playback info or an error message.
import React, { useEffect, useRef, useState } from "react";
import "./Playlists.css";

// TODO: add more comments, IE for props
const Playlists = ({ playlists, onSelect, onPlay }) => {
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [arrowVisible, setArrowVisible] = useState(true);
  const [arrowOffset, setArrowOffset] = useState(0);
  const wrapperRef = useRef(null);

  const handleSelect = (playlist) => {
    setActivePlaylist(playlist.id);
    onSelect(playlist);
  };

  const handleScroll = () => {
    if (!wrapperRef.current) return;
    const { scrollLeft } = wrapperRef.current;
    // Hide arrow if scrolled near the end
    setArrowVisible(scrollLeft < 20);
    setArrowOffset(scrollLeft);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize visibility on mount

    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={"spotify-player-playlists-wrapper"}
    >
      <div
        className={`spotify-player-arrow  ${arrowVisible ? "arrow-visible" : "arrow-hidden"}`}
        style={{ transform: `translate(${arrowOffset}px, -50%)` }}
      >
        →
      </div>
      <div className="spotify-player-playlist-container">
        {playlists?.map((playlist) => (
          <div
            key={playlist.id}
            className={`spotify-player-playlist-item ${activePlaylist === playlist.id ? "active" : ""
              }`}
            onClick={() => handleSelect(playlist)}
          >
            <img
              src={playlist.images[0]?.url}
              alt={`${playlist.name} cover`}
              className="spotify-player-playlist-image"
            />
            <div className="spotify-player-playlist-info">
              <h4>{playlist.name}</h4>
              <p>{playlist.owner.display_name}</p>
            </div>
            {activePlaylist === playlist.id && (
              <button
                className="spotify-player-play-button"
                onClick={() => onPlay(playlist.uri)}
              >
                ▶
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
