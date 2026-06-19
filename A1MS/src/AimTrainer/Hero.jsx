

import "./App.css";
 const scrollToSection = () => {
    
    document.getElementById("App-section").scrollIntoView({ behavior: 'smooth' });
  };
function Hero() {
  return <section className="hero-section">
  <div className="hero-board">
    <p className="hero-p">
        Brought to you by Luka Chitidze
    </p>  
    
    <h2>Powerful Aim Trainer</h2>
    <p>A1MS delivers a competitive training<br></br> experience against your past self to push your human limits</p>
    <button onClick={scrollToSection} className="hero-button" >Start right now</button>
  </div>
  </section>;
}

export default Hero;
