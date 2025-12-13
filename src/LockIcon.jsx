import React from "react";
import "./LockIcon.css";

function LockIcon({ size = "md" }) {
  return (
    <span
      className={`lock-glyph lock-glyph-${size}`}
      aria-hidden="true"
    >
      <span className="lock-glyph-shackle" />
      <span className="lock-glyph-body" />
    </span>
  );
}

export default LockIcon;
