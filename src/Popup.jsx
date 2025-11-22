import React from "react";
import "./Popup.css";

function Popup({ message, details, onClose }) {
  // Split details into paragraphs on blank lines
  const paragraphs = details
    ? details.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  const stopClick = (e) => e.stopPropagation();

  // Choose icon based on the message
  const getIcon = () => {
    const lower = message.toLowerCase();

    if (lower.includes("game over") || lower.includes("no mistakes")) {
      return "✕"; // X for game over
    }

    if (lower.includes("found all")) {
      return "★"; // star for win (swap to ✔ if you prefer)
    }

    if (lower.includes("about")) {
      return "i"; // info icon for About popup
    }

    return "?"; // default for instructions & others
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={stopClick}>
        {/* HEADER */}
        <div className="popup-header">
          <div className="popup-title-group">
            <div className="popup-icon">{getIcon()}</div>
            <h2 className="popup-message">{message}</h2>
          </div>

          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="popup-details">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="popup-paragraph">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Popup;
