import React from 'react';
import cx from 'classnames';

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
      className={cx(
        'border box-border flex justify-center items-center font-acme ',
        {
          'text-gray-500': !cellData.isInConflict() && !cellData.userDefined,
          'text-red-500': cellData.isInConflict(),
          'text-blue-500': !cellData.isInConflict() && cellData.userDefined,
        },
      )}
      data-id={cellData.id}
      style={{
        width: cellSize,
        height: cellSize,
        fontSize: cellSize - 10,
        backgroundColor: cellData.active
          ? 'rgba(200, 230, 250, 0.25)'
          : cellData.isActiveCellAssociation()
          ? 'rgba(250, 253, 15, 0.05)'
          : 'white',
      }}
      onClick={clickHandler}
    >
      {cellData.number}
    </div>
  );
};

export default GridCell;
