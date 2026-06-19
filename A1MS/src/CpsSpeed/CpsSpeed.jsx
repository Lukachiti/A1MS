import { useState, useRef, useEffect } from "react";
import Navbar from "../AimTrainer/Navbar";
import "./CpsSpeed.css";
import scoreImg from "../assets/score.png";
import timeImg from "../assets/time.png";

function CpsSpeed() {
  const trainingAreaRef = useRef(null);
  const startRef = useRef(null);

  const [clicks, setClicks] = useState(0);
  const [time, setTime] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cpsResult, setCpsResult] = useState(null);
  const [personalBest, setPersonalBest] = useState(0);

  const handleStart = () => {
    if (isActive) return;
    startRef.current.style.display = "none";
    setClicks(0);
    setTimeLeft(time);
    setIsActive(true);
    setIsEditing(false);
    setShowModal(false);
  };

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft === 0) {
      handleStop();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const handleAreaClick = () => {
    if (!isActive) return;
    setClicks((prev) => prev + 1);
  };

  const handleStop = () => {
    setIsActive(false);
    startRef.current.style.display = "block";
    
    setClicks((finalClicks) => {
      const computedCps = (finalClicks / time).toFixed(2);
      setCpsResult(computedCps);

      const savedPb = localStorage.getItem("pb_cps_speed") || 0;
      const currentPb = Math.max(Number(savedPb), Number(computedCps));
      localStorage.setItem("pb_cps_speed", currentPb);
      setPersonalBest(currentPb.toFixed(2));

      setShowModal(true);
      return finalClicks;
    });
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <section id="App-section" className="App-section">
          <div className="ap">
            <div className="info">
              <div className="info-div">
                <img src={timeImg} alt="time"></img>
                <div>
                  <h6>Time:</h6>
                  <h4>
                    {isEditing && !isActive ? (
                      <input
                        type="number"
                        value={time}
                        min="1"
                        max="60"
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          setTime(val);
                          setTimeLeft(val);
                        }}
                        className="custom-input"
                      />
                    ) : (
                      (isActive ? timeLeft : time) + "s"
                    )}
                    {!isActive && (
                      <button
                        className="pencil"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "✓" : "✎"}
                      </button>
                    )}
                  </h4>
                </div>
              </div>

              <div className="info-div">
                <img src={scoreImg} alt="clicks"></img>
                <div>
                  <h6>Clicks:</h6>
                  <h4>{clicks}</h4>
                </div>
              </div>

              <div className="info-div">
                <img src={scoreImg} alt="cps"></img>
                <div>
                  <h6>Current CPS:</h6>
                  <h4>{isActive && clicks > 0 ? (clicks / (time - timeLeft || 1)).toFixed(1) : "0.0"}</h4>
                </div>
              </div>
            </div>

            <div 
              className="trainingArea cps-area" 
              ref={trainingAreaRef}
              onClick={handleAreaClick}
            >
              <button 
                ref={startRef} 
                id="start" 
                className="start" 
                style={{ fontWeight: "900" }} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
              >
                Start
              </button>
              {isActive && <div className="cps-click-overlay">CLICK HERE!</div>}
            </div>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="gameover-modal">
            <h2>TEST COMPLETE</h2>
            <hr className="scoreboard-divider" />
            <div className="modal-stats">
              <div className="modal-stat-row">
                <span>Total Clicks:</span> 
                <span className="stat-val">{clicks}</span>
              </div>
              <div className="modal-stat-row">
                <span>CPS Score:</span> 
                <span className="stat-val Highlight">{cpsResult} Click/s</span>
              </div>
              <div className="modal-stat-row">
                <span>Personal Best:</span> 
                <span className="stat-val">{personalBest} Click/s</span>
              </div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default CpsSpeed;