import React from "react";

const TrackDetails = ({ track, formatReleaseDate }) => (
  <div className="track-details">
    <table className="track-details-table">
      <tbody>
        <tr className="track-details-row">
          <td className="track-details-cell key-cell">Title</td>
          <td className="track-details-cell value-cell">{track.name}</td>
        </tr>
        <tr className="track-details-row">
          <td className="track-details-cell key-cell">Artist</td>
          <td className="track-details-cell value-cell">{track.artist_names.join(", ")}</td>
        </tr>
        <tr className="track-details-row">
          <td className="track-details-cell key-cell">Released</td>
          <td className="track-details-cell value-cell">{formatReleaseDate(track.release_date)}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default TrackDetails;
