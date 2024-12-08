import React from "react";

const TrackDetails = ({ track, formatReleaseDate, isStopped }) => {
  if (isStopped) {
    return (
      <div className="spotify-player-track-details">
        <table className="spotify-player-track-details-table">
          <tbody>
            <tr className="spotify-player-track-details-row">
              <td className="track-details-cell key-cell">&nbsp;</td>
            </tr>
            <tr className="spotify-player-track-details-row" style={{ justifyContent: "center" }}>
              <td className="track-details-cell key-cell" style={{ textWrap: "wrap" }}>The device is currently stopped. Please load a playlist or album.</td>
            </tr>
            <tr className="spotify-player-track-details-row">
              <td className="track-details-cell key-cell">&nbsp;</td>
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
  )
}

export default TrackDetails;
