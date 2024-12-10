// Hook to handle the connection and state for a go-librespot client.
import { useState, useEffect, useRef, useCallback } from "react";
import useWebSocket from "./useWebSocket";
import {
  getStatus,
  resume,
  pause,
  seek,
  play,
  previousTrack,
  setVolume,
  toggleShuffleContext,
  getPlaylists
} from "../util/api";

// TODO: add more comments, IE for props
const useLibrespot = (websocketUrl, apiBaseUrl) => {
  const [status, setStatus] = useState(null); //< Remote long term, contains entire response of getStatus call.
  const [trackInfo, setTrack] = useState(null); //< Track details
  const [playlists, setPlaylists] = useState(null); //< Playlist details
  const [remotePosition, setRemotePosition] = useState(0); //< Spotify last known playback position
  const [remoteVolume, setRemoteVolume] = useState(0); //< Spotify last known volume level
  const [maxVolume, setMaxVolume] = useState(100); //< Spotify last known max volume (steps)
  const [isPlaying, setIsPlaying] = useState(false); //< Spotify client is playing back music
  const [isStopped, setIsStopped] = useState(false); //< Spotify client is in a stopped state - requires starting playback from an official client until the API supports getting and initializing playback of playlists.
  const [shuffleContext, setShuffleContext] = useState(false); //< Shuffle is enabled - no smart shuffle support in the API yet
  const playerRef = useRef(null); //< Ref to parent component - used to determine it's dimensions for auto-layout

  const eventHandler = useCallback((event) => {
    switch (event.type) {
      case "metadata":
        setTrack(event.data);
        setRemotePosition(0);
        break;
      case "playing":
        setIsPlaying(true);
        setIsStopped(false);
        break;
      case "paused":
        setIsPlaying(false);
        setIsStopped(false);
        break;
      case "stopped":
      case "inactive":
        setIsStopped(true);
        setIsPlaying(false);
        break;
      case "seek":
        setRemotePosition(event.data.position);
        break;
      case "volume":
        setRemoteVolume(event.data.value);
        break;
      case "shuffle_context":
        setShuffleContext(event.data.value);
        break;
      default:
        break;
    }
  }, []);

  // Handler for WebSocket messages
  const { isConnected, error } = useWebSocket(websocketUrl, eventHandler);

  // (Re)load on initial render or whenever the API endpoint changes.
  useEffect(() => {
    const fetchStatus = async () => {
      console.log("Refreshing state");
      const data = await getStatus(apiBaseUrl);
      const isStopped = data.stopped || !data.play_origin.length || data.track == null;
      setStatus(data); //< TODO: remove long term.
      setTrack(data.track);
      setRemoteVolume(data.volume);
      setMaxVolume(data.volume_steps);
      setIsPlaying(!data.paused && !isStopped);
      setIsStopped(isStopped);
      setShuffleContext(data.shuffle_context);
      setRemotePosition(data.track?.position || 0);
    };
    const fetchPlaylists = async () => {
      console.log("Refreshing playlists");
      const data = await getPlaylists(apiBaseUrl);
      console.log("Retrieve %i out of %i playlists", data.items.length, data.total)
      setPlaylists(data.items);
    };
    // Refresh state on each (re)connect
    if (isConnected){
      fetchStatus();
      fetchPlaylists();
    }
  }, [apiBaseUrl, isConnected]);

  // Call pause or resume depending on the current state of the player
  const handlePlayPause = () => {
    if (!isConnected || isStopped) {
      console.error("Unable to play/pause, as the player is inactive.");
      return;
    }
    isPlaying ? pause(apiBaseUrl) : resume(apiBaseUrl);
  };

  // Simply calls the previous track API call
  const handlePrevTrack = () => {
    if (!isPlaying || isStopped) {
      console.error("Unable to skip back, as the player is inactive.");
      return;
    }
    if (!isPlaying) {
      resume(apiBaseUrl);
    }
    previousTrack(apiBaseUrl);
  };

  // Skips to the next track by seeking to the end of the track
  const handleNextTrack = () => {
    if (!trackInfo || isStopped) {
      console.error("Unable to skip track, as the player is inactive.");
      return;
    }
    if (!isPlaying) {
      resume(apiBaseUrl);
    }
    seek(apiBaseUrl, trackInfo.duration - 5);
    setRemotePosition(trackInfo.duration - 5);
  };

  // 
  const handlePlay = (uri) => {
    const payload = {
      uri,
      // skip_to_uri: uri,
      paused: false
    }
    play(apiBaseUrl, payload);
  };

  // Seeks to a % of the current duration.
  const handleSeek = (event) => {
    if (!trackInfo || isStopped) {
      console.error("Unable to seek, as the player is inactive.");
      return;
    }
    const seekTo = (event.target.value / 100) * trackInfo.duration;
    seek(apiBaseUrl, Math.floor(seekTo));
  };

  // Seeks to a % of the max volume
  const handleVolumeChange = (event) => {
    if (!isPlaying || isStopped) {
      console.error("Unable to modify volume, as the player is inactive.");
      return;
    }
    const newVolume = (event.target.value / 100) * maxVolume;
    setVolume(apiBaseUrl, Math.round(newVolume));
  };

  // Toggles shuffle mode
  const toggleShuffle = () => {
    if (!isPlaying || isStopped) {
      console.error("Unable to toggle shuffle mode, as the player is inactive.");
      return;
    }
    toggleShuffleContext(apiBaseUrl, !shuffleContext);
  };

  return {
    playerRef,
    status,
    trackInfo,
    remotePosition,
    remoteVolume,
    maxVolume,
    isPlaying,
    isStopped,
    shuffleContext,
    handlePlay,
    handlePlayPause,
    handlePrevTrack,
    handleNextTrack,
    handleSeek,
    handleVolumeChange,
    toggleShuffle,
    isConnected,
    error,
    playlists,
  };
};

export default useLibrespot;
