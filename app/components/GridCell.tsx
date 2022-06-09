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
      className="border box-border flex justify-center items-center font-pencil text-gray-500 text-shadow"
      data-id={cellData.id}
      style={{
        width: cellSize,
        height: cellSize,
        fontSize: cellSize - 10,
        backgroundColor: cellData.active
          ? 'rgba(200, 230, 250, 0.25)'
          : 'white',
      }}
      onClick={clickHandler}
    >
      {cellData.number}
    </div>
  );
};

export default GridCell;
