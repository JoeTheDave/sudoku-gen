import React, { useState, useEffect } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { min } from 'lodash';
import { useKeyPress } from '~/lib/useKeyPress';
import { SudokuData } from '~/lib/sudokuData';
import GridCell from '~/components/GridCell';

import type { FC } from 'react';

interface SudokuGridProps {
  data: SudokuData;
}

const SudokuGrid: FC<SudokuGridProps> = ({ data }) => {
  const [width, height] = useWindowSize();

  const [sudokuData, setSudokuData] = useState<SudokuData | null>(null);
  const upArrowPress = useKeyPress('ArrowUp');
  const rightArrowPress = useKeyPress('ArrowRight');
  const downArrowPress = useKeyPress('ArrowDown');
  const leftArrowPress = useKeyPress('ArrowLeft');

  const cellClickHandler: React.MouseEventHandler = (e) => {
    const idAttr = (e.target as HTMLDivElement).getAttribute('data-id');
    if (sudokuData && idAttr) {
      const id = parseInt(idAttr, 10);
      sudokuData.setActiveCell(id);
      setSudokuData(new SudokuData(sudokuData));
    }
  };

  useEffect(() => {
    setSudokuData(data);
  }, []);

  useEffect(() => {
    const buttonLoad =
      (upArrowPress ? 1 : 0) +
      (rightArrowPress ? 1 : 0) +
      (downArrowPress ? 1 : 0) +
      (leftArrowPress ? 1 : 0);
    if (buttonLoad === 1) {
      if (upArrowPress) {
        sudokuData?.moveActiveCellNorth();
        setSudokuData(new SudokuData(sudokuData));
      } else if (rightArrowPress) {
        sudokuData?.moveActiveCellEast();
        setSudokuData(new SudokuData(sudokuData));
      } else if (downArrowPress) {
        sudokuData?.moveActiveCellSouth();
        setSudokuData(new SudokuData(sudokuData));
      } else if (leftArrowPress) {
        sudokuData?.moveActiveCellWest();
        setSudokuData(new SudokuData(sudokuData));
      }
    }
  }, [upArrowPress, rightArrowPress, downArrowPress, leftArrowPress]);

  const cellSize: number =
    min([Math.floor((width - 200) / 9), Math.floor((height - 300) / 9)]) || 0;
  const gridSize: number = cellSize * 9 + 2;

  return (
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
  );
};

export default SudokuGrid;
