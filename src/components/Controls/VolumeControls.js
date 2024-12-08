import React from "react";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import './VolumeControls.css';

const VolumeControls = ({
  handleVolumeChange,
  volume,
  maxVolume,
  isStopped
}) => (
  <div className="spotify-player-volume-control">
    <span>
      <FaVolumeDown />
    </span>
    <input
      type="range"
      min="0"
      max="100"
      value={(volume / maxVolume) * 100}
      onChange={handleVolumeChange}
      className="spotify-player-volume-slider"
      disabled={isStopped}
    />
    <span>
      <FaVolumeUp />
    </span>
  </div>
);

export default VolumeControls;
