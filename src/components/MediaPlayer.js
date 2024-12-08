
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWebSocket from "../hooks/useWebSocket";
import useComponentSize from "../hooks/useComponentSize";
import AlbumCard from "./Album/AlbumCard";
import DeviceTitle from "./Info/DeviceTitle";
import TrackDetails from "./Info/TrackDetails";
import SeekControls from "./Controls/SeekControls";
import MediaButtons from "./Controls/MediaButtons";
import VolumeControls from "./Controls/VolumeControls";
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
  const [isStopped, setIsStopped] = useState(false);
  const [shuffleContext, setShuffleContext] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);
  const { width } = useComponentSize(playerRef);

  const { isConnected, error } = useWebSocket(websocketUrl, (event) => {
    switch (event.type) {
      case "metadata":
        setTrack(event.data);
        setCurrentPosition(0);
        break;
      case "playing":
        setIsPlaying(true);
        if (isStopped) {
          setIsStopped(false);
        }
        break;
      case "paused":
        setIsPlaying(false);
        if (isStopped) {
          setIsStopped(false);
        }
        break;
      case "stopped":
      case "inactive":
        setIsStopped(true);
        if (isPlaying) {
          setIsPlaying(false);
        }
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
      const isStopped = data.stopped || !data.play_origin.length || data.track == null;
      setStatus(data);
      setTrack(data.track);
      setLocalVolume(data.volume);
      setMaxVolume(data.volume_steps);
      setIsPlaying(!data.paused && !isStopped);
      setIsStopped(isStopped);
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

  const updateLayout = () => {
    if (playerRef.current) {
      const layoutClass =
        width > 900
          ? "spotify-player-widescreen-layout"
          : width < 500
            ? "spotify-player-portrait-layout"
            : "spotify-player-default-layout";

      // Remove previous layout classes
      playerRef.current.classList.remove(
        "spotify-player-widescreen-layout",
        "spotify-player-portrait-layout",
        "spotify-player-default-layout"
      );

      // Add the current layout class
      playerRef.current.classList.add(layoutClass);
    }
  };

  useEffect(() => {
    updateLayout();
  }, [width]);

  if (hideOnDisconnect && !isConnected) {
    return null;
  }

  console.log(isConnected);

  return (
    <div ref={playerRef} className="spotify-player-spotify-card">
      {width < 500 ? (
        <>
          <div className="spotify-player-header">
            <DeviceTitle
              isConnected={isConnected}
              deviceName={status?.device_name}
              deviceType={status?.device_type}
              isPlaying={isPlaying}
              isStopped={isStopped}
            />
          </div>
          <div className="spotify-player-info-container">
            <TrackDetails
              track={track}
              formatReleaseDate={formatReleaseDate}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <SeekControls
              duration={track?.duration || 100}
              currentPosition={currentPosition || 100}
              handleSeek={handleSeek}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <MediaButtons
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNextTrack={handleNextTrack}
              handlePreviousTrack={previousTrack}
              shuffleContext={shuffleContext}
              toggleShuffle={toggleShuffle}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <VolumeControls
              volume={volume}
              maxVolume={maxVolume}
              handleVolumeChange={handleVolumeChange}
              isStopped={isStopped}
              isConnected={isConnected}
            />
          </div>
          <div className="spotify-player-bottom">
            <AlbumCard
              title={track?.album_name || "N/A"}
              subtitle={`Disc ${track?.disc_number || "N/A"}, Track ${track?.track_number || "N/A"}`}
              image={track?.album_cover_url}
              isStopped={isStopped || !track?.album_cover_url || !track?.album_cover_url?.length}
              isConnected={isConnected}
            />
          </div>
        </>
      ) : width > 900 ? (
        <div className="spotify-player-info-container">
          <div className="spotify-player-left">
            <AlbumCard
              title={track?.album_name || "N/A"}
              subtitle={`Disc ${track?.disc_number || "N/A"}, Track ${track?.track_number || "N/A"}`}
              image={track?.album_cover_url}
              isStopped={isStopped || !track?.album_cover_url || !track?.album_cover_url?.length}
              isConnected={isConnected}
            />
          </div>
          <div className="spotify-player-middle">
            <DeviceTitle
              isConnected={isConnected}
              deviceName={status?.device_name}
              deviceType={status?.device_type}
              isPlaying={isPlaying}
              isStopped={isStopped}
            />
            <TrackDetails
              track={track}
              formatReleaseDate={formatReleaseDate}
              isStopped={isStopped}
              isConnected={isConnected}
            />
          </div>
          <div className="spotify-player-right">
            <MediaButtons
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNextTrack={handleNextTrack}
              handlePreviousTrack={previousTrack}
              shuffleContext={shuffleContext}
              toggleShuffle={toggleShuffle}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <SeekControls
              duration={track?.duration || 100}
              currentPosition={currentPosition || 100}
              handleSeek={handleSeek}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <VolumeControls
              volume={volume}
              maxVolume={maxVolume}
              handleVolumeChange={handleVolumeChange}
              isStopped={isStopped}
              isConnected={isConnected}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="spotify-player-header">
            <DeviceTitle
              isConnected={isConnected}
              deviceName={status?.device_name}
              deviceType={status?.device_type}
              isPlaying={isPlaying}
              isStopped={isStopped}
            />
          </div>
          <div className="spotify-player-info-container">
            <div className="spotify-player-left">
              <AlbumCard
                title={track?.album_name || "N/A"}
                subtitle={`Disc ${track?.disc_number || "N/A"}, Track ${track?.track_number || "N/A"}`}
                image={track?.album_cover_url}
                isStopped={isStopped || !track?.album_cover_url || !track?.album_cover_url?.length}
                isConnected={isConnected}
              />
            </div>
            <div className="spotify-player-right">
              <TrackDetails
                track={track}
                formatReleaseDate={formatReleaseDate}
                isStopped={isStopped}
                isConnected={isConnected}
              />
              <SeekControls
                duration={track?.duration || 100}
                currentPosition={currentPosition || 100}
                handleSeek={handleSeek}
                isStopped={isStopped}
                isConnected={isConnected}
              />
            </div>
          </div>
          <div className="spotify-player-footer">
            <MediaButtons
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNextTrack={handleNextTrack}
              handlePreviousTrack={previousTrack}
              shuffleContext={shuffleContext}
              toggleShuffle={toggleShuffle}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <VolumeControls
              volume={volume}
              maxVolume={maxVolume}
              handleVolumeChange={handleVolumeChange}
              isStopped={isStopped}
              isConnected={isConnected}
            />
          </div>
        </>
      )}
    </div>
  );
};

MediaPlayer.propTypes = {
  websocketUrl: PropTypes.string,
  apiBaseUrl: PropTypes.string,
  hideOnDisconnect: PropTypes.bool,
};

export default MediaPlayer;
