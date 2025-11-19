import React, { useState, useEffect } from "react";
import "./App.css";

const MAX_GUESSES = 6;

const WORD_BANK = [
  {
    target: "HAPPY",
    synonyms: ["GLAD", "CHEERFUL", "JOYFUL", "MERRY", "ELATED"],
    close: ["CONTENT", "UPBEAT", "SMILING"],
    hint: "Describes someone who feels joy or pleasure."
  },
  {
    target: "ANGRY",
    synonyms: ["MAD", "FURIOUS", "IRATE", "LIVID"],
    close: ["UPSET", "ANNOYED"],
    hint: "A strong feeling of displeasure."
  },
  {
    target: "SMART",
    synonyms: ["BRIGHT", "CLEVER", "ASTUTE", "SHREWD"],
    close: ["WISE", "QUICK"],
    hint: "Good at learning and solving problems."
  }
];

function randomWord() {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

export default function App() {
  const [word, setWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(MAX_GUESSES);
  const [status, setStatus] = useState({ text: "", type: "info" });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  function resetGame() {
    const w = randomWord();
    setWord(w);
    setGuesses([]);
    setRemaining(MAX_GUESSES);
    setGameOver(false);
    setInput("");
    setStatus({ text: "Type a synonym and press Enter.", type: "info" });
  }

  function classifyGuess(guess) {
    const g = guess.trim().toUpperCase();
    if (g === word.target) return "same";
    if (word.synonyms.includes(g)) return "correct";
    if (word.close.includes(g)) return "close";
    return "wrong";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (gameOver) return;

    const guess = input.trim().toUpperCase();
    if (!guess) return;

    const type = classifyGuess(guess);

    const newGuess = { text: guess, result: type };
    setGuesses((prev) => [...prev, newGuess]);

    if (type === "same") {
      setStatus({
        text: "That's the target word. Try a synonym!",
        type: "info"
      });
      setInput("");
      return;
    }

    if (type === "correct") {
      setStatus({ text: "Correct! You win!", type: "win" });
      setGameOver(true);
      return;
    }

    const newRemaining = remaining - 1;
    setRemaining(newRemaining);

    if (newRemaining <= 0) {
      setStatus({
        text: `Out of guesses! The word was "${word.target}".`,
        type: "lose"
      });
      setGameOver(true);
      return;
    }

    if (type === "close") {
      setStatus({
        text: "Close! You're on the right track.",
        type: "info"
      });
    } else {
      setStatus({
        text: "Not quite — try another synonym.",
        type: "info"
      });
    }

    setInput("");
  }

  function tileClass(result) {
    if (result === "correct") return "tile tile-correct";
    if (result === "close") return "tile tile-close";
    if (result === "wrong" || result === "same") return "tile tile-wrong";
    return "tile";
  }

  if (!word) return <h1>Loading...</h1>;

  return (
    <div className="app">
      <h1 className="title">Synonymle</h1>

      <div className="hint-box">
        <div><strong>Target word:</strong> {word.target}</div>
        <div><strong>Hint:</strong> {word.hint}</div>
      </div>

      <div className="board">
        {guesses.map((g, index) => (
          <div className="row" key={index}>
            {g.text.split("").map((ch, i) => (
              <div key={i} className={tileClass(g.result)}>
                {ch}
              </div>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="guess-form">
        <input
          value={input}
          placeholder="Enter a synonym"
          onChange={(e) => setInput(e.target.value)}
          disabled={gameOver}
        />
        <button disabled={gameOver}>Guess</button>
      </form>

      <div className={`status ${status.type}`}>{status.text}</div>
      <div className="remaining">{remaining} guesses remaining</div>

      <button className="new-game" onClick={resetGame}>
        New Word
      </button>
    </div>
  );
}
