import { SudokuData } from '~/lib/sudokuData';

describe('When SudokuData is instantiated', () => {
  const data = new SudokuData();
  it('Should have cells with appropriate east neighbor relationships.', () => {
    expect(data.grid[0].east).not.toBeNull();
    expect(data.grid[0].east.id).toBe(1);
    expect(data.grid[40].east.id).toBe(41);
    expect(data.grid[8].east.id).toBe(0);
    expect(data.grid[71].east.id).toBe(63);
  });
  it('Should have cells with appropriate west neighbor relationships.', () => {
    expect(data.grid[1].west).not.toBeNull();
    expect(data.grid[1].west.id).toBe(0);
    expect(data.grid[40].west.id).toBe(39);
    expect(data.grid[0].west.id).toBe(8);
    expect(data.grid[63].west.id).toBe(71);
  });
  it('Should have cells with appropriate north neighbor relationships.', () => {
    expect(data.grid[9].north).not.toBeNull();
    expect(data.grid[9].north.id).toBe(0);
    expect(data.grid[40].north.id).toBe(31);
    expect(data.grid[0].north.id).toBe(72);
    expect(data.grid[7].north.id).toBe(79);
  });
  it('Should have cells with appropriate south neighbor relationships.', () => {
    expect(data.grid[0].south).not.toBeNull();
    expect(data.grid[0].south.id).toBe(9);
    expect(data.grid[40].south.id).toBe(49);
    expect(data.grid[72].south.id).toBe(0);
    expect(data.grid[79].south.id).toBe(7);
  });
  it('Should have cells with appropriate row associations.', () => {
    expect(data.grid[40].rowAssociations.length).toBe(8);
    [36, 37, 38, 39, 41, 42, 43, 44].forEach((id) =>
      expect(data.grid[40].rowAssociations.includes(data.grid[id])).toBe(true),
    );
  });
  it('Should have cells with appropriate col associations.', () => {
    expect(data.grid[0].colAssociations.length).toBe(8);
    [4, 13, 22, 31, 49, 58, 67, 76].forEach((id) =>
      expect(data.grid[40].colAssociations.includes(data.grid[id])).toBe(true),
    );
  });
  it('Should have cells with appropriate grid associations.', () => {
    expect(data.grid[0].gridAssociations.length).toBe(8);
    [30, 31, 32, 39, 41, 48, 49, 50].forEach((id) =>
      expect(data.grid[40].gridAssociations.includes(data.grid[id])).toBe(true),
    );
  });
  it('Should have cells with appropriate lists of all associations.', () => {
    expect(data.grid[0].allAssociations.length).toBe(20);
    [
      36, 37, 38, 39, 41, 42, 43, 44, 4, 13, 22, 31, 49, 58, 67, 76, 30, 32, 48,
      50,
    ].forEach((id) =>
      expect(data.grid[40].allAssociations.includes(data.grid[id])).toBe(true),
    );
  });
});

describe('When SudokuData is instantiated with existing data', () => {
  const data = new SudokuData();
  data.setActiveCell(40);
  const newData = new SudokuData(data);
  it('should have same values as existing data.', () => {
    expect(newData.activeCell?.id).toBe(40);
    expect(newData.getCellById(40).active).toBe(true);
  });
});

describe('When SudokuData.getCellById is called', () => {
  const data = new SudokuData();
  it('should return the cell with id that was passed in.', () => {
    const cell = data.getCellById(40);
    expect(cell).not.toBeNull();
    expect(cell?.id).toBe(40);
  });
  it('should throw an error if called with an invalid id.', () => {
    expect(() => data.getCellById(81)).toThrowError(
      '81 is not a valid cell id.',
    );
    expect(() => data.getCellById(-1)).toThrowError(
      '-1 is not a valid cell id.',
    );
    expect(() => data.getCellById(40)).not.toThrow();
  });
});

describe('When SudokuData.setActiveCell is called', () => {
  const data = new SudokuData();
  data.activeCell = data.getCellById(0);
  data.activeCell.active = true;
  const cellToSetAsActive = data.getCellById(40);
  data.setActiveCell(cellToSetAsActive);
  it('should set activeCell to the cell passed in.', () => {
    expect(data.activeCell?.id).toBe(40);
  });
  it('should set the cell passed in to have active set to true.', () => {
    expect(data.grid[40].active).toBe(true);
  });
  it('should set any previously active cell to have active set to false.', () => {
    expect(data.grid[0].active).toBe(false);
  });
});

