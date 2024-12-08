import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaVolumeDown, FaVolumeUp } from "react-icons/fa";

// Utility function to format time in mm:ss
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const ControlsContainer = ({
  isPlaying,
  handlePlayPause,
  handleNextTrack,
  handlePreviousTrack,
  shuffleContext,
  toggleShuffle,
  duration,
  currentPosition,
  handleSeek,
  handleVolumeChange,
  volume,
  maxVolume,
  isStopped
}) => (
  <div className="spotify-player-controls-container">
    <div className="spotify-player-playback-controls">
      <button onClick={handlePreviousTrack} className="spotify-player-control-button" disabled={isStopped}>
        <FaStepBackward />
      </button>
      <button onClick={handlePlayPause} className="spotify-player-control-button" disabled={isStopped}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={handleNextTrack} className="spotify-player-control-button" disabled={isStopped}>
        <FaStepForward />
      </button>

      {isStopped ? (
        <div className={`spotify-player-toggle-container disabled`}>
          <div className="spotify-player-toggle-track-text">N/A</div>
          <div className="spotify-player-toggle-thumb disabled">
            <FaRandom className="spotify-player-toggle-thumb-icon" />
          </div>
        </div>
      ) : shuffleContext ? (
        <div className={`spotify-player-toggle-container on`} onClick={toggleShuffle}>
          <div className="spotify-player-toggle-track-text">ON</div>
          <div className="spotify-player-toggle-thumb">
            <FaRandom className="spotify-player-toggle-thumb-icon" />
          </div>
        </div>
      ) : (
        <div className={`spotify-player-toggle-container off`} onClick={toggleShuffle}>
          <div className="spotify-player-toggle-thumb">
            <FaRandom className="spotify-player-toggle-thumb-icon" />
          </div>
          <div className="spotify-player-toggle-track-text">OFF</div>
        </div>
      )}
    </div>

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
  </div>
);

export default ControlsContainer;
