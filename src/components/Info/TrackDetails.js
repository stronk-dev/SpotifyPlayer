import React from "react";
import './TrackDetails.css';

// TODO: should display the error somewhere at some point
const TrackDetails = ({ track, formatReleaseDate, isStopped, isConnected, error }) => {
  if (isStopped || !isConnected) {
    return (
      <div className="spotify-player-track-details spotify-player-message">
        {isConnected ? "The device is currently stopped. Please load a playlist or album." : "Not Connected."}
      </div>
    )
  }
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

export default TrackDetails;
