import React from "react";
import {
  GiCompactDisc,
  GiSpeaker,
  GiSmartphone,
  GiLaptop,
  GiGamepad,
  GiTv,
  GiRadioTower,
} from "react-icons/gi";
import { FaTabletAlt, FaCar, FaMusic, FaQuestionCircle, FaChromecast, FaExclamationCircle } from "react-icons/fa";
import { MdWatch } from "react-icons/md";

const deviceIcons = {
  computer: GiLaptop,
  tablet: FaTabletAlt,
  smartphone: GiSmartphone,
  speaker: GiSpeaker,
  tv: GiTv,
  avr: GiRadioTower,
  stb: FaMusic,
  audio_dongle: GiCompactDisc,
  game_console: GiGamepad,
  cast_video: FaChromecast,
  cast_audio: GiCompactDisc,
  automobile: FaCar,
  smartwatch: MdWatch,
  chromebook: GiLaptop,
  car_thing: FaCar,
  observer: FaQuestionCircle,
  home_thing: GiRadioTower,
};

const DeviceTitle = ({ isConnected, deviceName, isPlaying, deviceType }) => {
  const name = deviceType?.toLowerCase();
  const Icon = deviceIcons[name] || FaQuestionCircle;
  console.log("Connected to " + deviceName + " of type " + deviceType)

  return (
    <div className="spotify-player-device-title">
      {isConnected ? (
        <Icon className={isPlaying ? "spotify-player-connected-icon rotating" : "spotify-player-connected-icon"} />
      ) : (
        <FaExclamationCircle className="spotify-player-connected-icon disconnected" />
      )}
      <h4>{deviceName}</h4>
    </div>
  );
};

export default DeviceTitle;
