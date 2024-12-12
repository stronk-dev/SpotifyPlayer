// Renders a text box with info - like a table with playback info or an error message.
import React from "react";
import './TextInfo.css';

// TODO: should display the error somewhere at some point
// TODO: add more comments, IE for props
const TextInfo = ({ track, isStopped, isConnected, error }) => {
  if (isStopped || !isConnected) {
    return (
      <div className="spotify-player-track-details spotify-player-message">
        {isConnected ? "The device is currently stopped. Please load a playlist or album." : "Waiting for API connection..."}
      </div>
    )
  }

  // Tries to format the release date to YYYY-MM-DD or partial formats if data is incomplete
  const formatReleaseDate = (releaseDate) => {
    if (!releaseDate || !releaseDate.length) {
      return "Unknown";
    }

    // Match the format with optional spaces: "year:YYYY month:MM day:DD"
    const match = releaseDate.match(/year:\s*(\d+)?\s*month:\s*(\d+)?\s*day:\s*(\d+)?/);

    if (match) {
      const year = match[1] || "";
      const month = match[2] ? match[2].padStart(2, "0") : "";
      const day = match[3] ? match[3].padStart(2, "0") : "";

      // Construct the result based on available parts
      let result = year;
      if (month) result += `-${month}`;
      if (day) result += `-${day}`;

      return result || "Unknown"; // Fallback to "Unknown" if no valid parts
    }
    return releaseDate; // Return as-is for invalid formats
  };

  return (
    <div className="spotify-player-track-details">
      <h4>{track?.name || "N/A"}</h4>
      <table className="spotify-player-track-details-table">
        <tbody>
          <tr className="spotify-player-track-details-row">
            <td className="spotify-player-track-details-cell spotify-player-key-cell">Album</td>
            <td className="spotify-player-track-details-cell spotify-player-value-cell">{track?.album_name || "N/A"}</td>
          </tr>
          <tr className="spotify-player-track-details-row">
            <td className="spotify-player-track-details-cell spotify-player-key-cell">Artist</td>
            <td className="spotify-player-track-details-cell spotify-player-value-cell">{track?.artist_names?.join(", ") || "N/A"}</td>
          </tr>
          <tr className="spotify-player-track-details-row">
            <td className="spotify-player-track-details-cell spotify-player-key-cell">Released</td>
            <td className="spotify-player-track-details-cell spotify-player-value-cell">{track?.release_date ? formatReleaseDate(track.release_date) : "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TextInfo;
