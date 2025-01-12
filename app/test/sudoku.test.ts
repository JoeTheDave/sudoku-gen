import { SudokuData } from '~/lib/sudokuData';
import dataSetup from '~/lib/dataSetup';
import { uniq } from 'lodash';

describe('When SudokuData is instantiated', () => {
  const data = new SudokuData();
  it('Should have cells with appropriate row, column, and grid ids.', () => {
    expect(data.grid[0].rowId).toBe(0);
    expect(data.grid[0].colId).toBe(0);
    expect(data.grid[0].gridId).toBe(0);
    expect(data.grid[12].rowId).toBe(1);
    expect(data.grid[12].colId).toBe(3);
    expect(data.grid[12].gridId).toBe(1);
    expect(data.grid[68].rowId).toBe(7);
    expect(data.grid[68].colId).toBe(5);
    expect(data.grid[68].gridId).toBe(7);
    expect(data.grid[80].rowId).toBe(8);
    expect(data.grid[80].colId).toBe(8);
    expect(data.grid[80].gridId).toBe(8);
  });
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

describe('When SudokuData.getEmptyCells is called', () => {
  it('should return all cells in the grid that do not have a number assigned.', () => {
    const data = new SudokuData();
    expect(data.getEmptyCells().length).toBe(81);
    data.grid[0].number = 1;
    data.grid[12].number = 2;
    data.grid[24].number = 3;
    expect(data.getEmptyCells().length).toBe(78);
    data.grid[44].number = 5;
    data.grid[56].number = 6;
    data.grid[61].number = 7;
    data.grid[73].number = 8;
    expect(data.getEmptyCells().length).toBe(74);
    data.grid[8].number = 9;
    data.grid[26].number = 4;
    data.grid[11].number = 6;
    data.grid[18].number = 7;
    data.grid[59].number = 8;
    expect(data.getEmptyCells().length).toBe(69);
    data.grid[20].number = 9;
    data.grid[38].number = 1;
    data.grid[47].number = 2;
    data.grid[51].number = 4;
    data.grid[65].number = 5;
    data.grid[74].number = 8;
    expect(data.getEmptyCells().length).toBe(63);

    data
      .getEmptyCells()
      .map((c) => c.id)
      .forEach((cellId) =>
        expect(
          [
            0, 12, 24, 44, 56, 61, 73, 8, 26, 11, 18, 59, 20, 38, 47, 51, 65,
            74,
          ].includes(cellId),
        ).toBe(false),
      );
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

describe('When SudokuData.getRowListByRowId is called', () => {
  it('should return a list of all cells in the row with the given rowId.', () => {
    const data = new SudokuData();
    const list1 = data.getRowListByRowId(0);
    expect(list1.length).toBe(9);
    expect(list1[0].id).toBe(0);
    expect(list1[3].id).toBe(3);
    expect(list1[6].id).toBe(6);
    const list2 = data.getRowListByRowId(3);
    expect(list2[1].id).toBe(28);
    expect(list2[4].id).toBe(31);
    expect(list2[7].id).toBe(34);
  });
});

describe('When SudokuData.getColListByColId is called', () => {
  it('should return a list of all cells in the column with the given colId.', () => {
    const data = new SudokuData();
    const list1 = data.getColListByColId(0);
    expect(list1.length).toBe(9);
    expect(list1[0].id).toBe(0);
    expect(list1[3].id).toBe(27);
    expect(list1[6].id).toBe(54);
    const list2 = data.getColListByColId(3);
    expect(list2[1].id).toBe(12);
    expect(list2[4].id).toBe(39);
    expect(list2[7].id).toBe(66);
  });
});

describe('When SudokuData.getGridListByGridId is called', () => {
  it('should return a list of all cells in the 3x3 grid with the given gridId.', () => {
    const data = new SudokuData();
    const list1 = data.getGridListByGridId(0);
    expect(list1.length).toBe(9);
    expect(list1[0].id).toBe(0);
    expect(list1[4].id).toBe(10);
    expect(list1[8].id).toBe(20);
    const list2 = data.getGridListByGridId(4);
    expect(list2[1].id).toBe(31);
    expect(list2[3].id).toBe(39);
    expect(list2[5].id).toBe(41);
    expect(list2[7].id).toBe(49);
  });
});

describe('When SudokuData.populateSingleOptionInListForNumber is called', () => {
  it('should analyze the list of cells passed for any numbers in which only one cell is an option and populate that cell with that number.', () => {
    const data = new SudokuData();
    data.grid[3].number = 7;
    data.grid[13].number = 5;
    data.grid[15].number = 7;
    data.grid[25].number = 5;
    data.grid[28].number = 7;
    data.grid[38].number = 5;
    data.grid[56].number = 7;
    data.grid[72].number = 5;
    data.calculateCellPossibilities();
    expect(data.grid.filter((c) => !!c.number).length).toBe(8);
    data.populateSingleOptionInListForNumber(data.getGridListByGridId);
    data.calculateCellPossibilities();
    expect(data.grid.filter((c) => !!c.number).length).toBe(10);
    expect(data.grid[1].number).toBe(5);
    expect(data.grid[18].number).toBe(7);
  });
});

describe('When SudokuData.getTotalPossibilitiesCount is called', () => {
  it('should return the sum total of all possibilities from all cells.', () => {
    const data = new SudokuData();
    data.calculateCellPossibilities();
    expect(data.getTotalPossibilitiesCount()).toBe(9 * 9 * 9);
    data.grid[0].number = 1;
    data.grid[8].number = 2;
    data.grid[72].number = 3;
    data.grid[80].number = 4;
    data.calculateCellPossibilities();
    expect(data.getTotalPossibilitiesCount()).toBe(
      9 * 9 * 9 - (7 * 2 * 4 + 4 * 4 + 4 * 9),
    );
  });
});

describe('When SudokuData.eliminateSkeweredPossibilities is called', () => {
  it('should reduce possibilities in cells by use of the skewer strategy.', () => {
    const data = new SudokuData();
    data.grid[0].number = 1;
    data.grid[1].number = 2;
    data.grid[2].number = 3;
    data.grid[9].number = 4;
    data.grid[10].number = 5;
    data.grid[11].number = 6;
    data.calculateCellPossibilities();
    const rowsHavingTargetPossibility = uniq(
      data
        .getGridListByGridId(0)
        .filter((cell) => cell.possibilities.includes(7))
        .map((cell) => cell.rowId),
    ).length;
    expect(rowsHavingTargetPossibility).toBe(1);
    let cellsInTargetRowWithTargetPossibility = data
      .getRowListByRowId(2)
      .filter((cell) => cell.possibilities.includes(7));
    expect(cellsInTargetRowWithTargetPossibility.length).toBe(9);
    data.eliminateSkeweredPossibilities();
    cellsInTargetRowWithTargetPossibility = data
      .getRowListByRowId(2)
      .filter((cell) => cell.possibilities.includes(7));
    expect(cellsInTargetRowWithTargetPossibility.length).toBe(3);
  });
});

describe('When SudokuData.findNakedSet is called', () => {
  it('should ...', () => {
    const data = new SudokuData();
    data.grid[19].possibilities = [5, 7, 8, 9];
    data.grid[10].possibilities = [5, 7];
    data.grid[11].possibilities = [3, 6, 9];
    data.grid[12].possibilities = [5, 7];
    data.grid[13].possibilities = [3, 5, 6, 9];
    data.grid[14].possibilities = [1, 5, 9];
    data.grid[15].possibilities = [6, 7, 9];
    data.grid[16].possibilities = [1, 2, 3];
    data.grid[17].possibilities = [5, 6, 9];
    const targetRow = data.getRowListByRowId(1);
    console.log(targetRow);
    expect(true).toBe(false);
  });
});

describe('When SudokuData.executeAlphaSolution is called', () => {
  it('should be able to solve the easy puzzle setup.', () => {
    const data = dataSetup.easy(new SudokuData());
    data.executeAlphaSolution();
    expect(data.getEmptyCellCount()).toBe(0);
  });
  it('should not be able to solve the medium puzzle setup.', () => {
    const data = dataSetup.medium(new SudokuData());
    data.executeAlphaSolution();
    expect(data.getEmptyCellCount()).not.toBe(0);
  });
});

describe('When SudokuData.executeBetaSolution is called', () => {
  it('should be able to solve the medium puzzle setup.', () => {
    const data = dataSetup.medium(new SudokuData());
    data.executeBetaSolution();
    expect(data.getEmptyCellCount()).toBe(0);
  });
  it('should not be able to solve the hard puzzle setup.', () => {
    const data = dataSetup.hard(new SudokuData());
    data.executeBetaSolution();
    expect(data.getEmptyCellCount()).not.toBe(0);
  });
});

describe('When SudokuData.executeDeltaSolution is called', () => {
  it('should be able to solve the hard puzzle setup.', () => {
    const data = dataSetup.hard(new SudokuData());
    data.executeDeltaSolution();
    expect(data.getEmptyCellCount()).toBe(0);
  });
  it('should not be able to solve the extreme puzzle setup.', () => {
    const data = dataSetup.extreme(new SudokuData());
    data.executeDeltaSolution();
    expect(data.getEmptyCellCount()).not.toBe(0);
  });
});

describe('When SudokuData.executeGammaSolution is called', () => {
  it('should be able to solve the extreme puzzle setup.', () => {
    const data = dataSetup.extreme(new SudokuData());
    data.executeGammaSolution();
    expect(data.getEmptyCellCount()).toBe(0);
  });
  it('should not be able to solve the evil puzzle setup.', () => {
    const data = dataSetup.evil(new SudokuData());
    data.executeDeltaSolution();
    expect(data.getEmptyCellCount()).not.toBe(0);
  });
});
