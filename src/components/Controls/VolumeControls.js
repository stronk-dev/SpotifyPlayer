// Volume controls - displays the current volume and draggable input
import React, { useState, useRef, useEffect } from "react";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import './VolumeControls.css';

const throttleDelay = 300; //< Min amount of time between API calls

// TODO: add more comments, IE for props
const VolumeControls = ({
  handleVolumeChange,
  remoteVolume,
  maxVolume,
  isStopped,
  isConnected
}) => {
  const [localVolume, setLocalVolume] = useState(remoteVolume); //< Local volume for responsiveness while throttling outgoing API calls
  const timeoutRef = useRef(null); //< Used to space out API calls if we're quicker than the rate limit
  const lastCallTimeRef = useRef(0); //< Last time we sent out an API call to seek
  const isDraggingRef = useRef(false); //< Tracks whether the user is dragging

  // Throttled volume change - instantly applies changes locally, but prevents spamming the API while dragging
  const onVolumeChange = (e) => {
    const value = (e.target.value / 100) * maxVolume;
    setLocalVolume(value);
    isDraggingRef.current = true;

    const now = Date.now();
    if (now - lastCallTimeRef.current > throttleDelay) {
      handleVolumeChange(e);
      lastCallTimeRef.current = now;
    } else {
      // Clear previous timeout if one exists
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Schedule a new API call for after the throttle delay
      timeoutRef.current = setTimeout(() => {
        handleVolumeChange(e);
        lastCallTimeRef.current = Date.now();
      }, throttleDelay - (now - lastCallTimeRef.current));
    }
  };

  // Make the final API call when dragging ends
  const onDragEnd = (e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleVolumeChange(e);
    isDraggingRef.current = false;
  };

  // Update the local volume when the remote volume updates - but only if we're not currently seeking
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalVolume(remoteVolume);
    }
  }, [remoteVolume]);

  return (
    <div className="spotify-player-volume-control">
      <span>
        <FaVolumeDown height={32} width={32} />
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={(localVolume / maxVolume) * 100}
        onChange={onVolumeChange}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        className="spotify-player-volume-slider"
        disabled={isStopped || !isConnected}
      />
      <span>
        <FaVolumeUp />
      </span>
    </div>
  );
};

export default VolumeControls;
