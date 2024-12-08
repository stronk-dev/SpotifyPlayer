import React from "react";
import './SeekControls.css';

// Utility function to format time in mm:ss
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const SeekControls = ({
  duration,
  currentPosition,
  handleSeek,
  isStopped
}) => (
  <div className="spotify-player-seek-container">
    <span>{formatTime(currentPosition)}</span>
    <input
      type="range"
      min="0"
      max="100"
      value={(currentPosition / duration) * 100}
      onChange={handleSeek}
      className="spotify-player-seek-bar"
      disabled={isStopped}
    />
    <span>{formatTime(duration)}</span>
  </div>
);

export default SeekControls;
