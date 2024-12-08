import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWebSocket from "../hooks/useWebSocket";
import AlbumCard from "./AlbumCard";
import DeviceTitle from "./DeviceTitle";
import TrackDetails from "./TrackDetails";
import ControlsContainer from "./ControlsContainer";
import {
  getStatus,
  resume,
  pause,
  seek,
  previousTrack,
  setVolume,
  toggleShuffleContext,
} from "../util/api";
import "./MediaPlayer.css";

const MediaPlayer = ({
  websocketUrl = process.env.REACT_APP_WS_URL || "ws://localhost:3678/events",
  apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3678",
  hideOnDisconnect = false,
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
    isPlaying ? pause() : resume();
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

  if (hideOnDisconnect && !isConnected) {
    return;
  }

  return (
    <div className="spotify-player-spotify-card">
      <div className="spotify-player-info-container">
        <AlbumCard
          title={track?.album_name || "N/A"}
          subtitle={`Disc ${track?.disc_number || "N/A"}, Track ${track?.track_number || "N/A"}`}
          image={track?.album_cover_url}
        />
        <div className="spotify-player-spotify-details">
          <div className="spotify-player-details-container">
            <DeviceTitle isConnected={isConnected} deviceName={status?.device_name} deviceType={status?.device_type} isPlaying={isPlaying} />
            <TrackDetails track={track} formatReleaseDate={formatReleaseDate} />
          </div>
          <ControlsContainer
            isPlaying={isPlaying}
            handlePlayPause={handlePlayPause}
            handleNextTrack={handleNextTrack}
            handlePreviousTrack={previousTrack}
            shuffleContext={shuffleContext}
            toggleShuffle={toggleShuffle}
            track={track}
            currentPosition={currentPosition}
            handleSeek={handleSeek}
            volume={volume}
            maxVolume={maxVolume}
            handleVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
      {error && <span className="error">Error: {error}</span>}
    </div>
  );
};

MediaPlayer.propTypes = {
  websocketUrl: PropTypes.string,
  apiBaseUrl: PropTypes.string,
  hideOnDisconnect: PropTypes.bool,
};

export default MediaPlayer;
