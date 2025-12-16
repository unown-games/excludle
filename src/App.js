import React, { useState } from "react";
import "./App.css";
import wordBank from "./word_bank";
import Popup from "./Popup";
import LockIcon from "./LockIcon";

const ROWS_PER_GAME = 4;
const MAX_MISTAKES = 3;
const USE_CACHING = false; // Toggle to false to disable caching for testing

/**
 * Simple seeded RNG (Mulberry32)
 */
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle with a provided RNG function.
 */
function shuffleWithRng(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get "today" in America/New_York and compute a game number.
 * Game #1 = launch day (set below). Each day after increments by 1.
 */
function getGameInfo() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year").value);
  const month = Number(parts.find((p) => p.type === "month").value);
  const day = Number(parts.find((p) => p.type === "day").value);

  const estToday = new Date(year, month, day);

  const launchDate = new Date(2025, 12, 12);
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((estToday - launchDate) / oneDayMs);

  const baseGameNumber = 1;
  const gameNumber = baseGameNumber + Math.max(diffDays, 0);

  return { gameNumber };
}

/**
 * Build today's rows by walking down the word bank.
 * Day 1 => games[0..3], Day 2 => games[4..7], etc.
 */
function buildRows(gameNumber) {
  const allGames = [...wordBank.games];

  const startIndex = (gameNumber - 1) * ROWS_PER_GAME;
  let selected = allGames.slice(startIndex, startIndex + ROWS_PER_GAME);

  // If we ever run out of data (e.g., not enough rows),
  // fall back to the first 4 as a safety.
  if (selected.length < ROWS_PER_GAME) {
    selected = allGames.slice(0, ROWS_PER_GAME);
  }

  // Use a seeded RNG based on gameNumber to shuffle cards
  const rng = mulberry32(gameNumber);

  return selected.map((g) => {
    const cards = shuffleWithRng(
      [
        { text: g.word1, isImposter: false },
        { text: g.word2, isImposter: false },
        { text: g.word3, isImposter: false },
        { text: g.word4, isImposter: false },
        { text: g.imposter, isImposter: true }
      ],
      rng
    );

    return {
      category: g.category,
      cards,
      solved: false,
      selectedIndex: null,
      wrongIndices: []
    };
  });
}

/**
 * Get the cached game state from localStorage
 */
