// Displays a header with the client device name and an icon depending on device type
import React from "react";
import {
  GiCompactDisc,
  GiSpeaker,
  GiSmartphone,
  GiLaptop,
  GiGamepad,
  GiTv,
  GiRadioTower,
  GiNightSleep,
} from "react-icons/gi";
import { FaTabletAlt, FaCar, FaMusic, FaQuestionCircle, FaChromecast, FaExclamationCircle } from "react-icons/fa";
import { MdWatch } from "react-icons/md";
import './Header.css';

// Mapping from device type to which Icon we should render
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

// TODO: expand with settings button
// TODO: expand with playlists/albums/explore button once we can get albums/playlists from the API
// TODO: add more comments, IE for props
const Header = ({ isConnected, deviceName, isPlaying, deviceType, isStopped }) => {
  const Icon = isStopped ? GiNightSleep : deviceIcons[deviceType?.toLowerCase()] || FaQuestionCircle;
  return (
    <div className="spotify-player-device-title">
      {isConnected ? (
        <Icon className={isPlaying ? "spotify-player-connected-icon spotify-player-rotating" : "spotify-player-connected-icon"} />
      ) : (
        <FaExclamationCircle className="spotify-player-connected-icon spotify-player-disconnected" />
      )}
      <h4>{isConnected ? deviceName : "Disconnected"}</h4>
    </div>
  );
};

export default Header;
