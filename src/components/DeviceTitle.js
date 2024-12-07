import React from "react";
import { GiCompactDisc } from "react-icons/gi";
import { FaExclamationCircle } from "react-icons/fa";

const DeviceTitle = ({ isConnected, deviceName }) => (
  <div className="device-title">
    {isConnected ? (
      <GiCompactDisc className="connected-icon" />
    ) : (
      <FaExclamationCircle className="connected-icon disconnected" />
    )}
    <h4>{deviceName}</h4>
  </div>
);

export default DeviceTitle;
