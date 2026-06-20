import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ScoreBoard from "./ScoreBoard";
import "./App.css";
import categoryImg from "../assets/category.png";
import difficultyImg from "../assets/difficulty.png";
import scoreImg from "../assets/score.png";
import timeImg from "../assets/time.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";

function App() {
  const trainingAreaRef = useRef(null);
  const targetRef = useRef(null);
  const startRef = useRef(null);

  const [scoreArray, setScoreArray] = useState(() => {
    const savedScores = localStorage.getItem("aim_trainer_scores");
    return savedScores ? JSON.parse(savedScores) : [];
  });
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState("Beginner");
  const [difficulty, setDifficulty] = useState(100);
  const [time, setTime] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStats, setModalStats] = useState(null);
  const [personalBest, setPersonalBest] = useState(() => {
    return Number(localStorage.getItem("pb_aim_trainer")) || 0;
  });

  const handleStart = () => {
    if (isActive) return;
    startRef.current.style.display = "none";
    setScore(0);
    setIsActive(true);
    setIsEditing(false);
    setShowModal(false);
    document
      .getElementById("App-section")
      .scrollIntoView({ behavior: "smooth" });

    if (trainingAreaRef.current) trainingAreaRef.current.focus();

    if (targetRef.current) {
      targetRef.current.style.display = "block";
      targetRef.current.style.width = `${difficulty}px`;
      targetRef.current.style.height = `${difficulty}px`;
      targetRef.current.style.transition = `0.5`;
      targetRef.current.style.left = "50%";
      targetRef.current.style.top = "50%";
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      handleStop();
    }, time * 1000);

    return () => clearTimeout(timer);
  }, [isActive, time]);

  const handleHit = () => {
    setScore((prevScore) => prevScore + 1);
    
    const trainingArea = trainingAreaRef.current;
    const target = targetRef.current;

    if (trainingArea && target) {
      const maxX = trainingArea.clientWidth - target.clientWidth;
      const maxY = trainingArea.clientHeight - target.clientHeight;
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);

      target.style.left = `${randomX}px`;
      target.style.top = `${randomY}px`;
    }
  };

  const handleStop = () => {
    setIsActive(false);

    if (targetRef.current) {
      targetRef.current.style.display = "none";
    }
    
    startRef.current.style.display = "block";
    setScore((finalScore) => {
      const savedPb = localStorage.getItem("pb_aim_trainer") || 0;
      const currentPb = Math.max(Number(savedPb), finalScore);
      localStorage.setItem("pb_aim_trainer", currentPb);
      setPersonalBest(currentPb);

      setModalStats({
        score: finalScore,
        category: category,
        time: time,
        size: difficulty
      });
      setShowModal(true);

      setScoreArray((prevArray) => {
        const updatedArray = [
          ...prevArray,
          { score: finalScore, category: category, date: new Date().toLocaleDateString() },
        ];
        localStorage.setItem("aim_trainer_scores", JSON.stringify(updatedArray));
        return updatedArray;
      });

      return finalScore;
    });
  };

  const dropdownToggleStyle = {
    background: "black",
    border: "1px solid #91ff00",
    borderRadius: "4px",
    color: "#91ff00",
    padding: "4px 12px",
    fontWeight: "800",
    fontSize: "14px"
  };

  const dropdownMenuStyle = {
    background: "#121612",
    border: "1px solid #91ff00",
    borderRadius: "6px",
    padding: "4px 0",
    minWidth: "140px"
  };

  const dropdownItemStyle = {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    fontFamily: "Consolas, Menlo, Monaco, monospace",
    fontSize: "14px",
    padding: "8px 16px",
    textAlign: "left",
    width: "100%"
  };

  const handleItemHover = (e, isHover) => {
    e.target.style.background = isHover ? "rgba(145, 255, 0, 0.1)" : "transparent";
    e.target.style.color = isHover ? "#91ff00" : "#ffffff";
  };

  return (
    <>
      <Navbar
        setCategory={isActive ? () => {} : setCategory}
        setDifficulty={isActive ? () => {} : setDifficulty}
        setTime={isActive ? () => {} : setTime}
        handleStart={handleStart}
        setShowScoreboard={setShowScoreboard}
        showScoreboard={showScoreboard}
      />
      <div className="App">
        <Hero></Hero>
        <section id="App-section" className="App-section">
          
          <div className="ap">
            <div className="info">
              <div className="info-div">
                <img src={difficultyImg} alt="category"></img>
                <div>
                  <Dropdown className="drop" drop="up">
                    <Dropdown.Toggle 
                      style={dropdownToggleStyle} 
                      className="nav-button" 
                      variant="success" 
                      id="dropdown-basic"
                    >
                      Presets
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={dropdownMenuStyle}>
                      <Dropdown.Item
                        as="button"
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                        onClick={() => {
                          setCategory("Beginner");
                          setDifficulty(100);
                          setTime(10);
                        }}
                      >
                        Beginner
                      </Dropdown.Item>
                      
                      <Dropdown.Item
                        as="button"
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                        onClick={() => {
                          setCategory("Intermediate");
                          setDifficulty(50);
                          setTime(20);
                        }}
                      >
                        Intermediate
                      </Dropdown.Item>
                      
                      <Dropdown.Item
                        as="button"
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                        onClick={() => {
                          setCategory("Advanced");
                          setDifficulty(30);
                          setTime(30);
                        }}
                      >
                        Advanced
                      </Dropdown.Item>
                      
                      <Dropdown.Item
                        as="button"
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                        onClick={() => {
                          setCategory("Custom");
                        }}
                      >
                        Custom
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <h4>{category}</h4>
                </div>
              </div>

              <div className="info-div">
                <img src={timeImg} alt="time"></img>
                <div>
                  <h6>Time:</h6>
                  <h4>
                    {isEditing && category === "Custom" && !isActive ? (
                      <input
                        type="number"
                        value={time}
                        min="5"
                        max="300"
                        onChange={(e) =>
                          setTime(Math.max(5, Number(e.target.value)))
                        }
                        className="custom-input"
                      />
                    ) : (
                      time + "s"
                    )}
                    {category === "Custom" && !isActive && (
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
                <img src={scoreImg} alt="score"></img>
                <div>
                  <h6>Score:</h6>
                  <h4>{score}</h4>
                </div>
              </div>

              <div className="info-div">
                <img src={categoryImg} alt="target size"></img>
                <div>
                  <h6>Target Size:</h6>
                  <h4>
                    {isEditing && category === "Custom" && !isActive ? (
                      <input
                        type="number"
                        value={difficulty}
                        min="10"
                        max="160"
                        onChange={(e) =>
                          setDifficulty(Math.min(160, Math.max(10, Number(e.target.value))))
                        }
                        className="custom-input"
                      />
                    ) : (
                      difficulty
                    )}
                    {category === "Custom" && !isActive && (
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
            </div>
            <div className="trainingArea" ref={trainingAreaRef}>
              <button ref={startRef} id="start" className="start" style={{fontWeight: "900"}} onClick={handleStart}>Start</button>
              <div
                onClick={handleHit}
                className="target"
                style={{
                  width: `${difficulty}px`,
                  height: `${difficulty}px`,
                  display: "none",
                }}
                ref={targetRef}
              ></div>
            </div>
            
          </div>
          <ScoreBoard scoreArray={scoreArray}></ScoreBoard>
        </section>
      </div>

      {showModal && modalStats && (
        <div className="modal-overlay">
          <div className="gameover-modal">
            <h2>GAME OVER</h2>
            <hr className="scoreboard-divider" />
            <div className="modal-stats">
              <div className="modal-stat-row"><span>Category:</span> <span className="stat-val">{modalStats.category}</span></div>
              <div className="modal-stat-row"><span>Final Score:</span> <span className="stat-val Highlight">{modalStats.score}</span></div>
              <div className="modal-stat-row"><span>Personal Best:</span> <span className="stat-val">{personalBest}</span></div>
              <div className="modal-stat-row"><span>Duration:</span> <span className="stat-val">{modalStats.time}s</span></div>
              <div className="modal-stat-row"><span>Target Size:</span> <span className="stat-val">{modalStats.size}px</span></div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;