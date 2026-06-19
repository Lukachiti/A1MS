import { useState, useRef } from "react";
import Navbar from "../AimTrainer/Navbar";
import "./ReactionSpeed.css";
import timeImg from "../assets/time.png";

function ReactionSpeed() {
  const [gameState, setGameState] = useState("idle");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [personalBest, setPersonalBest] = useState(null);
  const timerRef = useRef(null);

  const startTest = () => {
    setGameState("waiting");
    setShowModal(false);
    
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;

    timerRef.current = setTimeout(() => {
      setGameState("clickMe");
      setStartTime(Date.now());
    }, randomDelay);
  };

  const handleAreaClick = () => {
    if (gameState === "waiting") {
      clearTimeout(timerRef.current);
      setGameState("idle");
      alert("Too early! Click to try again.");
    } else if (gameState === "clickMe") {
      const finalTime = Date.now() - startTime;
      setReactionTime(finalTime);
      setGameState("results");

      const savedPb = localStorage.getItem("pb_reaction_speed");
      let currentPb = finalTime;
      if (savedPb !== null) {
        currentPb = Math.min(Number(savedPb), finalTime);
      }
      localStorage.setItem("pb_reaction_speed", currentPb);
      setPersonalBest(currentPb);
      setShowModal(true);
    } else if (gameState === "results" || gameState === "idle") {
      startTest();
    }
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <section id="App-section" className="App-section">
          <div className="ap">
            <div className="info">
              <div className="info-div">
                <img src={timeImg} alt="type" />
                <div>
                  <h6>Test Type:</h6>
                  <h4>Reaction</h4>
                </div>
              </div>
              <div className="info-div">
                <img src={timeImg} alt="result" />
                <div>
                  <h6>Last Result:</h6>
                  <h4>{reactionTime ? reactionTime + "ms" : "---"}</h4>
                </div>
              </div>
            </div>

            <div 
              className={`trainingArea reaction-box ${gameState}`} 
              onClick={handleAreaClick}
            >
              <h2 className="reaction-text">
                {gameState === "idle" && "CLICK ANYWHERE TO START"}
                {gameState === "waiting" && "WAIT FOR GREEN..."}
                {gameState === "clickMe" && "CLICK!!!"}
                {gameState === "results" && "CLICK TO TRY AGAIN"}
              </h2>
            </div>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="gameover-modal">
            <h2>REACTION TIME</h2>
            <hr className="scoreboard-divider" />
            <div className="modal-stats">
              <div className="modal-stat-row">
                <span>Result:</span> 
                <span className="stat-val Highlight">{reactionTime}ms</span>
              </div>
              <div className="modal-stat-row">
                <span>Personal Best:</span> 
                <span className="stat-val">{personalBest}ms</span>
              </div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReactionSpeed;