// Seek controls - displays the current playback position, duration and a draggable input
import React, { useState, useRef, useEffect } from "react";
import './SeekControls.css';

const throttleDelay = 500; //< Min amount of time between API calls

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// TODO: add more comments, IE for props
const SeekControls = ({
  duration,
  remotePosition,
  handleSeek,
  isStopped,
  isConnected,
  isPlaying
}) => {
  const [localPosition, setLocalPosition] = useState(remotePosition); //< Local position for responsiveness while throttling outgoing API calls
  const intervalRef = useRef(null); //< Used to update the remotePosition on a timeout
  const timeoutRef = useRef(null); //< Used to space out API calls if we're quicker than the rate limit
  const lastCallTimeRef = useRef(0); //< Last time we sent out an API call to seek
  const isDraggingRef = useRef(false); //< Tracks whether the user is dragging

  // Throttled seeking - instantly applies changes locally, but prevents spamming the API while dragging
  const onSeekChange = (e) => {
    const value = (e.target.value / 100) * duration;
    setLocalPosition(value);
    isDraggingRef.current = true;

    const now = Date.now();
    if (now - lastCallTimeRef.current > throttleDelay) {
      handleSeek(e);
      lastCallTimeRef.current = now;
    } else {
      // Clear previous timeout if one exists
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Schedule a new API call for after the throttle delay
      timeoutRef.current = setTimeout(() => {
        handleSeek(e);
        lastCallTimeRef.current = Date.now();
      }, throttleDelay - (now - lastCallTimeRef.current));
    }
  };

  // Make the final API call when dragging ends
  const onSeekEnd = (e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleSeek(e);
    isDraggingRef.current = false;
  };

  // Update the local position when the remote position updates - but only if we're not currently seeking
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalPosition(remotePosition);
    }
  }, [remotePosition]);

  // Emulate playback for as long as we don't receive any updates on the remote position or are seeking
  useEffect(() => {
    if (isPlaying && duration) {
      intervalRef.current = setInterval(() => {
        // Skip if we are currently seeking
        if (isDraggingRef.current) {
          return;
        }
        setLocalPosition((prev) => {
          const nextPosition = prev + 1000;
          return nextPosition < duration ? nextPosition : duration;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration]);

  return (
    <div className="spotify-player-seek-container">
      <span>{formatTime(localPosition)}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={(localPosition / duration) * 100}
        onChange={onSeekChange}
        onMouseUp={onSeekEnd}
        onTouchEnd={onSeekEnd}
        className="spotify-player-seek-bar"
        disabled={isStopped || !isConnected}
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
};

export default SeekControls;
