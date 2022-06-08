import React from 'react';

import type { FC } from 'react';
import type { Cell } from '~/lib/sudokuData';

interface GridCellProps {
  cellData: Cell;
  clickHandler: React.MouseEventHandler;
  cellSize: number;
}

const GridCell: FC<GridCellProps> = ({ cellData, clickHandler, cellSize }) => {
  return (
    <div
      key={`cell-${cellData.id}`}
      className="border box-border"
      data-id={cellData.id}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: cellData.active ? 'red' : 'white',
      }}
      onClick={clickHandler}
    >
      {cellData.id}
    </div>
  );
};

export default GridCell;
