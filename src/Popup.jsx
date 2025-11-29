import React from "react";
import "./Popup.css";

function Popup({ message, details, onClose, tall = false }) {
  const stopClick = (e) => e.stopPropagation();

  const lowerMessage = (message || "").toLowerCase();
  const isGameOver = lowerMessage.includes("game over");

  // For non–game-over popups, keep the simple paragraph splitting
  const paragraphs = !isGameOver && details
    ? details.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  // When it's game over, parse details into structured fields
  let solvedLine = "";
  let category = "";
  let oddOneOut = "";
  let solvedCount = null;
  let totalRows = null;

  if (isGameOver && details) {
    const lines = details
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Expecting:
    // 0: "You solved X of Y rows."
    // 1: "Category: Something"
    // 2: "Odd One Out: Something"
    solvedLine = lines[0] || "";

    const match = solvedLine.match(/you solved\s+(\d+)\s+of\s+(\d+)/i);
    if (match) {
      solvedCount = match[1];
      totalRows = match[2];
    }

    const catLine = lines.find((l) => l.toLowerCase().startsWith("category:"));
    const oddLine = lines.find((l) =>
      l.toLowerCase().startsWith("odd one out:")
    );

    if (catLine) {
      category = catLine.replace(/^Category:\s*/i, "");
    }
    if (oddLine) {
      oddOneOut = oddLine.replace(/^Odd One Out:\s*/i, "");
    }
  }

  // Choose icon based on the message
  const getIcon = () => {
    if (isGameOver) return "✕";
    if (lowerMessage.includes("found all")) return "★";
    if (lowerMessage.includes("about")) return "i";
    return "?";
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className={`popup-content ${tall ? "tall" : ""}`}
        onClick={stopClick}
      >
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
          {isGameOver ? (
            <div className="popup-results">
              {solvedLine && (
                <div className="popup-summary">
                  <div className="popup-summary-label">Your result</div>
                  <div className="popup-summary-main">
                    {solvedCount !== null ? (
                      <>
                        <span className="popup-summary-number">
                          {solvedCount}
                        </span>
                        <span className="popup-summary-slash"> / </span>
                        <span className="popup-summary-total">
                          {totalRows}
                        </span>
                        <span className="popup-summary-text">
                          {" "}
                          rows solved
                        </span>
                      </>
                    ) : (
                      solvedLine
                    )}
                  </div>
                </div>
              )}

              <div className="popup-result-card">
                <div className="popup-result-block">
                  <div className="popup-result-label">Category</div>
                  <div className="popup-result-value">{category}</div>
                </div>

                <div className="popup-result-block">
                  <div className="popup-result-label">Odd One Out</div>
                  <div className="popup-result-value popup-result-value-highlight">
                    {oddOneOut}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            paragraphs.map((para, idx) => (
              <p key={idx} className="popup-paragraph">
                {para}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Popup;
