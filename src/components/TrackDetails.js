import React from "react";

const TrackDetails = ({ track, formatReleaseDate }) => (
  <div className="spotify-player-track-details">
    <table className="spotify-player-track-details-table">
      <tbody>
        <tr className="spotify-player-track-details-row">
          <td className="track-details-cell key-cell">Title</td>
          <td className="track-details-cell value-cell">{track?.name || "N/A"}</td>
        </tr>
        <tr className="spotify-player-track-details-row">
          <td className="track-details-cell key-cell">Artist</td>
          <td className="track-details-cell value-cell">{track?.artist_names?.join(", ") || "N/A"}</td>
        </tr>
        <tr className="spotify-player-track-details-row">
          <td className="track-details-cell key-cell">Released</td>
          <td className="track-details-cell value-cell">{track?.release_date ? formatReleaseDate(track.release_date) : "N/A"}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default TrackDetails;
