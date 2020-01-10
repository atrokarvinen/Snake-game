import "./GridRow.css";
import * as React from "react";
import { Cell } from "../../types/Cell";
import { Row } from "../../types/Row";
import GridCell from "../GridCell/GridCell";

interface GridRowProps {
  rowHeight: string;
  row: Row;
  columnWidth: string;
}

const GridRow: React.FunctionComponent<GridRowProps> = props => {
  const { row, rowHeight, columnWidth } = props;

  const renderCells = (): JSX.Element[] => {
    const cells: JSX.Element[] = row.cells.map((cell: Cell, colID: number) => {
      return <GridCell key={colID} cell={cell} columnWidth={columnWidth} />;
    });
    return cells;
  };

  return (
    <div className="row" style={{ height: rowHeight }}>
      {renderCells()}
    </div>
  );
};

export default GridRow;
