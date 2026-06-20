import { useState, useRef, useEffect } from "react";
import Navbar from "../AimTrainer/Navbar";
import "./AimTrackTrainer.css";
import categoryImg from "../assets/category.png";
import difficultyImg from "../assets/difficulty.png";
import scoreImg from "../assets/score.png";
import timeImg from "../assets/time.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";

function AimTrackTrainer() {
  const trainingAreaRef = useRef(null);
  const targetRef = useRef(null);
  const startRef = useRef(null);
  const animationRef = useRef(null);

  const [score, setScore] = useState(0);
  const [category, setCategory] = useState("Beginner");
  const [difficulty, setDifficulty] = useState(100); 
  const [speed, setSpeed] = useState(2); 
  const [time, setTime] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [personalBest, setPersonalBest] = useState(() => {
    return Number(localStorage.getItem("pb_aim_track")) || 0;
  });

  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 2, y: 2 });
  const isTrackingRef = useRef(false);

  const handleStart = () => {
    if (isActive) return;
    startRef.current.style.display = "none";
    setScore(0);
    setTimeLeft(time);
    setIsActive(true);
    setIsEditing(false);
    setShowModal(false);

    if (targetRef.current && trainingAreaRef.current) {
      targetRef.current.style.display = "block";
      
      const startX = (trainingAreaRef.current.clientWidth - difficulty) / 2;
      const startY = (trainingAreaRef.current.clientHeight - difficulty) / 2;
      positionRef.current = { x: startX, y: startY };
      
      const angle = Math.random() * Math.PI * 2;
      velocityRef.current = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const moveTarget = () => {
      const area = trainingAreaRef.current;
      const target = targetRef.current;
      if (!area || !target) return;

      let { x, y } = positionRef.current;
      let { x: vx, y: vy } = velocityRef.current;

      x += vx;
      y += vy;

      const maxX = area.clientWidth - difficulty;
      const maxY = area.clientHeight - difficulty;

      if (x <= 0 || x >= maxX) {
        vx = -vx;
        x = Math.max(0, Math.min(x, maxX));
      }
      if (y <= 0 || y >= maxY) {
        vy = -vy;
        y = Math.max(0, Math.min(y, maxY));
      }

      positionRef.current = { x, y };
      velocityRef.current = { x: vx, y: vy };

      target.style.left = `${x}px`;
      target.style.top = `${y}px`;

      if (isTrackingRef.current) {
        setScore((prev) => prev + 1);
      }

      animationRef.current = requestAnimationFrame(moveTarget);
    };

    animationRef.current = requestAnimationFrame(moveTarget);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isActive, difficulty, speed]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft === 0) {
      handleStop();
      return;
    }

    const clock = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(clock);
  }, [isActive, timeLeft]);

  const handleStop = () => {
    setIsActive(false);
    isTrackingRef.current = false;
    if (targetRef.current) targetRef.current.style.display = "none";
    if (startRef.current) startRef.current.style.display = "block";
    cancelAnimationFrame(animationRef.current);

    setScore((finalScore) => {
      const savedPb = localStorage.getItem("pb_aim_track") || 0;
      const currentPb = Math.max(Number(savedPb), finalScore);
      localStorage.setItem("pb_aim_track", currentPb);
      setPersonalBest(currentPb);
      setShowModal(true);
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
      <Navbar />
      <div className="App">
        <section style={{margin: "150px"}} id="App-section" className="App-section">
          <div className="ap">
            <div className="info">
              <div className="info-div">
                <img src={difficultyImg} alt="category"></img>
                <div>
                  <Dropdown className="drop" drop="up">
                    <Dropdown.Toggle style={dropdownToggleStyle} className="nav-button" variant="success" id="dropdown-basic">
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
                          setSpeed(2);
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
                          setDifficulty(60);
                          setSpeed(4);
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
                          setDifficulty(40);
                          setSpeed(6);
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
                        onClick={() => setCategory("Custom")}
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
                        onChange={(e) => setTime(Math.max(5, Number(e.target.value)))}
                        className="custom-input"
                      />
                    ) : (
                      (isActive ? timeLeft : time) + "s"
                    )}
                    {category === "Custom" && !isActive && (
                      <button className="pencil" onClick={() => setIsEditing(!isEditing)}>
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
                        onChange={(e) => setDifficulty(Math.min(160, Math.max(10, Number(e.target.value))))}
                        className="custom-input"
                      />
                    ) : (
                      difficulty
                    )}
                    {category === "Custom" && !isActive && (
                      <button className="pencil" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "✓" : "✎"}
                      </button>
                    )}
                  </h4>
                </div>
              </div>
            </div>

            <div className="trainingArea" ref={trainingAreaRef}>
              <button ref={startRef} id="start" className="start" style={{ fontWeight: "900" }} onClick={handleStart}>Start</button>
              <div
                className="target tracking-target"
                style={{
                  width: `${difficulty}px`,
                  height: `${difficulty}px`,
                  display: "none",
                }}
                ref={targetRef}
                onMouseEnter={() => { if(isActive) isTrackingRef.current = true; }}
                onMouseLeave={() => { isTrackingRef.current = false; }}
              ></div>
            </div>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="gameover-modal">
            <h2>TRACK COMPLETE</h2>
            <hr className="scoreboard-divider" />
            <div className="modal-stats">
              <div className="modal-stat-row"><span>Category:</span> <span className="stat-val">{category}</span></div>
              <div className="modal-stat-row"><span>Tracking Score:</span> <span className="stat-val Highlight">{score}</span></div>
              <div className="modal-stat-row"><span>Personal Best:</span> <span className="stat-val">{personalBest}</span></div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AimTrackTrainer;