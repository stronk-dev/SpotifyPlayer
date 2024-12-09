import React, { useState, useRef, useEffect } from "react";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import './VolumeControls.css';

const throttleDelay = 500;

const VolumeControls = ({
  handleVolumeChange,
  volume,
  maxVolume,
  isStopped,
  isConnected
}) => {
  const [localVolume, setLocalVolume] = useState(volume);
  const timeoutRef = useRef(null);
  const lastCallTimeRef = useRef(0);

  const onVolumeChange = (e) => {
    const value = (e.target.value / 100) * maxVolume;
    setLocalVolume(value);

    // Throttled API call
    const now = Date.now();

    if (now - lastCallTimeRef.current > throttleDelay) {
      handleVolumeChange(e); // Call the API
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

  useEffect(() => {
    if (!lastCallTimeRef.current || Date.now() - lastCallTimeRef.current > throttleDelay) {
      setLocalVolume(volume);
    }
  }, [volume]);

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
