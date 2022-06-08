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
});

describe('When SudokuData is instantiated with existing data', () => {
  const data = new SudokuData();
  data.setActiveCell(40);
  const newData = new SudokuData(data);
  it('should have same values as existing data', () => {
    expect(newData.activeCell?.id).toBe(40);
    expect(newData.getCellById(40).active).toBe(true);
  });
});

describe('When SudokuData.getCellById is called', () => {
  const data = new SudokuData();
  it('should return the cell with id that was passed in', () => {
    const cell = data.getCellById(40);
    expect(cell).not.toBeNull();
    expect(cell?.id).toBe(40);
  });
  it('should throw an error if called with an invalid id', () => {
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
  it('should set the new active cell appropriately', () => {
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
  it('should set the new active cell appropriately', () => {
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
  it('should set the new active cell appropriately', () => {
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
  it('should set the new active cell appropriately', () => {
    data.setActiveCell(data.getCellById(40));
    data.moveActiveCellWest();
    expect(data.activeCell?.id).toBe(39);
  });
});
