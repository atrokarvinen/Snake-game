import "./GridCell.css";
import * as React from "react";
import { Cell } from "../../types/Cell";

interface CellProps {
  cell: Cell;
  columnWidth: string;
}

const GridCell: React.FunctionComponent<CellProps> = props => {
  const { cell, columnWidth } = props;

  let cellColour: string;
  if (cell.isEatenFood === true) {
    cellColour = "gray";
  } else if (cell.isSnake === true) {
    cellColour = "black";
  } else if (cell.isFood === true) {
    cellColour = "green";
  } else {
    cellColour = "white";
  }
  
  return (
    <div className="cell" style={{ width: columnWidth, backgroundColor: cellColour }} />
  );
};

export default GridCell;
