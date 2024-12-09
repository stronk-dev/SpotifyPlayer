// Hook to connect to go-librespots WebSocket
import { useEffect, useRef, useState } from "react";

// TODO: Allow these to be set via the environtment file or as props
const RECONNECT_DELAY_BASE = 200; //< Time for the first reconnection attempt
const MAX_RECONNECT_DELAY = 30000; //< Max time for a reconnection attempt
const MAX_RETRIES = 10; //< Amount of retries before it stops attempting to reconnect

/**
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

  // Reinit WebSocket on every websocketUrl or onEvent handler change
  // TODO: currently does nothing if already connected - so if websocketUrl changes it won't reconnect if already connected.
  useEffect(() => {
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

      // onopen handler - reset state on successfull connection
      socket.onopen = () => {
        console.log("WebSocket connected successfully.");
        setState({ isConnected: true, error: null });
        retryCountRef.current = 0;

        // Clear any pending disconnect timeout
        if (disconnectTimeoutRef.current) {
          clearTimeout(disconnectTimeoutRef.current);
          disconnectTimeoutRef.current = null;
        }
      };

      // onmessage handler - parse incoming message and pass to handler
      socket.onmessage = (message) => {
        try {
          const event = JSON.parse(message.data);
          if (onEvent) onEvent(event);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      // onerror handler - store error messages
      socket.onerror = (error) => {
        console.error("WebSocket encountered an error:", error.message || error);
        setState((prev) => ({
          ...prev,
          error: error.message || 'WebSocket encountered an error',
        }));
      };

      // onclose handler - tries to reconnect. Sets isConnected to false after being disconnected for a bit
      socket.onclose = (event) => {
        console.warn(
          `WebSocket closed (code: ${event.code}, reason: ${event.reason || "none"
          })`
        );

        // Normal closure; no reconnection required
        if (event.code === 1000) {
          console.log("WebSocket closed normally.");
          setState({ isConnected: false, error: null });
          socketRef.current = null;
          return;
        }

        // Handle intermittent disconnections by delaying the isConnected flip to false.
        disconnectTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, isConnected: false }));
        }, 4000); // Delay for 4 seconds

        setState((prev) => ({
          ...prev,
          error: event.reason || 'Connection closed',
        }));
        // Clear ref a new conn attempt can set it
        socketRef.current = null;

        // Handle reconnection with exponential backoff
        const delay = Math.min(
          RECONNECT_DELAY_BASE * 2 ** retryCountRef.current,
          MAX_RECONNECT_DELAY
        );

        console.log(`Reconnecting in ${delay / 1000} seconds...`);
        retryTimeoutRef.current = setTimeout(() => {
          retryCountRef.current += 1;
          connect();
        }, delay);
      };
    };

    connect();

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (disconnectTimeoutRef.current) clearTimeout(disconnectTimeoutRef.current);
      if (socketRef.current) {
        console.log("Closing WebSocket due to component unmount.");
        // Close WebSocket and notify API as to why
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
    };
  }, [websocketUrl, onEvent]);

  return state;
};

export default useWebSocket;
