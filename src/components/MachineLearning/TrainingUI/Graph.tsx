import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import * as React from "react";
import { TrainingProgress } from "../../../types/TrainingProgress";

interface GraphProps {
  data: TrainingProgress[];
}

const Graph: React.FunctionComponent<GraphProps> = props => {
  const animate: boolean = false;

  return (
    <ResponsiveContainer className="graph-container" width="100%" height="95%">
      <LineChart
        data={props.data}
        margin={{
          top: 5,
          right: 100,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis />
        <YAxis yAxisId="reward" dataKey="CumulativeReward"/>
        <YAxis yAxisId="score" orientation="right" dataKey="Score"/>
        <Tooltip />
        <Legend />
        <Line
          isAnimationActive={animate}
          yAxisId="reward"
          type="monotone"
          dataKey="CumulativeReward"
          stroke="blue"
          name="Learning curve"
        />
        <Line
          isAnimationActive={animate}
          yAxisId="score"
          type="monotone"
          dataKey="Score"
          stroke="red"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph;
