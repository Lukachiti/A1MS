import "./App.css";

function ScoreBoard({ scoreArray }) {
  const ranks = {
    Beginner: 1,
    Intermediate: 1,
    Advanced: 1.2,
  };

  const sortedScores = [...(scoreArray || [])].sort((a, b) => {
    const scoreA = a.score * (ranks[a.category] || 1);
    const scoreB = b.score * (ranks[b.category] || 1);
    return scoreB - scoreA;
  });

  return (
    <>
      <div className="scoreboard">
        <div className="scoreboard-row scoreboard-header">
          <h6>Rank</h6>
          <h6>Score</h6>
          <h6>Category</h6>
          <h6>Date</h6>
        </div>
        <hr className="scoreboard-divider" />
        <div className="scoreboard-list-container">
          {sortedScores.map((i, index) => (
            <section key={index} style={{ display: "contents" }}>
              <div className="scoreboard-row scoreboard-item">
                <p>#{index + 1}</p>
                <p>{Math.round(i.score * (ranks[i.category] || 1))}</p>
                <p>{i.category}</p>
                <p className="scoreboard-date">
                  {i.date || new Date().toLocaleDateString()}
                </p>
              </div>
              {index < sortedScores.length - 1 && (
                <hr className="scoreboard-divider" />
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScoreBoard;