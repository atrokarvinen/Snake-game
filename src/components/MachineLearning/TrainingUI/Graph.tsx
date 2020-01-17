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
import { Point } from "../../../types/Point";

interface GraphProps {
  data: Point[];
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          isAnimationActive={animate}
          type="monotone"
          dataKey="y"
          stroke="blue"
          // dot={<CustomizedDot LSL={hueLSL} USL={hueUSL} />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph;