describe('When SudokuData.setActiveCell is called with an integer id instead of a cell object', () => {
  const data = new SudokuData();
  data.activeCell = data.getCellById(0);
  data.activeCell.active = true;

  it('should set activeCell to the cell that has an id equal to the number passed in.', () => {
    data.setActiveCell(40);
    expect(data.activeCell?.id).toBe(40);
  });

  it('should throw an error if passed an invalid id.', () => {
    expect(() => data.setActiveCell(81)).toThrowError(
      '81 is not a valid cell id.',
    );
  });
});

describe('When SudokuData.moveActiveCellNorth is called', () => {
  const data = new SudokuData();
  it('should not set an active cell if there is not already one active.', () => {
    data.moveActiveCellNorth();
    expect(data.activeCell).toBeNull();
  });
  it('should set the new active cell appropriately.', () => {
    data.setActiveCell(data.getCellById(40));
    data.moveActiveCellNorth();
    expect(data.activeCell?.id).toBe(31);
  });
});

describe('When SudokuData.moveActiveCellEast is called', () => {
  const data = new SudokuData();
  it('should not set an active cell if there is not already one active.', () => {
    data.moveActiveCellEast();
    expect(data.activeCell).toBeNull();
  });
  it('should set the new active cell appropriately.', () => {
    data.setActiveCell(data.getCellById(40));
    data.moveActiveCellEast();
    expect(data.activeCell?.id).toBe(41);
  });
});

describe('When SudokuData.moveActiveCellSouth is called', () => {
  const data = new SudokuData();
  it('should not set an active cell if there is not already one active.', () => {
    data.moveActiveCellSouth();
    expect(data.activeCell).toBeNull();
  });
  it('should set the new active cell appropriately.', () => {
    data.setActiveCell(data.getCellById(40));
    data.moveActiveCellSouth();
    expect(data.activeCell?.id).toBe(49);
  });
});

describe('When SudokuData.moveActiveCellWest is called', () => {
  const data = new SudokuData();
  it('should not set an active cell if there is not already one active.', () => {
    data.moveActiveCellWest();
    expect(data.activeCell).toBeNull();
  });
  it('should set the new active cell appropriately.', () => {
    data.setActiveCell(data.getCellById(40));
    data.moveActiveCellWest();
    expect(data.activeCell?.id).toBe(39);
  });
});

describe('When SudokuData.setActiveCellNumber is called', () => {
  it('should set the active cell to have the number passed in.', () => {
    const data = new SudokuData();
    data.setActiveCell(40);
    data.setActiveCellNumber(5);
    expect(data.grid[40].number).toBe(5);
  });
  it('should set the active cell to null if null is passed in.', () => {
    const data = new SudokuData();
    data.setActiveCell(40);
    data.setActiveCellNumber(5);
    expect(data.grid[40].number).toBe(5);
    data.setActiveCellNumber(null);
    expect(data.grid[40].number).toBeNull();
  });
  it('should throw an error if passed an invalid number.', () => {
    const data = new SudokuData();
    data.setActiveCell(40);
    expect(() => data.setActiveCellNumber(10)).toThrowError(
      '10 is an invalid number assignment.',
    );
    expect(() => data.setActiveCellNumber(0)).toThrowError(
      '0 is an invalid number assignment.',
    );
  });
  it('should set userDefined field to true if value passed is not null or back to false if null is passed.', () => {
    const data = new SudokuData();
    data.setActiveCell(40);
    data.setActiveCellNumber(5);
    expect(data.activeCell?.userDefined).toBe(true);
    data.setActiveCellNumber(null);
    expect(data.activeCell?.userDefined).toBe(false);
  });

  it('should clear the list of cell possibilities', () => {
    const data = new SudokuData();
    data.setActiveCell(0);
    data.toggleActiveCellPossibility(4);
    data.toggleActiveCellPossibility(8);
    data.toggleActiveCellPossibility(6);
    data.toggleActiveCellPossibility(5);
    data.setActiveCellNumber(5);
    expect(data.activeCell?.possibilities.length).toBe(0);
    data.toggleActiveCellPossibility(2);
    data.toggleActiveCellPossibility(9);
    data.toggleActiveCellPossibility(3);
    data.setActiveCellNumber(null);
    expect(data.activeCell?.possibilities.length).toBe(0);
  });
});

describe("If a grid cell has the same number as one of it's associated cells", () => {
  it('should be marked as being in conflict.', () => {
    const data = new SudokuData();
    data.grid[40].number = 5;
    data.grid[41].number = 5;
    data.grid[0].number = 5;
    expect(data.grid[40].isInConflict()).toBe(true);
    expect(data.grid[41].isInConflict()).toBe(true);
    expect(data.grid[0].isInConflict()).toBe(false);
  });
});

