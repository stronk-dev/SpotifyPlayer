import React from "react";
import './TrackDetails.css';

const TrackDetails = ({ track, formatReleaseDate, isStopped }) => {
  if (isStopped) {
    return (
      <div className="spotify-player-track-details">
        <table className="spotify-player-track-details-table">
          <tbody>
            <tr className="spotify-player-track-details-row">
              <td className="spotify-player-track-details-cell spotify-player-key-cell">&nbsp;</td>
            </tr>
            <tr className="spotify-player-track-details-row" style={{ justifyContent: "center" }}>
              <td className="spotify-player-track-details-cell spotify-player-key-cell" style={{ textWrap: "wrap" }}>The device is currently stopped. Please load a playlist or album.</td>
            </tr>
            <tr className="spotify-player-track-details-row">
              <td className="spotify-player-track-details-cell spotify-player-key-cell">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div className="spotify-player-track-details">
      <table className="spotify-player-track-details-table">
        <tbody>
          <tr className="spotify-player-track-details-row">
            <td className="spotify-player-track-details-cell spotify-player-key-cell">Title</td>
            <td className="spotify-player-track-details-cell spotify-player-value-cell">{track?.name || "N/A"}</td>
          </tr>
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
