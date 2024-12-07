import React from "react";
import { GiCompactDisc } from "react-icons/gi";
import { FaExclamationCircle } from "react-icons/fa";

const DeviceTitle = ({ isConnected, deviceName }) => (
  <div className="spotify-player-device-title">
    {isConnected ? (
      <GiCompactDisc className="spotify-player-connected-icon" />
    ) : (
      <FaExclamationCircle className="connected-icon disconnected" />
    )}
    <h4>{deviceName}</h4>
  </div>
);

export default DeviceTitle;