describe('If SudokuData.toggleActiveCellPossibility is called', () => {
  it('should add the numbers to the possibilities array in order.', () => {
    const data = new SudokuData();
    data.setActiveCell(0);
    data.toggleActiveCellPossibility(4);
    data.toggleActiveCellPossibility(8);
    data.toggleActiveCellPossibility(6);
    data.toggleActiveCellPossibility(5);
    expect(data.grid[0].possibilities[0]).toBe(4);
    expect(data.grid[0].possibilities[1]).toBe(5);
    expect(data.grid[0].possibilities[2]).toBe(6);
    expect(data.grid[0].possibilities[3]).toBe(8);
  });
  it('should remove a number that already exists.', () => {
    const data = new SudokuData();
    data.setActiveCell(0);
    data.toggleActiveCellPossibility(4);
    data.toggleActiveCellPossibility(5);
    data.toggleActiveCellPossibility(4);
    expect(data.grid[0].possibilities.includes(5)).toBe(true);
    expect(data.grid[0].possibilities.includes(4)).toBe(false);
  });
});

describe('When SudokuData.clearActiveCell is called', () => {
  it('should clear any existing active cell.', () => {
    const data = new SudokuData();
    data.setActiveCell(40);
    data.clearActiveCell();
    expect(data.grid[40].active).toBe(false);
    expect(data.activeCell).toBe(null);
  });
});

describe('When SudokuData.calculateCellPossibilities is called', () => {
  it('should populate appropriate number possibilities for all cells.', () => {
    const data = new SudokuData();
    data.grid[0].number = 1;
    data.grid[1].number = 2;
    data.grid[2].number = 3;
    data.grid[3].number = 4;
    data.grid[4].number = 5;
    data.grid[22].number = 9;
    data.grid[26].number = 3;
    data.grid[32].number = 6;
    data.calculateCellPossibilities();
    expect(data.grid[5].possibilities[0]).toBe(7);
    expect(data.grid[5].possibilities[1]).toBe(8);
    expect(data.grid[23].possibilities[0]).toBe(1);
    expect(data.grid[23].possibilities[1]).toBe(2);
    expect(data.grid[23].possibilities[2]).toBe(7);
    expect(data.grid[23].possibilities[3]).toBe(8);
  });
});

describe('When SudokuData.populateCellsWithSinglePossibility is called', () => {
  it('should populate a number into every cell that has only 1 possibility.', () => {
    const data = new SudokuData();
    data.grid[0].number = 1;
    data.grid[1].number = 2;
    data.grid[2].number = 3;
    data.grid[4].number = 5;
    data.grid[5].number = 6;
    data.grid[6].number = 7;
    data.grid[7].number = 8;
    data.grid[8].number = 9;
    data.grid[9].number = 4;
    data.grid[11].number = 6;
    data.grid[18].number = 7;
    data.grid[19].number = 8;
    data.grid[20].number = 9;
    data.grid[38].number = 1;
    data.grid[47].number = 2;
    data.grid[56].number = 4;
    data.grid[65].number = 5;
    data.grid[74].number = 8;
    data.calculateCellPossibilities();
    expect(data.grid.filter((c) => c.possibilities.length === 1).length).toBe(
      3,
    );
    expect(data.grid.filter((c) => !!c.number).length).toBe(18);
    data.populateCellsWithSinglePossibility();
    data.calculateCellPossibilities();
    expect(data.grid.filter((c) => c.possibilities.length === 1).length).toBe(
      0,
    );
    expect(data.grid.filter((c) => !!c.number).length).toBe(21);
    expect(data.grid[3].number).toBe(4);
    expect(data.grid[10].number).toBe(5);
    expect(data.grid[29].number).toBe(7);
  });
});

describe('When SudokuData.getEmptyCellCount is called', () => {
  it('should return the number of cells in the grid that do not have a number assigned.', () => {
    const data = new SudokuData();
    expect(data.getEmptyCellCount()).toBe(81);
    data.grid[0].number = 1;
    data.grid[12].number = 2;
    data.grid[24].number = 3;
    expect(data.getEmptyCellCount()).toBe(78);
    data.grid[44].number = 5;
    data.grid[56].number = 6;
    data.grid[61].number = 7;
    data.grid[73].number = 8;
    expect(data.getEmptyCellCount()).toBe(74);
    data.grid[8].number = 9;
    data.grid[26].number = 4;
    data.grid[11].number = 6;
    data.grid[18].number = 7;
    data.grid[59].number = 8;
    expect(data.getEmptyCellCount()).toBe(69);
    data.grid[20].number = 9;
    data.grid[38].number = 1;
    data.grid[47].number = 2;
    data.grid[51].number = 4;
    data.grid[65].number = 5;
    data.grid[74].number = 8;
    expect(data.getEmptyCellCount()).toBe(63);
  });
});
