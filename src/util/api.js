let apiBaseUrl = "";

/**
 * General
 */
export const checkAPI = async () => {
  const response = await fetch(`${apiBaseUrl}/`);
  return response.json();
};

/**
 * Status
 */
export const getStatus = async (baseUrl) => {
  if (apiBaseUrl !== baseUrl) {
    apiBaseUrl = baseUrl;
  }
  const response = await fetch(`${apiBaseUrl}/status`);
  return response.json();
};

/**
 * Player Controls
 */
export const play = async (payload) =>
  await fetch(`${apiBaseUrl}/player/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const resume = async () =>
  await fetch(`${apiBaseUrl}/player/resume`, { method: "POST" });

export const pause = async () =>
  await fetch(`${apiBaseUrl}/player/pause`, { method: "POST" });

export const togglePlayPause = async () =>
  await fetch(`${apiBaseUrl}/player/playpause`, { method: "POST" });

export const nextTrack = async (uri) =>
  await fetch(`${apiBaseUrl}/player/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri }),
  });

export const previousTrack = async () =>
  await fetch(`${apiBaseUrl}/player/prev`, { method: "POST" });

/**
 * Seek Controls
 */
export const seek = async (position, relative = false) =>
  await fetch(`${apiBaseUrl}/player/seek`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position, relative }),
  });

/**
 * Volume Controls
 */
export const getVolume = async () => {
  const response = await fetch(`${apiBaseUrl}/player/volume`);
  return response.json();
};

export const setVolume = async (volume, relative = false) =>
  await fetch(`${apiBaseUrl}/player/volume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ volume, relative }),
  });

/**
 * Repeat and Shuffle
 */
export const toggleRepeatContext = async (repeat_context) =>
  await fetch(`${apiBaseUrl}/player/repeat_context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repeat_context }),
  });

export const toggleRepeatTrack = async (repeat_track) =>
  await fetch(`${apiBaseUrl}/player/repeat_track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repeat_track }),
  });

export const toggleShuffleContext = async (shuffle_context) =>
  await fetch(`${apiBaseUrl}/player/shuffle_context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shuffle_context }),
  });

/**
 * Queue Management
 */
export const addToQueue = async (uri) =>
  await fetch(`${apiBaseUrl}/player/add_to_queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri }),
  });

export default {
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
