import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom } from "react-icons/fa";
import './MediaButtons.css';

const MediaButtons = ({
  isPlaying,
  handlePlayPause,
  handleNextTrack,
  handlePreviousTrack,
  shuffleContext,
  toggleShuffle,
  isStopped,
  isConnected
}) => (
  <div className="spotify-player-playback-controls">
    <button onClick={handlePreviousTrack} className="spotify-player-control-button" disabled={(isStopped || !isConnected)}>
      <FaStepBackward />
    </button>
    <button onClick={handlePlayPause} className="spotify-player-control-button" disabled={(isStopped || !isConnected)}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
    <button onClick={handleNextTrack} className="spotify-player-control-button" disabled={(isStopped || !isConnected)}>
      <FaStepForward />
    </button>

    {(isStopped || !isConnected) ? (
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
);

export default MediaButtons;