function getCachedGameState(gameNumber) {
  if (!USE_CACHING) return null;
  try {
    const cached = localStorage.getItem(`excludle_game_${gameNumber}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error("Error reading from localStorage:", e);
  }
  return null;
}

/**
 * Save the game state to localStorage
 */
function saveGameState(gameNumber, state) {
  if (!USE_CACHING) return;
  try {
    localStorage.setItem(`excludle_game_${gameNumber}`, JSON.stringify(state));
  } catch (e) {
    console.error("Error writing to localStorage:", e);
  }
}

function buildWinDetails(totalClicks, mistakesRemaining, rowScores) {
  const totalScore = rowScores.reduce((sum, score) => sum + score, 0);
  const lines = [
    `Rows cleared: ${ROWS_PER_GAME}/${ROWS_PER_GAME}`,
    `Total clicks: ${totalClicks}`,
    `Total score: ${totalScore} points`
  ];
  if (typeof mistakesRemaining === "number") {
    lines.push(`Mistakes remaining: ${mistakesRemaining}`);
  }
  if (totalClicks === ROWS_PER_GAME) {
    lines.push("Perfect Game!");
  }
  return lines.join("\n");
}

function App() {
  const { gameNumber } = getGameInfo();

  // Initialize state from cache or defaults
  const cachedState = getCachedGameState(gameNumber);
  
  const [rows, setRows] = useState(() => 
    cachedState ? cachedState.rows : buildRows(gameNumber)
  );
  const [mistakesLeft, setMistakesLeft] = useState(
    cachedState ? cachedState.mistakesLeft : MAX_MISTAKES
  );
  const [message, setMessage] = useState(
    cachedState && cachedState.completed ? "You solved all 4 rows!" : ""
  );
  const [gameOver, setGameOver] = useState(cachedState ? cachedState.gameOver : false);
  const [finishedAllRows, setFinishedAllRows] = useState(cachedState ? cachedState.finishedAllRows : false);
  const [currentCategory, setCurrentCategory] = useState(cachedState ? (cachedState.currentCategory || "") : "");
  const [categoryRowIndex, setCategoryRowIndex] = useState(
    cachedState ? (cachedState.categoryRowIndex !== undefined ? cachedState.categoryRowIndex : null) : null
  );
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDetails, setPopupDetails] = useState("");
  const [rowScores, setRowScores] = useState(cachedState ? (cachedState.rowScores || [0, 0, 0, 0]) : [0, 0, 0, 0]);
  const [continuedAfterGameOver, setContinuedAfterGameOver] = useState(cachedState ? (cachedState.continuedAfterGameOver || false) : false);

  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Handle closing the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleKeepTrying = () => {
    // Mark the current failed row as "solved" so we skip to the next row
    setRows(prevRows => {
      const newRows = prevRows.map((row, idx) => {
        if (idx === activeRowIndex) {
          // Mark as solved even though they didn't complete it
          return { ...row, solved: true };
        }
        return row;
      });
      return newRows;
    });

    // Set all unsolved rows (including the one we just marked) to 0 points
    setRowScores(prevScores => {
      const newScores = [...prevScores];
      rows.forEach((row, idx) => {
        if (!row.solved || idx === activeRowIndex) {
          newScores[idx] = 0;
        }
      });
      return newScores;
    });

    setContinuedAfterGameOver(true);
    setGameOver(false);
    setMistakesLeft(Infinity); // No life limit after continuing
    setMessage("Keep going! No life limit.");
    setShowPopup(false);

    // Clear the category banner from the failed row
    setCurrentCategory("");
    setCategoryRowIndex(null);

    // Save the updated state with the failed row marked as solved
    const updatedRows = rows.map((row, idx) => {
      if (idx === activeRowIndex) {
        return { ...row, solved: true };
      }
      return row;
    });

    saveGameState(gameNumber, {
      rows: updatedRows,
      mistakesLeft: Infinity,
      currentCategory: "",
      categoryRowIndex: null,
      completed: false,
      finishedAllRows: false,
      gameOver: false,
      rowScores: rowScores.map((score, idx) => rows[idx].solved || idx === activeRowIndex ? 0 : score),
      continuedAfterGameOver: true
    });
  };
  
  // If game was already completed or in progress, show appropriate UI on mount
  React.useEffect(() => {
    if (cachedState) {
      if (cachedState.completed || cachedState.finishedAllRows) {
        const details = buildWinDetails(
          cachedState.totalClicks || ROWS_PER_GAME,
          cachedState.mistakesLeft ?? MAX_MISTAKES,
          cachedState.rowScores || [0, 0, 0, 0]
        );
        setPopupMessage("You found all the imposters!");
        setPopupDetails(details);
        setShowPopup(true);
      } else if (cachedState.gameOver) {
        setPopupMessage("Game over");
        setPopupDetails(cachedState.popupDetails || "");
        setShowPopup(true);
      }
    }
  }, []);

  const activeRowIndex = rows.findIndex((r) => !r.solved);

  // Hearts for lives
  const renderLives = () => {
    // If continued after game over, show infinity symbol instead of hearts
    if (continuedAfterGameOver) {
      return <span className="life-icon life-infinite">∞</span>;
    }

    const hearts = [];
    for (let i = 0; i < MAX_MISTAKES; i++) {
      const full = i < mistakesLeft;
      hearts.push(
        <span
          key={i}
          className={`life-icon ${full ? "life-full" : "life-empty"}`}
        >
          {full ? "♥" : "♡"}
        </span>
      );
    }
    return hearts;
  };

  const handleCardClick = (rowIndex, cardIndex) => {
    if (gameOver || finishedAllRows) return;
    if (rowIndex !== activeRowIndex) return;

    setRows((prevRows) => {
      let newRows = prevRows;
      let newMistakesValue = mistakesLeft;

      const newRows2 = prevRows.map((row, idx) => {
        if (idx !== rowIndex) return row;

        const card = row.cards[cardIndex];

        if (row.selectedIndex !== null || row.wrongIndices.includes(cardIndex)) {
          return row;
        }

        if (card.isImposter) {
          const updatedRow = {
            ...row,
            solved: true,
            selectedIndex: cardIndex
          };

          // Calculate points based on number of failures
          const failures = row.wrongIndices.length;
          let pointsEarned = 0;
          if (continuedAfterGameOver) {
            pointsEarned = 0; // No points after continuing
          } else if (failures === 0) {
            pointsEarned = 100;
          } else if (failures === 1) {
            pointsEarned = 75;
          } else if (failures === 2) {
            pointsEarned = 50;
          } else {
            pointsEarned = 0; // 3+ failures (shouldn't happen with 3 lives)
          }

          // Add points to the row score
          setRowScores(prevScores => {
            const newScores = [...prevScores];
            newScores[rowIndex] = pointsEarned;
            return newScores;
          });

          setCurrentCategory(row.category);
          setCategoryRowIndex(rowIndex);

          const tempRows = prevRows.map((r, i2) =>
            i2 === rowIndex ? updatedRow : r
          );
          newRows = tempRows;
          const allSolved = tempRows.every((r) => r.solved);

          if (allSolved) {
            setFinishedAllRows(true);

            const totalClicks = tempRows.reduce(
              (acc, r) => acc + 1 + r.wrongIndices.length,
              0
            );

            // Get updated scores with the current row's points
            const updatedScores = [...rowScores];
            updatedScores[rowIndex] = pointsEarned;

            const details = buildWinDetails(totalClicks, mistakesLeft, updatedScores);

            setPopupMessage("You found all the imposters!");
            setPopupDetails(details);
            setShowPopup(true);
            setMessage("You solved all 4 rows!");
            
            // Cache the full game state with completion info
            saveGameState(gameNumber, {
              rows: tempRows,
              mistakesLeft: mistakesLeft,
              currentCategory: row.category,
              categoryRowIndex: rowIndex,
              completed: true,
              finishedAllRows: true,
              gameOver: false,
              totalClicks: totalClicks,
              isPerfect: totalClicks === ROWS_PER_GAME,
              popupDetails: details,
              rowScores: updatedScores,
              continuedAfterGameOver: continuedAfterGameOver
            });
          } else {
            setMessage("Nice! Move on to the next row.");
            // Cache the current progress
            const updatedScores = [...rowScores];
            updatedScores[rowIndex] = pointsEarned;
            
            saveGameState(gameNumber, {
              rows: tempRows,
              mistakesLeft: mistakesLeft,
              currentCategory: row.category,
              categoryRowIndex: rowIndex,
              completed: false,
              finishedAllRows: false,
              gameOver: false,
              rowScores: updatedScores,
              continuedAfterGameOver: continuedAfterGameOver
            });
          }

          return updatedRow;
        } else {
          const updatedWrongIndices = [...row.wrongIndices, cardIndex];
          const updatedRow = {
            ...row,
            wrongIndices: updatedWrongIndices
          };

          const newMistakes = mistakesLeft - 1;
          newMistakesValue = newMistakes;
          setMistakesLeft(newMistakes);

          // Only trigger game over if they haven't continued after a previous game over
          if (newMistakes <= 0 && !continuedAfterGameOver) {
            setGameOver(true);

            // Status line in footer
            setMessage("Game Over! Try again tomorrow.");

            const correctRows = prevRows.filter((r) => r.solved).length;
            const lostCategory = row.category;
            const lostImposter =
              row.cards.find((c) => c.isImposter)?.text || "";

            // Calculate total score for game over popup (current scores, no addition for failed row)
            const totalScore = rowScores.reduce((sum, score) => sum + score, 0);

            const popupDetailsText =
              `You solved ${correctRows} of ${ROWS_PER_GAME} rows.\n\n` +
              `Total score: ${totalScore} points\n\n` +
              `Category: ${lostCategory}\n\n` +
              `Odd One Out: ${lostImposter}`;

            setPopupMessage("Game over");
            setPopupDetails(popupDetailsText);
            setShowPopup(true);
            // keep the category visible on loss so the yellow banner still shows
            setCurrentCategory(lostCategory);
            setCategoryRowIndex(rowIndex);
            
            // Cache the game over state with the updated rows from the map
            saveGameState(gameNumber, {
              rows: prevRows.map((r, i) => i === rowIndex ? updatedRow : r),
              mistakesLeft: newMistakes,
              currentCategory: lostCategory,
              categoryRowIndex: rowIndex,
              completed: false,
              finishedAllRows: false,
              gameOver: true,
              popupDetails: popupDetailsText,
              rowScores: rowScores,
              continuedAfterGameOver: continuedAfterGameOver
            });
          } else {
            setMessage("Nope. Try a different option in this row.");
            
            // Cache the current progress with the updated rows from the map
            saveGameState(gameNumber, {
              rows: prevRows.map((r, i) => i === rowIndex ? updatedRow : r),
              mistakesLeft: newMistakes,
              currentCategory: currentCategory,
              categoryRowIndex: categoryRowIndex,
              completed: false,
              finishedAllRows: false,
              gameOver: false,
              rowScores: rowScores,
              continuedAfterGameOver: continuedAfterGameOver
            });
          }

          return updatedRow;
        }
      });

      return newRows2;
    });
  };

  const handleShowInstructions = () => {
    setShowMenu(false);

    const instructions = `Excludle is a word game. Each row hides a category (like "Things you can roast" or "Types of vehicles") and shows five words.

Your job: tap the one word that DOESN'T belong in that hidden category – the imposter.

Example row:
Dog • Cat • Car • Horse • Bird

The secret category is "Animals", so "Car" is the imposter.

You only get ${MAX_MISTAKES} lives. Each wrong guess costs one heart. When you run out of lives, the game ends.

Scoring:
• Correct on first try: +100 points
• Correct with 1 mistake: +75 points
• Correct with 2 mistakes: +50 points
• Correct after continuing: +0 points`;

    setPopupMessage("How to play");
    setPopupDetails(instructions);
    setShowPopup(true);
  };

  const handleShowAbout = () => {
    setShowMenu(false);

    const about = `Excludle is a simple "odd one out" guessing game inspired by daily word and logic games.

Each day at midnight (US Eastern Time), a new set of rows and categories appears. Game #1 is the first day, and the number increases by 1 each day.`;

    setPopupMessage("About Excludle");
    setPopupDetails(about);
    setShowPopup(true);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    setShowMenu(false);
  };

  const handleShowPrivacy = () => {
    setShowMenu(false);

    const privacyPolicy = `Excludle is designed to be a lightweight daily puzzle. We do not ask you to create an account or submit personal information to play.

Saved progress: Your puzzle history, remaining lives, and theme preference are stored only in your browser's local storage so you can resume a game later.

Cookies & ads: We display third-party ads (Google AdSense) that may set cookies or similar technologies to deliver and measure advertising. Refer to Google's policies for details on how they process that data.

Analytics & diagnostics: We may collect aggregated, anonymous usage metrics (such as error logs or device type) to keep the experience stable and improve the game. These metrics cannot identify you individually.

Children: Excludle is a casual word puzzle but is not directed at children under 13, and we do not knowingly collect information from them.

Questions or requests: Contact the developer at privacy@excludle.com and we will respond as soon as possible.`;

    setPopupMessage("Privacy Policy");
    setPopupDetails(privacyPolicy);
    setShowPopup(true);
  };

  return (
    <div className={`app-root ${darkMode ? "dark" : ""}`}>
      <main className="game-container">
        <div className="content-wrap">
          {/* HEADER: title + menu + subtitle */}
          <header className="header">
            <div className="header-top">
              <h1 className="game-title">
                E<span className="letter-x">x</span>clu<span className="green-d">d</span>le
              </h1>

              <button
                className="menu-button"
                onClick={() => setShowMenu((prev) => !prev)}
                aria-label="Game menu"
              >
                ⋮
              </button>

              {showMenu && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={handleShowInstructions}
                  >
                    <span className="dropdown-icon">?</span>
                    <span className="dropdown-label">How to play</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleToggleDarkMode}
                  >
                    <span className="dropdown-icon">
                      {darkMode ? "☀" : "☾"}
                    </span>
                    <span className="dropdown-label">
                      {darkMode ? "Light mode" : "Dark mode"}
                    </span>
                  </button>
                  <button className="dropdown-item" onClick={handleShowAbout}>
                    <span className="dropdown-icon">i</span>
                    <span className="dropdown-label">About</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleShowPrivacy}
                  >
                    <span className="dropdown-icon">
                      <LockIcon size="sm" />
                    </span>
                    <span className="dropdown-label">Privacy Policy</span>
                  </button>
                </div>
              )}
            </div>

            <div className="subtitle">
              Find the odd one out in each row.
            </div>
          </header>

          {/* BOARD: category banner + rows */}
          <div className="board">
            <div className="rows-container">
              {rows.map((row, rowIndex) => {
                const isActive =
                  rowIndex === activeRowIndex &&
                  !gameOver &&
                  !finishedAllRows;
                const isFuture =
                  !row.solved &&
                  rowIndex > activeRowIndex &&
                  !finishedAllRows;

                // Show category banner if it's the current active one, or if game is over/finished and row is solved
                const showCategoryBanner = (currentCategory && categoryRowIndex === rowIndex) || 
                                          ((gameOver || finishedAllRows) && row.solved);

                return (
                  <section key={rowIndex} className="row-block">
                    {showCategoryBanner && (
                      <div className="category-banner" key={`${rowIndex}-${row.category}`}>
                        <h2 className="category-banner-title">
                          {"Category: " + row.category}
                        </h2>
                      </div>
                    )}
                    <div className="cards-row">
                      {row.cards.map((card, cardIndex) => {
                        const isSelected = row.selectedIndex === cardIndex;
                        const isWrong = row.wrongIndices.includes(cardIndex);

                        const disabled =
                          gameOver ||
                          finishedAllRows ||
                          row.solved ||
                          !isActive;

                        const showText = !isFuture;

                        let cardClass = "card";
                        if (isSelected) cardClass += " correct";
                        else if (isWrong) cardClass += " wrong";
                        if (disabled) cardClass += " disabled";
                        if (isFuture) cardClass += " future";

                        return (
                          <button
                            key={cardIndex}
                            className={cardClass}
                            onClick={() => handleCardClick(rowIndex, cardIndex)}
                          >
                            {showText ? card.text : ""}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* FOOTER ROW: Game # (left) | Message (center) | Score & Lives (right) */}
          <footer className="footer-bar">
            <div className="game-number">Game #{gameNumber}</div>

            <div className="footer-message">{message}</div>

            <div className="footer-right">
              <div className="score-display">
                Score: {rowScores.reduce((sum, score) => sum + score, 0)}
              </div>
              <div className="lives-row">
                <span className="lives-label">Lives:</span>
                {renderLives()}
              </div>
            </div>
          </footer>
        </div>
      </main>

      {showPopup && (
        <Popup
          message={popupMessage}
          details={popupDetails}
          onClose={handleClosePopup}
          onKeepTrying={gameOver && !finishedAllRows && activeRowIndex < ROWS_PER_GAME - 1 ? handleKeepTrying : null}
          tall={popupMessage && /game over|how to play/i.test(popupMessage)}
        />
      )}
    </div>
  );
}

export default App;