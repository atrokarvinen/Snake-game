import "./Grid.css";
import * as React from "react";
import { Row } from "../../types/Row";
import { Snake } from "../../types/Snake";
import { Point } from "../../types/Point";
import GridRow from "../GridRow/GridRow";

interface GridProps {
  snake: Snake;
  food: Point;

  boardWidth: number;
  boardHeight: number;
}

const Grid: React.FunctionComponent<GridProps> = props => {
  const cells: Array<Row> = [];

  const rowHeight: string = `${100.0 / props.boardHeight}%`;
  const columnWidth: string = `${100.0 / props.boardWidth}%`;

  for (let row = 0; row < props.boardHeight; row++) {
    const cellRow: Row = { cells: [] };
    for (let col = 0; col < props.boardWidth; col++) {
      cellRow.cells.push({ isSnake: false, isFood: false, isEatenFood: false });
    }
    cells.push(cellRow);
  }

  // Mark coordinates occupied by snake
  props.snake.coordinates.forEach((coord: Point) => {
    cells[coord.y].cells[coord.x].isSnake = true;
  });

  // Mark coordinate occupied by food
  cells[props.food.y].cells[props.food.x].isFood = true;

  // Mark coordinates occupied by eaten food i.e. food inside snake
  props.snake.eatPoints.forEach((coord: Point) => {
    cells[coord.y].cells[coord.x].isEatenFood = true;
  });

  const gridRowElements: JSX.Element[] = cells.map((row: Row, rowID: number) => {
    return (
      <GridRow key={rowID} row={row} rowHeight={rowHeight} columnWidth={columnWidth} />
    );
  });

  return <div className="board">{gridRowElements}</div>;
};

export default Grid;
