import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWebSocket from "../hooks/useWebSocket";
import {
  getStatus,
  resume,
  pause,
  seek,
  previousTrack,
  setVolume,
  toggleShuffleContext,
} from "../util/api";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeDown,
  FaVolumeUp,
  FaRandom,
  FaExclamationCircle,
} from "react-icons/fa";
import { GiCompactDisc } from "react-icons/gi";
import "./MediaPlayer.css";
import AlbumCard from "./AlbumCard";

const MediaPlayer = ({
  websocketUrl = process.env.REACT_APP_WS_URL || "ws://localhost:3678/events",
  apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3678",
}) => {
  const [status, setStatus] = useState(null);
  const [track, setTrack] = useState(null);
  const [volume, setLocalVolume] = useState(0);
  const [maxVolume, setMaxVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleContext, setShuffleContext] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const intervalRef = useRef(null);

  const { isConnected, error } = useWebSocket(websocketUrl, (event) => {
    switch (event.type) {
      case "metadata":
        setTrack(event.data);
        setCurrentPosition(0);
        break;
      case "playing":
        setIsPlaying(true);
        break;
      case "paused":
        setIsPlaying(false);
        break;
      case "seek":
        setCurrentPosition(event.data.position);
        break;
      case "volume":
        setLocalVolume(event.data.value);
        break;
      case "shuffle_context":
        setShuffleContext(event.data.value);
        break;
      default:
        break;
    }
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await getStatus(apiBaseUrl);
      setStatus(data);
      setTrack(data.track);
      setLocalVolume(data.volume);
      setMaxVolume(data.volume_steps);
      setIsPlaying(!data.paused);
      setShuffleContext(data.shuffle_context);
      setCurrentPosition(data.track?.position || 0);
    };
    fetchStatus();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (isPlaying && track) {
      intervalRef.current = setInterval(() => {
        setCurrentPosition((prev) => {
          const nextPosition = prev + 1000;
          return nextPosition < track.duration ? nextPosition : track.duration;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, track]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (track) {
      seek(track.duration - 50); // Seek close to the end of the track
      setCurrentPosition(track.duration - 50);
    }
  };

  const handleSeek = (event) => {
    const seekTo = (event.target.value / 100) * track.duration;
    seek(Math.floor(seekTo));
    setCurrentPosition(seekTo);
  };

  const handleVolumeChange = (event) => {
    const newVolume = (event.target.value / 100) * maxVolume;
    setVolume(Math.round(newVolume));
    setLocalVolume(Math.round(newVolume));
  };

  const toggleShuffle = () => {
    toggleShuffleContext(!shuffleContext);
    setShuffleContext(!shuffleContext);
  };

  const formatReleaseDate = (releaseDate) => {
    // Match the format with optional spaces: "year:YYYY month:MM day:DD"
    const match = releaseDate.match(/year:\s*(\d+)\s*month:\s*(\d+)\s*day:\s*(\d+)/);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, "0"); // Ensure two-digit month
      const day = match[3].padStart(2, "0");   // Ensure two-digit day
      return `${year}-${month}-${day}`;
    }
    return "Invalid Date"; // Return fallback for invalid formats
  };

  if (!track) {
    // TODO: handle this nicely...
    return;
  }

  return (
    <div className="spotify-card">
      <div className="info-container">
        <AlbumCard
          title={track?.album_name || "N/A"}
          subtitle={`Disc ${track?.disc_number || "N/A"}, Track ${track?.track_number || "N/A"}`}
          image={track?.album_cover_url}
        />
        <div className="spotify-details">
          <div className="device-title">
            {isConnected ? (
              <GiCompactDisc className="connected-icon" />
            ) : (
              <FaExclamationCircle className="connected-icon disconnected" />
            )}
            <h4>{status.device_name}</h4>
          </div>
          <div className="track-details">
            <table className="track-details-table">
              <tbody>
                <tr className="track-details-row">
                  <td className="track-details-cell key-cell">Title</td>
                  <td className="track-details-cell value-cell">{track.name}</td>
                </tr>
                <tr className="track-details-row">
                  <td className="track-details-cell key-cell">Artist</td>
                  <td className="track-details-cell value-cell">{track.artist_names.join(", ")}</td>
                </tr>
                <tr className="track-details-row">
                  <td className="track-details-cell key-cell">Released</td>
                  <td className="track-details-cell value-cell">{formatReleaseDate(track.release_date)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="controls-container">
            <div className="playback-controls">
              <button onClick={previousTrack} className="control-button">
                <FaStepBackward />
              </button>
              <button onClick={handlePlayPause} className="control-button">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={handleNextTrack} className="control-button">
                <FaStepForward />
              </button>

              {/* Shuffle Toggle */}
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

            {/* Seek Bar */}
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

            {/* Volume Control */}
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
        </div>
      </div>
      {error && <span className="error">Error: {error}</span>}
    </div>
  );
};

MediaPlayer.propTypes = {
  websocketUrl: PropTypes.string,
  apiBaseUrl: PropTypes.string,
};

export default MediaPlayer;
