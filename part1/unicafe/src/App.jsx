import { useState } from "react";
import Button from "./Button";
import Statistics from "./Statistics";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const allClicks = good + neutral + bad;
  const average = allClicks === 0 ? 0 : (good - bad) / allClicks;
  const positivePercentage = allClicks === 0 ? 0 : (good / allClicks) * 100;

  function handleGoodClick() {
    setGood((prev) => prev + 1);
  }

  function handleNeutralClick() {
    setNeutral((prev) => prev + 1);
  }

  function handleBadClick() {
    setBad((prev) => prev + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>

      <div>
        <Button text={"good"} onClick={handleGoodClick} />
        <Button text={"neutral"} onClick={handleNeutralClick} />
        <Button text={"bad"} onClick={handleBadClick} />
      </div>

      <h1>statistics</h1>

      {allClicks === 0 ? (
        <p>No feedback given</p>
      ) : (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          allClicks={allClicks}
          average={average}
          positivePercentage={positivePercentage}
        />
      )}
    </div>
  );
};

export default App;
