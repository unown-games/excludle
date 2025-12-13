import React from "react";
import "./Popup.css";
import LockIcon from "./LockIcon";

function Popup({ message, details, onClose, tall = false }) {
  const stopClick = (e) => e.stopPropagation();

  const lowerMessage = (message || "").toLowerCase();
  const isGameOver = lowerMessage.includes("game over");
  const isHowToPlay = lowerMessage.includes("how to play");
  const isAbout = lowerMessage.includes("about");
  const isPrivacy = lowerMessage.includes("privacy");
  const isWin =
    !isGameOver &&
    (lowerMessage.includes("found all") ||
      lowerMessage.includes("solved all") ||
      lowerMessage.includes("you won"));

  // Generic paragraphs only used when NOT game over, not how-to-play, not about
  const paragraphs =
    !isGameOver && !isHowToPlay && !isAbout && !isWin && details
      ? details.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
      : [];

  // ============ HOW TO PLAY PARSING ============
  const instructionParagraphs =
    isHowToPlay && details
      ? details.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
      : [];

  let overview = "";
  let goal = "";
  let exampleText = "";
  let livesText = "";

  if (isHowToPlay) {
    overview = instructionParagraphs[0] || "";
    goal = instructionParagraphs[1] || "";
    const exRow = instructionParagraphs[2] || "";
    const exExplain = instructionParagraphs[3] || "";
    exampleText = [exRow, exExplain].filter(Boolean).join(" ");
    livesText = instructionParagraphs[4] || "";
  }

  // ============ ABOUT PARSING ============
  let aboutOverview = "";
  let aboutReset = "";

  if (isAbout && details) {
    const aboutParts = details
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0);
    aboutOverview = aboutParts[0] || "";
    aboutReset = aboutParts[1] || "";
  }

  // ============ GAME OVER PARSING ============
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

    solvedLine = lines[0] || "";

    const match = solvedLine.match(/you solved\s+(\d+)\s+of\s+(\d+)/i);
    if (match) {
      solvedCount = match[1];
      totalRows = match[2];
    }

    const catLine = lines.find((l) =>
      l.toLowerCase().startsWith("category:")
    );
    const oddLine = lines.find((l) =>
      l.toLowerCase().startsWith("odd one out:")
    );

    if (catLine) category = catLine.replace(/^Category:\s*/i, "");
    if (oddLine) oddOneOut = oddLine.replace(/^Odd One Out:\s*/i, "");
  }

  // ============ WIN PARSING ============
  let winRowsCurrent = null;
  let winRowsTotal = null;
  let winClicks = null;
  let winRowsLine = "";
  let winClicksLine = "";
  let isPerfectWin = false;
  let winMistakesRemaining = null;
  let winMistakesLine = "";

  if (isWin && details) {
    const lines = details
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    winRowsLine = lines.find((l) => l.toLowerCase().startsWith("rows"));
    winClicksLine = lines.find((l) => l.toLowerCase().includes("click"));
    winMistakesLine = lines.find((l) =>
      l.toLowerCase().startsWith("mistakes remaining")
    );
    isPerfectWin = lines.some((l) => /perfect/i.test(l));

    if (winRowsLine) {
      const rowMatch = winRowsLine.match(/(\d+)\s*\/\s*(\d+)/);
      if (rowMatch) {
        winRowsCurrent = rowMatch[1];
        winRowsTotal = rowMatch[2];
      }
    }

    if (winClicksLine) {
      const clickMatch = winClicksLine.match(/(\d+)/);
      if (clickMatch) {
        winClicks = clickMatch[1];
      }
    }

    if (winMistakesLine) {
      const mistakeMatch = winMistakesLine.match(/(\d+)/);
      if (mistakeMatch) {
        winMistakesRemaining = mistakeMatch[1];
      }
    }
  }

  const winAverageClicks =
    winClicks && winRowsTotal
      ? (Number(winClicks) / Number(winRowsTotal)).toFixed(1)
      : null;

  // Icon
  const getIcon = () => {
    if (isGameOver) return "✕";
    if (isHowToPlay) return "?";
    if (isAbout) return "i";
    if (isWin) return "★";
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
            <div className={`popup-icon ${isPrivacy ? "popup-icon-lock" : ""}`}>
              {isPrivacy ? <LockIcon size="lg" /> : getIcon()}
            </div>
            <h2 className="popup-message">{message}</h2>
          </div>

          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="popup-details">
          {/* ========== GAME OVER ========== */}
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
          ) : 

          /* ========== HOW TO PLAY ========== */
          isHowToPlay ? (
            <div className="popup-results">
              {goal && (
                <div className="popup-summary">
                  <div className="popup-summary-label">Objective</div>
                  <div className="popup-summary-main">{goal}</div>
                </div>
              )}

              <div className="popup-result-card">
                {overview && (
                  <div className="popup-result-block">
                    <div className="popup-result-label">Overview</div>
                    <div className="popup-result-value">{overview}</div>
                  </div>
                )}

                {exampleText && (
                  <div className="popup-result-block">
                    <div className="popup-result-label">Example</div>
                    <div className="popup-result-value">{exampleText}</div>
                  </div>
                )}

                {livesText && (
                  <div className="popup-result-block">
                    <div className="popup-result-label">Lives & mistakes</div>
                    <div className="popup-result-value">{livesText}</div>
                  </div>
                )}
              </div>
            </div>
          ) :

          /* ========== ABOUT ========== */
          isAbout ? (
            <div className="popup-results">
              <div className="popup-summary">
                <div className="popup-summary-label">About this game</div>
                <div className="popup-summary-main">Daily Odd-One-Out</div>
              </div>

              <div className="popup-result-card">
                <div className="popup-result-block">
                  <div className="popup-result-label">Overview</div>
                  <div className="popup-result-value">{aboutOverview}</div>
                </div>

                <div className="popup-result-block">
                  <div className="popup-result-label">Daily reset</div>
                  <div className="popup-result-value">{aboutReset}</div>
                </div>
              </div>
            </div>
          ) :

          /* ========== WIN STATE ========== */
          isWin ? (
            <div className="popup-results">
              <div className="popup-summary">
                <div className="popup-summary-label">Daily stats</div>
                <div className="popup-summary-main">
                  {winClicks ? `${winClicks} clicks to solve` : "Completed"}
                </div>
                {winRowsCurrent && winRowsTotal && (
                  <div className="popup-summary-text">
                    Rows solved: {winRowsCurrent}/{winRowsTotal}
                  </div>
                )}
              </div>

              <div className="popup-result-card popup-result-card-win">
                {winAverageClicks && (
                  <div className="popup-result-block">
                    <div className="popup-result-label">Avg clicks per row</div>
                    <div className="popup-result-value">
                      {winAverageClicks}
                    </div>
                  </div>
                )}

                <div className="popup-result-block">
                  <div className="popup-result-label">Lives left</div>
                  <div className="popup-result-value popup-result-value-hearts">
                    {winMistakesRemaining !== null ? (
                      [...Array(Number(winMistakesRemaining))].map((_, idx) => (
                        <span key={idx} className="popup-heart">
                          ♥
                        </span>
                      ))
                    ) : isPerfectWin ? (
                      <span className="popup-heart">♥♥♥</span>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              </div>

              {isPerfectWin && (
                <div className="popup-perfect-banner">
                  🎯 Zero mistakes — flawless victory!
                </div>
              )}
            </div>
          ) :

          /* ========== OTHER (fallback) ========== */
          paragraphs.map((para, idx) => (
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
