import { useEffect, useRef, useState } from "react";

// TODO: Allow these to be set via the environtment file or as props
const RECONNECT_DELAY_BASE = 200;
const MAX_RECONNECT_DELAY = 30000;
const MAX_RETRIES = 10;

/**
 * React hook to manage WebSocket connections with robust reconnection handling.
 *
 * Supported WebSocket events:
 * - `active`: Device becomes active.
 * - `inactive`: Device becomes inactive.
 * - `metadata`: Metadata for the loaded track.
 *      - uri: Track URI.
 *      - name: Track name.
 *      - artist_names: List of track artist names.
 *      - album_name: Track album name.
 *      - album_cover_url: Track album cover image URL.
 *      - position: Track position in milliseconds.
 *      - duration: Track duration in milliseconds.
 * - `will_play`: Playback is about to start.
 * - `playing`: The track is playing.
 * - `not_playing`: The track finished playing.
 * - `paused`: Playback is paused.
 * - `stopped`: No tracks are left to play.
 * - `seek`: Current track position updated.
 *      - uri: Track URI.
 *      - position: New position in milliseconds.
 *      - duration: Total duration in milliseconds.
 * - `volume`: Volume level changed.
 *      - value: Current volume.
 *      - max: Maximum volume value.
 * - `shuffle_context`: Shuffle setting changed.
 *      - value: Shuffle enabled or disabled.
 * - `repeat_context`: Repeat context setting changed.
 *      - value: Repeat enabled or disabled.
 * - `repeat_track`: Repeat track setting changed.
 *      - value: Repeat track enabled or disabled.
 *
 * @param {websocketUrl} full URI to websocket endpoint - reachable from clients opening the browser!
 * @param {Function} onEvent - Callback for handling WebSocket messages.
 * @returns {Object} WebSocket state: { isConnected, error }.
 */
const useWebSocket = (websocketUrl, onEvent) => {
  const [state, setState] = useState({
    isConnected: false,
    error: null,
  });
  const retryCountRef = useRef(0); // Use a ref to track retry count
  const socketRef = useRef(null); // Single WebSocket instance
  const retryTimeoutRef = useRef(null); // Reconnection timeout reference
  const disconnectTimeoutRef = useRef(null); // Timeout for delayed disconnection

  const connect = () => {
    if (retryCountRef.current > MAX_RETRIES) {
      setState({ isConnected: false, error: 'Max reconnection attempts reached.' });
      console.warn("Max WebSocket reconnection attempts reached.");
      return;
    }

    if (socketRef.current) {
      console.warn("WebSocket instance already exists. Skipping connect.");
      return;
    }

    console.log(
      `Connecting to WebSocket at ${websocketUrl} (Retry: ${retryCountRef.current})`
    );

    // Create WebSocket connection
    const socket = new WebSocket(websocketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected successfully.");
      setState({ isConnected: true, error: null });
      retryCountRef.current = 0; // Reset retries on successful connection

      // Clear any pending disconnect timeout
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
        disconnectTimeoutRef.current = null;
      }
    };

    socket.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data);
        if (onEvent) onEvent(event);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket encountered an error:", error.message || error);
      setState((prev) => ({
        ...prev,
        error: error.message || 'WebSocket encountered an error',
      }));
    };

    socket.onclose = (event) => {
      console.warn(
        `WebSocket closed (code: ${event.code}, reason: ${
          event.reason || "none"
        })`
      );

      if (event.code === 1000) {
        // Normal closure; no reconnection required
        console.log("WebSocket closed normally.");
        setState({ isConnected: false, error: null });
        socketRef.current = null;
        return;
      }

      // Introduce delayed disconnection
      disconnectTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, isConnected: false }));
      }, 4000); // Delay for 4 seconds

      setState((prev) => ({
        ...prev,
        error: event.reason || 'Connection closed',
      }));
      socketRef.current = null;

      // Handle reconnection with exponential backoff
      const delay = Math.min(
        RECONNECT_DELAY_BASE * 2 ** retryCountRef.current,
        MAX_RECONNECT_DELAY
      );

      console.log(`Reconnecting in ${delay / 1000} seconds...`);
      retryTimeoutRef.current = setTimeout(() => {
        retryCountRef.current += 1; // Increment retry count in the ref
        connect();
      }, delay);
    };
  };

  useEffect(() => {
    connect(); // Establish the WebSocket connection

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (disconnectTimeoutRef.current) clearTimeout(disconnectTimeoutRef.current);
      if (socketRef.current) {
        console.log("Closing WebSocket due to component unmount.");
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
    };
  }, [websocketUrl]);

  return state;
};

export default useWebSocket;
