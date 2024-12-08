import React from "react";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import './VolumeControls.css';

const VolumeControls = ({
  handleVolumeChange,
  volume,
  maxVolume,
  isStopped,
  isConnected
}) => (
  <div className="spotify-player-volume-control">
    <span>
      <FaVolumeDown height={32} width={32}/>
    </span>
    <input
      type="range"
      min="0"
      max="100"
      value={(volume / maxVolume) * 100}
      onChange={handleVolumeChange}
      className="spotify-player-volume-slider"
      disabled={isStopped || !isConnected}
    />
    <span>
      <FaVolumeUp />
    </span>
  </div>
);

export default VolumeControls;
