import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaVolumeDown, FaVolumeUp } from "react-icons/fa";

const ControlsContainer = ({
  isPlaying,
  handlePlayPause,
  handleNextTrack,
  handlePreviousTrack,
  shuffleContext,
  toggleShuffle,
  track,
  currentPosition,
  handleSeek,
  handleVolumeChange,
  volume,
  maxVolume
}) => (
  <div className="controls-container">
    <div className="playback-controls">
      <button onClick={handlePreviousTrack} className="control-button">
        <FaStepBackward />
      </button>
      <button onClick={handlePlayPause} className="control-button">
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={handleNextTrack} className="control-button">
        <FaStepForward />
      </button>

      {shuffleContext ? (
        <div className={`toggle-container on`} onClick={toggleShuffle}>
          <div className="toggle-track-text">ON</div>
          <div className="toggle-thumb">
            <FaRandom className="toggle-thumb-icon" />
          </div>
        </div>
      ) : (
        <div className={`toggle-container off`} onClick={toggleShuffle}>
          <div className="toggle-thumb">
            <FaRandom className="toggle-thumb-icon" />
          </div>
          <div className="toggle-track-text">OFF</div>
        </div>
      )}
    </div>
    {track && (
      <div className="seek-container">
        <span>{Math.floor(currentPosition / 1000)}s</span>
        <input
          type="range"
          min="0"
          max="100"
          value={(currentPosition / track.duration) * 100}
          onChange={handleSeek}
          className="seek-bar"
        />
        <span>{Math.floor(track.duration / 1000)}s</span>
      </div>
    )}
    <div className="volume-control">
      <span>
        <FaVolumeDown />
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={(volume / maxVolume) * 100}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
      <span>
        <FaVolumeUp />
      </span>
    </div>
  </div>
);

export default ControlsContainer;
