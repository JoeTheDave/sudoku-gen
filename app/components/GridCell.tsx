import React from 'react';
import cx from 'classnames';

import type { FC } from 'react';
import type { Cell } from '~/lib/sudokuData';

interface GridCellProps {
  cellData: Cell;
  clickHandler: React.MouseEventHandler;
  cellSize: number;
}

const showGridIds = false;

const GridCell: FC<GridCellProps> = ({ cellData, clickHandler, cellSize }) => {
  return (
    <div
      key={`cell-${cellData.id}`}
      className={cx('border box-border relative', {
        'border-r-gray-300': cellData.colId === 2 || cellData.colId === 5,
        'border-l-gray-300': cellData.colId === 3 || cellData.colId === 6,
        'border-b-gray-300': cellData.rowId === 2 || cellData.rowId === 5,
        'border-t-gray-300': cellData.rowId === 3 || cellData.rowId === 6,
      })}
      data-id={cellData.id}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: cellData.active
          ? 'rgba(200, 230, 250, 0.25)'
          : cellData.isActiveCellAssociation()
          ? 'rgba(250, 253, 15, 0.05)'
          : 'white',
      }}
      onClick={clickHandler}
    >
      {cellData.number && (
        <div
          className={cx(
            'flex justify-center items-center font-acme w-full h-full pointer-events-none',
            {
              'text-gray-500':
                !cellData.isInConflict() && !cellData.userDefined,
              'text-red-500': cellData.isInConflict(),
              'text-blue-500': !cellData.isInConflict() && cellData.userDefined,
            },
          )}
          style={{
            fontSize: cellSize - 10,
          }}
        >
          {cellData.number}
        </div>
      )}
      {!cellData.number && (
        <div className="flex h-full flex-col justify-between font-acme text-gray-300 pointer-events-none">
          {[1, 2, 3].map((r) => (
            <div
              key={`${cellData.id}-note-row-${r}`}
              className="flex justify-between"
              style={{
                height: Math.floor(cellSize / 3),
              }}
            >
              {[1, 2, 3].map((c) => {
                const possibility = (r - 1) * 3 + c;
                return (
                  <div
                    key={`${cellData.id}-note-col-${c}`}
                    className="flex items-center justify-center"
                    style={{
                      width: Math.floor(cellSize / 3),
                      fontSize: Math.floor((cellSize / 3) * 0.75),
                    }}
                  >
                    {cellData.possibilities.includes(possibility)
                      ? possibility
                      : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {showGridIds && (
        <div className="absolute top-1 left-1 text-xs">{cellData.id}</div>
      )}
    </div>
  );
};

export default GridCell;
