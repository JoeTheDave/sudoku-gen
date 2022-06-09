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
  const key1Press = useKeyPress('1');
  const key2Press = useKeyPress('2');
  const key3Press = useKeyPress('3');
  const key4Press = useKeyPress('4');
  const key5Press = useKeyPress('5');
  const key6Press = useKeyPress('6');
  const key7Press = useKeyPress('7');
  const key8Press = useKeyPress('8');
  const key9Press = useKeyPress('9');
  const spacePress = useKeyPress(' ');

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
      (leftArrowPress ? 1 : 0) +
      (key1Press ? 1 : 0) +
      (key2Press ? 1 : 0) +
      (key3Press ? 1 : 0) +
      (key4Press ? 1 : 0) +
      (key5Press ? 1 : 0) +
      (key6Press ? 1 : 0) +
      (key7Press ? 1 : 0) +
      (key8Press ? 1 : 0) +
      (key9Press ? 1 : 0) +
      (spacePress ? 1 : 0);
    if (sudokuData && buttonLoad === 1) {
      if (upArrowPress) {
        sudokuData.moveActiveCellNorth();
        setSudokuData(new SudokuData(sudokuData));
      } else if (rightArrowPress) {
        sudokuData.moveActiveCellEast();
        setSudokuData(new SudokuData(sudokuData));
      } else if (downArrowPress) {
        sudokuData.moveActiveCellSouth();
        setSudokuData(new SudokuData(sudokuData));
      } else if (leftArrowPress) {
        sudokuData.moveActiveCellWest();
        setSudokuData(new SudokuData(sudokuData));
      } else if (key1Press) {
        sudokuData.setActiveCellNumber(1);
        console.log(sudokuData);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key2Press) {
        sudokuData.setActiveCellNumber(2);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key3Press) {
        sudokuData.setActiveCellNumber(3);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key4Press) {
        sudokuData.setActiveCellNumber(4);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key5Press) {
        sudokuData.setActiveCellNumber(5);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key6Press) {
        sudokuData.setActiveCellNumber(6);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key7Press) {
        sudokuData.setActiveCellNumber(7);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key8Press) {
        sudokuData.setActiveCellNumber(8);
        setSudokuData(new SudokuData(sudokuData));
      } else if (key9Press) {
        sudokuData.setActiveCellNumber(9);
        setSudokuData(new SudokuData(sudokuData));
      } else if (spacePress) {
        sudokuData.setActiveCellNumber(null);
        setSudokuData(new SudokuData(sudokuData));
      }
    }
  }, [
    upArrowPress,
    rightArrowPress,
    downArrowPress,
    leftArrowPress,
    key1Press,
    key2Press,
    key3Press,
    key4Press,
    key5Press,
    key6Press,
    key7Press,
    key8Press,
    key9Press,
    spacePress,
  ]);

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
