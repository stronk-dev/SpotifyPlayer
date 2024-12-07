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
  <div className="spotify-player-controls-container">
    <div className="spotify-player-playback-controls">
      <button onClick={handlePreviousTrack} className="spotify-player-control-button">
        <FaStepBackward />
      </button>
      <button onClick={handlePlayPause} className="spotify-player-control-button">
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={handleNextTrack} className="spotify-player-control-button">
        <FaStepForward />
      </button>

      {shuffleContext ? (
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
    {track && (
      <div className="spotify-player-seek-container">
        <span>{Math.floor(currentPosition / 1000)}s</span>
        <input
          type="range"
          min="0"
          max="100"
          value={(currentPosition / track.duration) * 100}
          onChange={handleSeek}
          className="spotify-player-seek-bar"
        />
        <span>{Math.floor(track.duration / 1000)}s</span>
      </div>
    )}
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
      />
      <span>
        <FaVolumeUp />
      </span>
    </div>
  </div>
);

export default ControlsContainer;
