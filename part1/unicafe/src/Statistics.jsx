import StatisticLine from "./StatisticLine";

const Statistics = (props) => {
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text={"good"} value={props.good} />
          <StatisticLine text={"neutral"} value={props.neutral} />
          <StatisticLine text={"bad"} value={props.bad} />
          <StatisticLine text={"all"} value={props.allClicks} />
          <StatisticLine text={"average"} value={props.average} />
          <StatisticLine text={"positive"} value={props.positivePercentage} />
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
