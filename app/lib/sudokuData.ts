import { range } from 'lodash';

export class Cell {
  id: number;
  north: Cell;
  east: Cell;
  south: Cell;
  west: Cell;
  active: boolean;

  constructor(id: number) {
    this.id = id;
    this.north = null as unknown as Cell;
    this.east = null as unknown as Cell;
    this.south = null as unknown as Cell;
    this.west = null as unknown as Cell;
    this.active = false;
  }
}

export class SudokuData {
  grid: Cell[];
  activeCell: Cell | null;

  constructor(data: SudokuData | null = null) {
    if (data) {
      this.grid = data.grid;
      this.activeCell = data.activeCell;
    } else {
      this.grid = range(81).map((i) => new Cell(i));
      this.grid.forEach((cell) => {
        cell.east =
          this.grid[(cell.id + 1) % 9 === 0 ? cell.id - 8 : cell.id + 1];
        cell.west = this.grid[cell.id % 9 === 0 ? cell.id + 8 : cell.id - 1];
        cell.north = this.grid[cell.id < 9 ? cell.id + 72 : cell.id - 9];
        cell.south = this.grid[cell.id > 71 ? cell.id - 72 : cell.id + 9];
      });
      this.activeCell = null;
    }
  }

  getCellById = (id: number) => {
    const targetCell = this.grid.find((cell) => cell.id === id);
    if (!targetCell) {
      throw new Error(`${id} is not a valid cell id.`);
    }
    return targetCell;
  };

  setActiveCell = (cell: Cell | number) => {
    const newActiveCell =
      typeof cell === 'number' ? this.getCellById(cell) : cell;
    if (this.activeCell) {
      this.activeCell.active = false;
    }
    this.activeCell = newActiveCell;
    this.activeCell.active = true;
  };

  moveActiveCellNorth = () => {
    if (this.activeCell) {
      this.setActiveCell(this.activeCell.north);
    }
  };

  moveActiveCellEast = () => {
    if (this.activeCell) {
      this.setActiveCell(this.activeCell.east);
    }
  };

  moveActiveCellSouth = () => {
    if (this.activeCell) {
      this.setActiveCell(this.activeCell.south);
    }
  };

  moveActiveCellWest = () => {
    if (this.activeCell) {
      this.setActiveCell(this.activeCell.west);
    }
  };
}
