import React from "react";
import { GiCompactDisc } from "react-icons/gi";
import { FaExclamationCircle } from "react-icons/fa";

const DeviceTitle = ({ isConnected, deviceName, isPlaying }) => (
  <div className="spotify-player-device-title">
    {isConnected ? (
      <GiCompactDisc className={isPlaying ? "spotify-player-connected-icon rotating" : "spotify-player-connected-icon"} />
    ) : (
      <FaExclamationCircle className={isPlaying ? "spotify-player-connected-icon disconnected" : "spotify-player-connected-icon disconnected"} />
    )}
    <h4>{deviceName}</h4>
  </div>
);

export default DeviceTitle;
