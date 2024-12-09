import React, { useState, useRef, useEffect } from "react";
import './SeekControls.css';

const throttleDelay = 600;

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const SeekControls = ({
  duration,
  currentPosition,
  handleSeek,
  isStopped,
  isConnected
}) => {
  const [localPosition, setLocalPosition] = useState(currentPosition);
  const timeoutRef = useRef(null);
  const lastCallTimeRef = useRef(0);

  const onSeekChange = (e) => {
    const value = (e.target.value / 100) * duration;
    setLocalPosition(value);

    // Throttled API call
    const now = Date.now();
    if (now - lastCallTimeRef.current > throttleDelay) {
      handleSeek(e); // Call the API
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

  useEffect(() => {
    if (!lastCallTimeRef.current || Date.now() - lastCallTimeRef.current > throttleDelay) {
      setLocalPosition(currentPosition);
    }
  }, [currentPosition]);

  return (
    <div className="spotify-player-seek-container">
      <span>{formatTime(localPosition)}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={(localPosition / duration) * 100}
        onChange={onSeekChange}
        className="spotify-player-seek-bar"
        disabled={isStopped || !isConnected}
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
};

export default SeekControls;
