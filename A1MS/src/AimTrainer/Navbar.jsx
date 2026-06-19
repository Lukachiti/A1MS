import { Link } from "react-router-dom";
import "./App.css";

function Navbar({ setCategory, setDifficulty, setTime, handleStart, setShowScoreboard, showScoreboard }) {
  

  const handleHover = (e, isHover) => {
    e.target.style.color = isHover ? "#91ff00" : "white";
  };

  return (
    <>
      <div className="Navbar">
        <h1>A1MS</h1>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link 
            to="/" 
            className="nav-button"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Aim Trainer
          </Link>
          <Link 
            to="/reaction-speed" 
            className="nav-button"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Reaction Speed
          </Link>
          <Link 
            to="/cps-speed" 
            className="nav-button"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            CPS Speed
          </Link>
          <Link 
            to="/aim-track" 
            className="nav-button"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Aim Track
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Navbar;