import { compact, range, uniq, sortBy } from 'lodash';

export class Cell {
  id: number;
  north: Cell;
  east: Cell;
  south: Cell;
  west: Cell;
  active: boolean;
  number: number | null;
  possibilities: number[];
  userDefined: boolean;
  rowAssociations: Cell[];
  colAssociations: Cell[];
  gridAssociations: Cell[];
  allAssociations: Cell[];

  constructor(id: number) {
    this.id = id;
    this.north = null as unknown as Cell;
    this.east = null as unknown as Cell;
    this.south = null as unknown as Cell;
    this.west = null as unknown as Cell;
    this.active = false;
    this.number = null;
    this.possibilities = [];
    this.userDefined = false;
    this.rowAssociations = [];
    this.colAssociations = [];
    this.gridAssociations = [];
    this.allAssociations = [];
  }

  isActiveCellAssociation = () =>
    this.allAssociations.filter((cell) => cell.active).length === 1;

  isInConflict = () =>
    !!this.allAssociations.filter(
      (cell) => cell.number !== null && cell.number === this.number,
    ).length;
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
        const rowStartId = cell.id - (cell.id % 9);
        const colStartId = cell.id % 9;
        const gridStartId =
          cell.id - (cell.id % 27) + (cell.id % 9) - (cell.id % 3);
        cell.rowAssociations = compact(
          range(9).map((i) => {
            const associatedCell = this.grid[rowStartId + i];
            return associatedCell.id === cell.id ? null : associatedCell;
          }),
        );
        cell.colAssociations = compact(
          range(9).map((i) => {
            const associatedCell = this.grid[colStartId + i * 9];
            return associatedCell.id === cell.id ? null : associatedCell;
          }),
        );
        cell.gridAssociations = compact(
          range(9).map((i) => {
            const associatedCell =
              this.grid[gridStartId + (i % 3) + Math.floor(i / 3) * 9];
            return associatedCell.id === cell.id ? null : associatedCell;
          }),
        );
        cell.allAssociations = uniq([
          ...cell.rowAssociations,
          ...cell.colAssociations,
          ...cell.gridAssociations,
        ]);
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

  getCell = (ref: Cell | number) =>
    typeof ref === 'number' ? this.getCellById(ref) : ref;

  setActiveCell = (cell: Cell | number) => {
    const newActiveCell = this.getCell(cell);
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

  setActiveCellNumber = (number: number | null) => {
    if (number !== null && (number < 1 || number > 9)) {
      throw new Error(`${number} is an invalid number assignment.`);
    }
    if (this.activeCell) {
      this.activeCell.number = number;
      this.activeCell.userDefined = number === null ? false : true;
      this.activeCell.possibilities = [];
    }
  };

  toggleActiveCellPossibility = (number: number) => {
    if (this.activeCell) {
      if (this.activeCell.possibilities.includes(number)) {
        this.activeCell.possibilities = this.activeCell.possibilities.filter(
          (n) => n !== number,
        );
      } else {
        this.activeCell.possibilities = sortBy([
          ...this.activeCell.possibilities,
          number,
        ]);
      }
    }
  };

  clearActiveCell = () => {
    if (this.activeCell) {
      this.activeCell.active = false;
      this.activeCell = null;
    }
  };

  // Untested
  calculateCellPossibilities = () =>
    this.grid.forEach((cell) => {
      if (!cell.number) {
        cell.possibilities = cell.allAssociations.reduce(
          (possibilities, associatedCell) => {
            return associatedCell.number &&
              possibilities.includes(associatedCell.number)
              ? possibilities.filter((num) => num !== associatedCell.number)
              : possibilities;
          },
          range(1, 10),
        );
      }
    });

  // Untested
  solve = () => {
    this.calculateCellPossibilities();
  };
}
