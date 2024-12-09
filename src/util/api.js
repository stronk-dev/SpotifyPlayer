
/**
 * Generic API call function with error handling.
 * @param {string} url - The API endpoint to call.
 * @param {object} options - Fetch options (method, headers, body, etc.).
 * @param {any} defaultReturnValue - The default return value on failure (default: {}).
 * @returns {Promise<any>} - The API response or default value.
 */
const callApi = async (url, options = {}, defaultReturnValue = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`API call failed: ${response.status} ${response.statusText}`);
      return defaultReturnValue;
    }
    return response;
  } catch (error) {
    console.error("Error in API call:", error);
    return defaultReturnValue;
  }
};

let apiBaseUrl = "";

/**
 * General
 */
export const checkAPI = async () => {
  const response = await callApi(`${apiBaseUrl}/`, {}, {});
  return response.json();
}

/**
 * Status
 */
export const getStatus = async (baseUrl) => {
  if (apiBaseUrl !== baseUrl) {
    apiBaseUrl = baseUrl;
  }
  const response = await callApi(`${apiBaseUrl}/status`, {}, {});
  return response.json();
}

/**
 * Player Controls
 */
export const play = async (payload) =>
  await callApi(`${apiBaseUrl}/player/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const resume = async () =>
  await callApi(`${apiBaseUrl}/player/resume`, { method: "POST" });

export const pause = async () =>
  await callApi(`${apiBaseUrl}/player/pause`, { method: "POST" });

export const togglePlayPause = async () =>
  await callApi(`${apiBaseUrl}/player/playpause`, { method: "POST" });

export const nextTrack = async (uri) =>
  await callApi(`${apiBaseUrl}/player/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri }),
  });

export const previousTrack = async () =>
  await callApi(`${apiBaseUrl}/player/prev`, { method: "POST" });

/**
 * Seek Controls
 */
export const seek = async (position, relative = false) =>
  await callApi(`${apiBaseUrl}/player/seek`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position, relative }),
  });

/**
 * Volume Controls
 */
export const getVolume = async () => {
  const response = await callApi(`${apiBaseUrl}/player/volume`, {}, {});
  return response.json();
}

export const setVolume = async (volume, relative = false) =>
  await callApi(`${apiBaseUrl}/player/volume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ volume, relative }),
  });

/**
 * Repeat and Shuffle
 */
export const toggleRepeatContext = async (repeat_context) =>
  await callApi(`${apiBaseUrl}/player/repeat_context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repeat_context }),
  });

export const toggleRepeatTrack = async (repeat_track) =>
  await callApi(`${apiBaseUrl}/player/repeat_track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repeat_track }),
  });

export const toggleShuffleContext = async (shuffle_context) =>
  await callApi(`${apiBaseUrl}/player/shuffle_context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shuffle_context }),
  });

/**
 * Queue Management
 */
export const addToQueue = async (uri) =>
  await callApi(`${apiBaseUrl}/player/add_to_queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri }),
  });

const exports = {
  checkAPI,
  getStatus,
  play,
  resume,
  pause,
  togglePlayPause,
  nextTrack,
  previousTrack,
  seek,
  getVolume,
  setVolume,
  toggleRepeatContext,
  toggleRepeatTrack,
  toggleShuffleContext,
  addToQueue,
};
export default exports;