import { useState, useEffect } from "react";
import './styles.css';  // Import your custom CSS file

const MATCHES_CSV_URL = "https://docs.google.com/spreadsheets/d/1qWODf41ji57p3BB1gmIZ1tvHSfHNUOPR71iX3QVdTMc/gviz/tq?tqx=out:csv&sheet=Matches";
const TEAMS_CSV_URL = "https://docs.google.com/spreadsheets/d/1qWODf41ji57p3BB1gmIZ1tvHSfHNUOPR71iX3QVdTMc/gviz/tq?tqx=out:csv&sheet=TeamData";

export default function MatchViewer() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [view, setView] = useState("home");

  useEffect(() => {
    fetch(MATCHES_CSV_URL)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n").slice(1);
        const parsedMatches = rows.map((row) => {
          const [match, team1, team2] = row.split(",");
          return { match, team1, team2 };
        });
        setMatches(parsedMatches);
      });

    fetch(TEAMS_CSV_URL)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n").slice(1);
        const parsedTeams = rows.reduce((acc, row) => {
          const [teamNumber, teamName, yearFounded, town, state, robotName, teamType] = row.split(",");
          acc[teamNumber] = { teamName, yearFounded, town, state, robotName, teamType };
          return acc;
        }, {});
        setTeams(parsedTeams);
      });
  }, []);

  const selectMatch = (match) => setSelectedMatch(match);
  const selectTeam = (teamNumber) => setSelectedTeam(teamNumber);
  const goHome = () => {
    setSelectedMatch(null);
    setSelectedTeam(null);
    setView("home");
  };

  const nextMatch = () => {
    if (!selectedMatch) return;
    const currentIndex = matches.findIndex(m => m.match === selectedMatch.match);
    if (currentIndex < matches.length - 1) setSelectedMatch(matches[currentIndex + 1]);
  };

  const prevMatch = () => {
    if (!selectedMatch) return;
    const currentIndex = matches.findIndex(m => m.match === selectedMatch.match);
    if (currentIndex > 0) setSelectedMatch(matches[currentIndex - 1]);
  };
  
  const sortedTeamNumbers = Object.keys(teams).sort((a, b) => a - b);
  const nextTeam = () => {
    if (!selectedTeam) return;
    const currentIndex = sortedTeamNumbers.indexOf(selectedTeam);
    if (currentIndex < sortedTeamNumbers.length - 1) setSelectedTeam(sortedTeamNumbers[currentIndex + 1]);
  };

  const prevTeam = () => {
    if (!selectedTeam) return;
    const currentIndex = sortedTeamNumbers.indexOf(selectedTeam);
    if (currentIndex > 0) setSelectedTeam(sortedTeamNumbers[currentIndex - 1]);
  };

  return (
    <div className="p-4">
      {view === "home" && (
        <div>
          <h1 className="text-2xl mb-4">New England Premier Event - 2025</h1>
          <button className="button-margin" onClick={() => setView("matches")}>Matches</button>
          <button className="button-margin" onClick={() => setView("teams")}>Teams</button>
        </div>
      )}

      {view === "matches" && !selectedMatch && (
        <div>
          <h1 className="text-xl mb-4">Select a Match</h1>
          {matches.map((match) => (
            <button key={match.match} className="button-margin" onClick={() => selectMatch(match)}>
              Match {match.match}
            </button>
          ))}
          <button className="mt-4" onClick={goHome}>Home</button>
        </div>
      )}

      {view === "teams" && !selectedTeam && (
        <div>
          <h1 className="text-xl mb-4">Select a Team</h1>
          {sortedTeamNumbers.map((team) => (
            <button key={team} className="button-margin" onClick={() => selectTeam(team)}>
              Team {team}
            </button>
          ))}
          <button className="mt-4" onClick={goHome}>Home</button>
        </div>
      )}

      {selectedMatch && (
        <div className="card">
          <div className="card-content p-4">
            <h2 className="text-lg">Match {selectedMatch.match}</h2>
            {[selectedMatch.team1, selectedMatch.team2].map((teamNumber) => (
              <div key={teamNumber} className="team-info mt-2 border p-2 rounded">
                <h3 className="font-bold">Team {teamNumber}</h3>
                {teams[teamNumber] ? (
                  <div>
                    <p>Name: {teams[teamNumber].teamName}</p>
                    <p>Founded: {teams[teamNumber].yearFounded}</p>
                    <p>Location: {teams[teamNumber].town}, {teams[teamNumber].state}</p>
                    <p>Robot: {teams[teamNumber].robotName}</p>
                    <p>Type: {teams[teamNumber].teamType}</p>
                  </div>
                ) : (
                  <p>Team details not found.</p>
                )}
              </div>
            ))}
            <button className="back-btn mt-4" onClick={() => setSelectedMatch(null)}>Back to Matches</button>
          </div>
        </div>
      )}

      {selectedTeam && (
        <div className="card">
          <div className="card-content p-4">
            <h2 className="text-lg">Team {selectedTeam}</h2>
            {teams[selectedTeam] ? (
              <div>
                <p>Name: {teams[selectedTeam].teamName}</p>
                <p>Founded: {teams[selectedTeam].yearFounded}</p>
                <p>Location: {teams[selectedTeam].town}, {teams[selectedTeam].state}</p>
                <p>Robot: {teams[selectedTeam].robotName}</p>
                <p>Type: {teams[selectedTeam].teamType}</p>
              </div>
            ) : (
              <p>Team details not found.</p>
            )}
            <button className="mt-4" onClick={() => setSelectedTeam(null)}>Back to Teams</button>
            <button className="mt-4 ml-2" onClick={prevTeam}>Previous Team</button>
            <button className="mt-4 ml-2" onClick={nextTeam}>Next Team</button>
          </div>
        </div>
      )}
    </div>
  );
}
