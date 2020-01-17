import "./TrainingUI.css";

import * as React from "react";
import { TrainingProgress } from "../../../types/TrainingProgress";
import Graph from "./Graph";

interface TrainingUIProps {
  trainingInfo: TrainingProgress[];
}

const TrainingUI: React.FunctionComponent<TrainingUIProps> = props => {
  const { trainingInfo } = props;

  // const truncate = (num: number): number => {
  //   const decimals: number = 3;
  //   const multiplier: number = Math.pow(10, decimals);
  //   return Math.round(multiplier * num) / multiplier;
  // };

  return (
    <div className="train-ui">
      {/* <label>Iteration: {trainingInfo.length}</label> */}
      {/* <label>Random chance: {truncate(props.trainingInfo.RandomChance * 100)} %</label> */}
      {/* <label>
        Cumulative reward:
        {trainingInfo[trainingInfo.length - 1] && truncate(trainingInfo[trainingInfo.length - 1].CumulativeReward)}
      </label> */}
      <Graph data={trainingInfo} />
    </div>
  );
};

export default TrainingUI;
