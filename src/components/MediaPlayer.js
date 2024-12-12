// Main component - handles generic layout and prop-passing
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useComponentSize from "../hooks/useComponentSize";
import useLibrespot from "../hooks/useLibrespot";
import AlbumCard from "./Album/AlbumCard";
import Header from "./Info/Header";
import TextInfo from "./Info/TextInfo";
import Playlists from "./Info/Playlists";
import SeekControls from "./Controls/SeekControls";
import MediaButtons from "./Controls/MediaButtons";
import VolumeControls from "./Controls/VolumeControls";
import "./MediaPlayer.css";

const thresholdWidescreen = 800;
const thresholdTallcreen = 500;
const thresholdNarrowscreen = 500;

// TODO: add props for the WebSocket retries, etc.
// TODO: add more comments, IE for props
const MediaPlayer = ({
  websocketUrl = process.env.REACT_APP_WS_URL || "ws://localhost:3678/events",
  apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3678",
  kioskMode = (process.env.REACT_APP_KIOSK_MODE?.toLowerCase() == "true") || false,
  hideOnDisconnect = (process.env.REACT_APP_HIDE_ON_DISCONNECT?.toLowerCase() == "true") || false,
  layout = process.env.REACT_APP_LAYOUT || "auto",
}) => {
  const {
    playerRef,
    status,
    trackInfo,
    remotePosition,
    remoteVolume,
    maxVolume,
    isPlaying,
    isStopped,
    shuffleContext,
    handlePlayPause,
    handlePlay,
    handlePrevTrack,
    handleNextTrack,
    handleSeek,
    handleVolumeChange,
    toggleShuffle,
    isConnected,
    error,
    playlists,
  } = useLibrespot(websocketUrl, apiBaseUrl);
  const { width, height } = useComponentSize(playerRef); //< Retrieve dimensions of media player
  const [activeTab, setActiveTab] = useState("Info"); //< Text info view or Playlist selection
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      setSelectedPlaylist(null);
      setActiveTab("Info");
    } else if (isStopped) {
      setActiveTab("Playlists");
    }
  }, [isConnected, isStopped]);

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handlePlayPlaylist = (uri) => {
    handlePlay(uri);
  };

  const handleTabSwitch = (newVal) => {
    if (newVal == "Info") {
      setSelectedPlaylist(null);
    }
    setActiveTab(newVal);
  }

  // Hide the entire player if we are not connected to the API and the hideOnDisconnect prop is set.
  if (hideOnDisconnect && !isConnected) {
    return null;
  }

  const albumTitle = ((selectedPlaylist && activeTab == "Playlists") ? selectedPlaylist.name : null) || null;
  const albumSubtitle = (selectedPlaylist && activeTab == "Playlists") ? selectedPlaylist.owner.display_name : `Disc ${trackInfo?.disc_number || "N/A"}, Track ${trackInfo?.track_number || "N/A"}`;
  const albumImage = ((selectedPlaylist && activeTab == "Playlists") ? selectedPlaylist.images[0]?.url : trackInfo?.album_cover_url) || null;
  let playerClass = "spotify-player-spotify-card";
  if (layout == "auto") {
    if (!playerRef.current) {
      layout = "default";
    } else if (kioskMode) {
      if (width > thresholdNarrowscreen && height > thresholdTallcreen) {
        layout = "default";
      } else if (width > height) {
        layout = "widescreen";
      } else {
        layout = "portrait";
      }
    } else {
      if (width > thresholdWidescreen) {
        layout = "widescreen";
      } else if (width < thresholdNarrowscreen) {
        layout = "portrait";
      } else {
        layout = "default";
      }
    }
  }
  if (layout == "default") {
    playerClass += " spotify-player-default-layout";
  } else if (layout == "widescreen") {
    playerClass += " spotify-player-widescreen-layout";
  } else if (layout == "portrait") {
    playerClass += " spotify-player-portrait-layout";
  }
  if (kioskMode) {
    playerClass += " kiosk";
  }

  return (
    <div ref={playerRef} className={playerClass}>
      {layout == "portrait" ? (
        <>
          <Header
            isConnected={isConnected}
            deviceName={status?.device_name}
            deviceType={status?.device_type}
            isPlaying={isPlaying}
            isStopped={isStopped}
            activeTab={activeTab}
            setActiveTab={handleTabSwitch}
          />
          <div className="spotify-player-info-container">
            {activeTab === "Info" && <TextInfo
              track={trackInfo}
              isStopped={isStopped}
              isConnected={isConnected}
              error={error}
            />}
            {activeTab === "Playlists" && <Playlists
              playlists={playlists}
              onSelect={handleSelectPlaylist}
              onPlay={handlePlayPlaylist}
            />}
            <SeekControls
              duration={trackInfo?.duration || 100}
              remotePosition={remotePosition || 100}
              handleSeek={handleSeek}
              isStopped={isStopped}
              isConnected={isConnected}
              isPlaying={isPlaying}
            />
            <MediaButtons
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNextTrack={handleNextTrack}
              handlePreviousTrack={handlePrevTrack}
              shuffleContext={shuffleContext}
              toggleShuffle={toggleShuffle}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <VolumeControls
              remoteVolume={remoteVolume}
              maxVolume={maxVolume}
              handleVolumeChange={handleVolumeChange}
              isStopped={isStopped}
              isConnected={isConnected}
            />
          </div>
          <div className="spotify-player-bottom">
            <AlbumCard
              title={albumTitle}
              subtitle={albumSubtitle}
              image={albumImage}
              isStopped={isStopped || !albumImage || !albumImage?.length}
              isConnected={isConnected}
            />
          </div>
        </>
      ) : layout == "widescreen" ? (
        <div className="spotify-player-info-container">
          <div className="spotify-player-left">
            <AlbumCard
              title={albumTitle}
              subtitle={albumSubtitle}
              image={albumImage}
              isStopped={isStopped || !albumImage || !albumImage?.length}
              isConnected={isConnected}
            />
          </div>
          <div className="spotify-player-middle">
            <Header
              isConnected={isConnected}
              deviceName={status?.device_name}
              deviceType={status?.device_type}
              isPlaying={isPlaying}
              isStopped={isStopped}
              activeTab={activeTab}
              setActiveTab={handleTabSwitch}
            />
            {activeTab === "Info" && <TextInfo
              track={trackInfo}
              isStopped={isStopped}
              isConnected={isConnected}
              error={error}
            />}
            {activeTab === "Playlists" && <Playlists
              playlists={playlists}
              onSelect={handleSelectPlaylist}
              onPlay={handlePlayPlaylist}
            />}
          </div>
          <div className="spotify-player-right">
            <MediaButtons
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNextTrack={handleNextTrack}
              handlePreviousTrack={handlePrevTrack}
              shuffleContext={shuffleContext}
              toggleShuffle={toggleShuffle}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <SeekControls
              duration={trackInfo?.duration || 100}
              remotePosition={remotePosition || 100}
              handleSeek={handleSeek}
              isStopped={isStopped}
              isConnected={isConnected}
              isPlaying={isPlaying}
            />
            <VolumeControls
              remoteVolume={remoteVolume}
              maxVolume={maxVolume}
              handleVolumeChange={handleVolumeChange}
              isStopped={isStopped}
              isConnected={isConnected}
            />
          </div>
        </div>
      ) : (
        <>
          <Header
            isConnected={isConnected}
            deviceName={status?.device_name}
            deviceType={status?.device_type}
            isPlaying={isPlaying}
            isStopped={isStopped}
            activeTab={activeTab}
            setActiveTab={handleTabSwitch}
          />
          <div className="spotify-player-info-container">
            <div className="spotify-player-left">
              <AlbumCard
                title={albumTitle}
                subtitle={albumSubtitle}
                image={albumImage}
                isStopped={isStopped || !albumImage || !albumImage?.length}
                isConnected={isConnected}
              />
            </div>
            <div className="spotify-player-right">
              {activeTab === "Info" && <TextInfo
                track={trackInfo}
                isStopped={isStopped}
                isConnected={isConnected}
                error={error}
              />}
              {activeTab === "Playlists" && <Playlists
                playlists={playlists}
                onSelect={handleSelectPlaylist}
                onPlay={handlePlayPlaylist}
              />}
              {activeTab === "Info" && <SeekControls
                duration={trackInfo?.duration || 100}
                remotePosition={remotePosition || 100}
                handleSeek={handleSeek}
                isStopped={isStopped}
                isConnected={isConnected}
                isPlaying={isPlaying}
              />}
            </div>
          </div>
          <div className="spotify-player-footer">
            <MediaButtons
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNextTrack={handleNextTrack}
              handlePreviousTrack={handlePrevTrack}
              shuffleContext={shuffleContext}
              toggleShuffle={toggleShuffle}
              isStopped={isStopped}
              isConnected={isConnected}
            />
            <VolumeControls
              remoteVolume={remoteVolume}
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
