// Collection of go-librespot API calls

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

// Not sure what this is for, maybe for health checking?
export const checkAPI = async (baseUrl) => {
  const response = await callApi(`${baseUrl}/`, {}, {});
  return response.json();
}

// Gets the entire status JSON blob. Also initializes apiBaseUrl
export const getStatus = async (baseUrl) => {
  const response = await callApi(`${baseUrl}/status`, {}, {});
  return response.json();
}

/**
 * Player Controls
 */

export const play = async (baseUrl, payload) =>
  await callApi(`${baseUrl}/player/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const resume = async (baseUrl) =>
  await callApi(`${baseUrl}/player/resume`, { method: "POST" });

export const pause = async (baseUrl) =>
  await callApi(`${baseUrl}/player/pause`, { method: "POST" });

export const togglePlayPause = async (baseUrl) =>
  await callApi(`${baseUrl}/player/playpause`, { method: "POST" });

export const nextTrack = async (baseUrl, uri) =>
  await callApi(`${baseUrl}/player/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri }),
  });

export const previousTrack = async (baseUrl) =>
  await callApi(`${baseUrl}/player/prev`, { method: "POST" });

/**
 * Seek Controls
 */

export const seek = async (baseUrl, position, relative = false) =>
  await callApi(`${baseUrl}/player/seek`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position, relative }),
  });

/**
 * Volume Controls
 */

export const getVolume = async (baseUrl) => {
  const response = await callApi(`${baseUrl}/player/volume`, {}, {});
  return response.json();
}

export const setVolume = async (baseUrl, volume, relative = false) =>
  await callApi(`${baseUrl}/player/volume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ volume, relative }),
  });

/**
 * Repeat and Shuffle
 */

export const toggleRepeatContext = async (baseUrl, repeat_context) =>
  await callApi(`${baseUrl}/player/repeat_context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repeat_context }),
  });

export const toggleRepeatTrack = async (baseUrl, repeat_track) =>
  await callApi(`${baseUrl}/player/repeat_track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repeat_track }),
  });

export const toggleShuffleContext = async (baseUrl, shuffle_context) =>
  await callApi(`${baseUrl}/player/shuffle_context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shuffle_context }),
  });

/**
 * Queue Management
 */

export const addToQueue = async (baseUrl, uri) =>
  await callApi(`${baseUrl}/player/add_to_queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri }),
  });

/**
 * Passthrough API to Spotify
 */

export const getPlaylists = async (baseUrl) => {
  const response = await callApi(`${baseUrl}/web-api/v1/me/playlists?limit=50&offset=0`, {
    method: "GET",
  });
  return response.json();
}


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
  getPlaylists,
};
export default exports;