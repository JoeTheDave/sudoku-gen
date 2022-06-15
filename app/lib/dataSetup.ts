import type { SudokuData } from '~/lib/sudokuData';

const performSetup = (grid: SudokuData, setup: (number | null)[]) => {
  setup.forEach((num, idx) => {
    if (num) {
      grid.setActiveCell(idx);
      grid.setActiveCellNumber(num);
    }
  });
  grid.clearActiveCell();
  return grid;
};

const easy = (grid: SudokuData) => {
  const setup = [
    null,
    null,
    null,
    5,
    null,
    4,
    7,
    null,
    null,
    null,
    null,
    null,
    3,
    9,
    6,
    2,
    null,
    null,
    5,
    3,
    2,
    null,
    8,
    null,
    4,
    null,
    null,
    6,
    null,
    null,
    7,
    null,
    8,
    null,
    2,
    null,
    null,
    8,
    1,
    null,
    null,
    null,
    5,
    9,
    null,
    null,
    2,
    null,
    9,
    null,
    5,
    null,
    null,
    7,
    null,
    null,
    4,
    null,
    7,
    null,
    6,
    3,
    1,
    null,
    null,
    6,
    2,
    4,
    3,
    null,
    null,
    null,
    null,
    null,
    8,
    6,
    null,
    1,
    null,
    null,
    null,
  ];
  return performSetup(grid, setup);
};

const medium = (grid: SudokuData) => {
  const setup = [
    null,
    null,
    null,
    null,
    1,
    null,
    null,
    3,
    8,
    null,
    null,
    7,
    4,
    null,
    null,
    null,
    null,
    null,
    null,
    5,
    null,
    null,
    null,
    null,
    null,
    null,
    2,
    null,
    2,
    null,
    7,
    null,
    null,
    5,
    null,
    null,
    8,
    7,
    null,
    null,
    3,
    null,
    null,
    6,
    1,
    null,
    null,
    9,
    null,
    null,
    6,
    null,
    8,
    null,
    3,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    9,
    6,
    null,
    null,
    2,
    4,
    null,
    null,
    8,
    null,
    null,
    null,
    null,
  ];
  return performSetup(grid, setup);
};

const hard = (grid: SudokuData) => {
  const setup = [
    null,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    7,
    8,
    null,
    null,
    4,
    null,
    null,
    null,
    null,
    2,
    null,
    null,
    null,
    null,
    null,
    2,
    null,
    4,
    null,
    null,
    null,
    6,
    null,
    null,
    null,
    null,
    7,
    null,
    5,
    null,
    8,
    null,
    null,
    null,
    null,
    3,
    null,
    null,
    null,
    9,
    null,
    1,
    null,
    null,
    null,
    null,
    null,
    9,
    null,
    null,
    null,
    null,
    6,
    null,
    null,
    3,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    7,
    null,
  ];
  return performSetup(grid, setup);
};

const extreme = (grid: SudokuData) => {
  const setup = [
    null,
    5,
    null,
    null,
    7,
    null,
    null,
    8,
    3,
    null,
    null,
    4,
    null,
    null,
    null,
    null,
    6,
    null,
    null,
    null,
    null,
    null,
    5,
    null,
    null,
    null,
    null,
    8,
    3,
    null,
    6,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    9,
    null,
    null,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    5,
    null,
    7,
    null,
    null,
    null,
    4,
    null,
    null,
    null,
    null,
    null,
    3,
    null,
    2,
    null,
    null,
    null,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  return performSetup(grid, setup);
};

const evil = (grid: SudokuData) => {
  const setup = [
    4,
    null,
    null,
    null,
    3,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    6,
    null,
    null,
    8,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null,
    null,
    null,
    null,
    5,
    null,
    null,
    9,
    null,
    null,
    8,
    null,
    null,
    null,
    null,
    6,
    null,
    null,
    null,
    7,
    null,
    2,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null,
    2,
    7,
    null,
    null,
    5,
    null,
    3,
    null,
    null,
    null,
    null,
    4,
    null,
    9,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  return performSetup(grid, setup);
};

export default { easy, medium, hard, extreme, evil };