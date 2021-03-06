import React, { useEffect, useReducer, useCallback } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { min } from 'lodash';
import { SudokuData } from '~/lib/sudokuData';
import GridCell from '~/components/GridCell';

import type { FC } from 'react';

interface SudokuGridProps {
  data: SudokuData;
  showSolver?: boolean;
}

type Action =
  | { type: 'SetActive'; cell: number }
  | { type: 'SetNotation'; num: number }
  | { type: 'SetNumber'; num: number }
  | {
      type:
        | 'ArrowUp'
        | 'ArrowRight'
        | 'ArrowDown'
        | 'ArrowLeft'
        | 'Space'
        | 'Solve';
    };

function reducer(state: SudokuData, action: Action) {
  switch (action.type) {
    case 'SetActive':
      state.setActiveCell(action.cell);
      return new SudokuData(state);
    case 'SetNotation':
      state.toggleActiveCellPossibility(action.num);
      return new SudokuData(state);
    case 'SetNumber':
      state.setActiveCellNumber(action.num);
      return new SudokuData(state);
    case 'ArrowUp':
      state.moveActiveCellNorth();
      return new SudokuData(state);
    case 'ArrowRight':
      state.moveActiveCellEast();
      return new SudokuData(state);
    case 'ArrowDown':
      state.moveActiveCellSouth();
      return new SudokuData(state);
    case 'ArrowLeft':
      state.moveActiveCellWest();
      return new SudokuData(state);
    case 'Space':
      state.setActiveCellNumber(null);
      return new SudokuData(state);
    case 'Solve':
      state.solve();
      return new SudokuData(state);
    default:
      throw new Error();
  }
}

const SudokuGrid: FC<SudokuGridProps> = ({ data, showSolver }) => {
  const [width, height] = useWindowSize();

  const [sudokuData, dispatch] = useReducer(reducer, data);

  const keyPressHandler = useCallback((e: KeyboardEvent) => {
    const num = parseInt(e.key);
    const shifted = e.shiftKey;
    if (num) {
      dispatch({ type: shifted ? 'SetNotation' : 'SetNumber', num });
    }
    if ('!@#$%^&*('.includes(e.key)) {
      dispatch({
        type: 'SetNotation',
        num: '!@#$%^&*('.indexOf(e.key) + 1,
      });
    }
    if (e.key === 'ArrowUp') {
      dispatch({ type: e.key });
    }
    if (e.key === 'ArrowRight') {
      dispatch({ type: e.key });
    }
    if (e.key === 'ArrowDown') {
      dispatch({ type: e.key });
    }
    if (e.key === 'ArrowLeft') {
      dispatch({ type: e.key });
    }
    if (e.key === ' ') {
      dispatch({ type: 'Space' });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyPressHandler);
    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, []);

  const cellClickHandler: React.MouseEventHandler = (e) => {
    const idAttr = (e.target as HTMLDivElement).getAttribute('data-id');
    if (idAttr) {
      const cell = parseInt(idAttr, 10);
      dispatch({ type: 'SetActive', cell });
    }
  };

  const cellSize: number =
    min([Math.floor((width - 200) / 9), Math.floor((height - 300) / 9)]) || 0;
  const gridSize: number = cellSize * 9 + 2;

  return (
    <>
      <div className="flex justify-center mt-10">
        <div
          className="flex flex-wrap border box-border"
          style={{ width: gridSize }}
        >
          {sudokuData &&
            sudokuData.grid.map((cell) => (
              <GridCell
                key={`cell-${cell.id}`}
                cellData={cell}
                cellSize={cellSize}
                clickHandler={cellClickHandler}
              />
            ))}
        </div>
      </div>
      {showSolver && (
        <div className="text-center mt-10">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              dispatch({ type: 'Solve' });
            }}
          >
            Solve
          </button>
        </div>
      )}
    </>
  );
};

export default SudokuGrid;
