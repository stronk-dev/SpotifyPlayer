// Placeholder image for when the player is stopped or disconnected.
import React from "react";
import "./PlaceHolderAlbum.css";

// TODO: we could do something fun here like a bouncing DVD logo.
const PlaceholderAlbum = () => {
  return (
    <div className="spotify-player-placeholder-album">
      <div className="spotify-player-placeholder-icon">
        <span className="spotify-player-placeholder-text">Stopped</span>
      </div>
    </div>
  );
};

export default PlaceholderAlbum;
