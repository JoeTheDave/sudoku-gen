import {
  compact,
  flatten,
  intersection,
  keys,
  min,
  range,
  sortBy,
  uniq,
  values,
} from 'lodash';
import { Random } from '~/lib/random';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'evil';

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
  rowId: number;
  colId: number;
  gridId: number;

  constructor(rowId: number, colId: number) {
    this.id = rowId * 9 + colId;
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
    this.rowId = rowId;
    this.colId = colId;
    this.gridId = Math.floor(rowId / 3) * 3 + Math.floor(colId / 3);
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
  useSkewerStrategy: boolean;
  useMatchedSetStrategy: boolean;

  constructor(data: SudokuData | null = null) {
    if (data) {
      this.grid = data.grid;
      this.activeCell = data.activeCell;
      this.useSkewerStrategy = data.useSkewerStrategy;
      this.useMatchedSetStrategy = data.useMatchedSetStrategy;
    } else {
      this.grid = flatten(
        range(9).reduce(
          (rows, rowId) => [
            ...rows,
            range(9).reduce(
              (cells, colId) => [...cells, new Cell(rowId, colId)],
              [] as Cell[],
            ),
          ],
          [] as Cell[][],
        ),
      );

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
      this.useSkewerStrategy = false;
      this.useMatchedSetStrategy = false;
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

  calculateCellPossibilities = () => {
    this.grid.forEach((cell) => {
      if (cell.number) {
        cell.possibilities = [];
      } else {
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
    let exitCondition = false;
    if (this.useSkewerStrategy || this.useMatchedSetStrategy) {
      do {
        const preliminaryPossibilitiesCount = this.getTotalPossibilitiesCount();
        if (this.useSkewerStrategy) {
          this.eliminateSkeweredPossibilities();
        }
        if (this.useMatchedSetStrategy) {
          this.eliminateMatchedSetAssociationPossibilities();
        }
        const PossibilitiesCount = this.getTotalPossibilitiesCount();
        if (
          PossibilitiesCount === 0 ||
          PossibilitiesCount === preliminaryPossibilitiesCount
        ) {
          exitCondition = true;
        }
      } while (!exitCondition);
    }
  };

  populateCellsWithSinglePossibility = () => {
    this.grid.forEach((cell) => {
      if (!cell.number && cell.possibilities.length === 1) {
        cell.number = cell.possibilities[0];
      }
    });
  };

  getEmptyCellCount = () => this.grid.filter((c) => !c.number).length;

  getRowListByRowId = (rowId: number) =>
    range(rowId * 9, rowId * 9 + 9).map((cellId) => this.grid[cellId]);

  getColListByColId = (colId: number) =>
    range(colId, 81, 9).map((cellId) => this.grid[cellId]);

  getGridListByGridId = (gridId: number) => {
    const gridRoot = (gridId % 3) * 3 + Math.floor(gridId / 3) * 27;
    return flatten(
      range(gridRoot, gridRoot + 27, 9).map((gridRowRoot) =>
        range(gridRowRoot, gridRowRoot + 3),
      ),
    ).map((cellId) => this.grid[cellId]);
  };

  populateSingleOptionInListForNumber = (
    listGenerator: (entityId: number) => Cell[],
  ) =>
    range(0, 9).forEach((entityId) => {
      const cellList: Cell[] = listGenerator(entityId);
      range(1, 10).forEach((num) => {
        const options: Cell[] = cellList.filter((cell) =>
          cell.possibilities.includes(num),
        );
        if (options.length === 1) {
          options[0].number = num;
        }
      });
    });

  getTotalPossibilitiesCount = () =>
    this.grid.reduce(
      (possibilitiesCount, cell) =>
        possibilitiesCount + cell.possibilities.length,
      0,
    );

  eliminateSkeweredPossibilities = () => {
    range(9).forEach((gridId) => {
      const gridCells = this.getGridListByGridId(gridId);
      range(1, 10).forEach((num) => {
        const options = gridCells.filter((cell) =>
          cell.possibilities.includes(num),
        );
        const [possibilityRows, possibilityCols] = options.reduce(
          (collection, option) => [
            uniq([...collection[0], option.rowId]),
            uniq([...collection[1], option.colId]),
          ],
          [[], []] as number[][],
        );
        if (possibilityRows.length === 1) {
          this.getRowListByRowId(possibilityRows[0]).forEach((rowCell) => {
            if (
              rowCell.gridId !== gridId &&
              rowCell.possibilities.includes(num)
            ) {
              rowCell.possibilities = rowCell.possibilities.filter(
                (possibility) => possibility !== num,
              );
            }
          });
        }
        if (possibilityCols.length === 1) {
          this.getColListByColId(possibilityCols[0]).forEach((colCell) => {
            if (
              colCell.gridId !== gridId &&
              colCell.possibilities.includes(num)
            ) {
              colCell.possibilities = colCell.possibilities.filter(
                (possibility) => possibility !== num,
              );
            }
          });
        }
      });
    });
  };

  // Untested
  findMatchedSet = (cells: Cell[], count: number) =>
    values(
      cells
        .filter((cell) => cell.possibilities.length === count)
        .reduce((matches, cell) => {
          matches[cell.possibilities.join('')] = [
            ...(matches[cell.possibilities.join('')] || []),
            cell,
          ];
          return matches;
        }, {} as { [key: string]: Cell[] }),
    ).find((candidate) => candidate.length === count) || null;

  // Untested
  processMatchedSetAssociations = (matchedSet: Cell[], associations: Cell[]) =>
    associations.forEach((cell) => {
      if (!matchedSet.includes(cell)) {
        cell.possibilities = cell.possibilities.filter(
          (possibility) => !matchedSet[0].possibilities.includes(possibility),
        );
      }
    });

  // Untested
  eliminateMatchedSetAssociationPossibilities = () =>
    range(9).forEach((entityId) => {
      const rowCells = this.getRowListByRowId(entityId);
      const rowMatchedSet =
        this.findMatchedSet(rowCells, 2) || this.findMatchedSet(rowCells, 3);
      if (rowMatchedSet) {
        this.processMatchedSetAssociations(rowMatchedSet, rowCells);
      }

      const colCells = this.getColListByColId(entityId);
      const colMatchedSet =
        this.findMatchedSet(colCells, 2) || this.findMatchedSet(colCells, 3);
      if (colMatchedSet) {
        this.processMatchedSetAssociations(colMatchedSet, colCells);
      }

      const gridCells = this.getGridListByGridId(entityId);
      const gridMatchedSet =
        this.findMatchedSet(gridCells, 2) || this.findMatchedSet(gridCells, 3);
      if (gridMatchedSet) {
        this.processMatchedSetAssociations(gridMatchedSet, gridCells);
      }
    });

  // Untested
  getEmptyCells = () => this.grid.filter((cell) => !cell.number);

  // Untested
  getEmptyCellsWithPossibilities = () =>
    this.getEmptyCells().filter((cell) => cell.possibilities.length);

  // Untested
  getSmallestConflictValuesForCell = (cell: Cell) => {
    const conflictsReport = range(1, 10).reduce((outcomes, number) => {
      outcomes[`${number}`] = cell.allAssociations.filter(
        (association) => association.number === number,
      ).length;
      return outcomes;
    }, {} as { [key: string]: number });
    const smallestConflictCountKey = keys(conflictsReport).sort((a, b) =>
      conflictsReport[a] > conflictsReport[b] ? 1 : -1,
    )[0];
    const smallestConflictCountValue =
      conflictsReport[smallestConflictCountKey];
    return keys(conflictsReport)
      .filter((key) => conflictsReport[key] === smallestConflictCountValue)
      .map((val) => parseInt(val));
  };

  // Untested
  generateRandomGridFromSeed = (randomSeed: string) => {
    const rand = new Random(randomSeed);
    this.grid.forEach((cell) => {
      cell.number = null;
      cell.active = false;
      cell.userDefined = false;
      cell.possibilities = [];
    });
    this.activeCell = null;

    let exitCondition = false;
    let iterationCount = 0;
    do {
      if (iterationCount >= 120) {
        range(20).forEach(() => {
          const filledCells = this.grid.filter((cell) => cell.number);
          rand.randomSelection(filledCells).number = null;
        });
        iterationCount = 80;
      }
      this.calculateCellPossibilities();

      let selectionOptions = this.getEmptyCellsWithPossibilities();
      if (selectionOptions.length === 0) {
        selectionOptions = this.getEmptyCells();
      }
      const selection = rand.randomSelection(selectionOptions);
      if (selection.possibilities.length) {
        selection.number = rand.randomSelection(selection.possibilities);
      } else {
        const forceNumber = rand.randomSelection(
          this.getSmallestConflictValuesForCell(selection),
        );
        selection.number = forceNumber;
        selection.allAssociations.forEach((associatedCell) => {
          if (associatedCell.number === selection.number) {
            associatedCell.number = null;
          }
        });
      }
      this.calculateCellPossibilities();
      iterationCount += 1;
      if (this.getEmptyCells().length === 0) {
        exitCondition = true;
      }
    } while (!exitCondition);
  };

  // Untested
  applyPuzzleData = (numberGrid: Cell[], applyIds: number[]) => {
    applyIds.forEach((id) => (this.grid[id].number = numberGrid[id].number));
  };

  // Untested
  runSolverForDifficulty = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        this.executeAlphaSolution();
        break;
      case 'medium':
        this.executeBetaSolution();
        break;
      case 'hard':
        this.executeDeltaSolution();
        break;
      case 'extreme':
        this.executeGammaSolution();
        break;
      case 'evil':
        this.executeOmegaSolution();
        break;
      default:
        throw new Error('Unrecognized difficulty classification');
    }
  };

  // Untested
  getPreviousDifficulty = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'gentle';
      case 'medium':
        return 'easy';
      case 'hard':
        return 'medium';
      case 'extreme':
        return 'hard';
      case 'evil':
        return 'extreme';
      default:
        throw new Error('Unrecognized difficulty classification');
    }
  };

  // Untested
  findFilledCandidateForPuzzle = (rand: Random, puzzleCells: number[]) => {
    const collections = flatten(
      range(9).map((i) => [
        this.getRowListByRowId(i).map((c) => c.id),
        this.getColListByColId(i).map((c) => c.id),
        this.getGridListByGridId(i).map((c) => c.id),
      ]),
    );
    const leastOccupancy = min(
      collections.map(
        (collection) => intersection(collection, puzzleCells).length,
      ),
    );
    const collectionOptions = collections.filter(
      (collection) =>
        intersection(collection, puzzleCells).length === leastOccupancy,
    );
    const targetCollection = rand.randomSelection(collectionOptions);

    return rand.randomSelection(
      targetCollection.filter((num) => !puzzleCells.includes(num)),
    );
  };

  // Untested
  runPuzzleAttempt = (
    solution: Cell[],
    puzzleCells: number[],
    difficulty: Difficulty,
  ) => {
    const attempt = new SudokuData();
    attempt.applyPuzzleData(solution, puzzleCells);
    attempt.runSolverForDifficulty(difficulty);

    return attempt.getEmptyCellCount();
  };

  // Untested
  generatePuzzle = (randomSeed: string, difficulty: Difficulty) => {
    const rand = new Random(randomSeed);
    const solutionGrid = new SudokuData();
    solutionGrid.generateRandomGridFromSeed(randomSeed);
    const previousDifficulty = this.getPreviousDifficulty(
      difficulty,
    ) as Difficulty;

    const puzzleCells: number[] = [];
    let exitCondition = false;
    do {
      puzzleCells.push(this.findFilledCandidateForPuzzle(rand, puzzleCells));
      if (puzzleCells.length > 10) {
        const canBeSolvedByTargetDifficulty =
          this.runPuzzleAttempt(solutionGrid.grid, puzzleCells, difficulty) ===
          0;
        const canBeSolvedByPreviousDifficulty =
          this.runPuzzleAttempt(
            solutionGrid.grid,
            puzzleCells,
            previousDifficulty,
          ) === 0;
        if (canBeSolvedByPreviousDifficulty) {
          range(5).forEach(() => {
            puzzleCells.shift();
          });
        }

        if (canBeSolvedByTargetDifficulty && !canBeSolvedByPreviousDifficulty) {
          exitCondition = true;
        }
      }
    } while (!exitCondition);
    this.applyPuzzleData(solutionGrid.grid, puzzleCells);
  };

  // Solves Easy but not Medium
  executeAlphaSolution = () => {
    let exitCondition = false;
    do {
      let preliminaryEmptyCount = this.getEmptyCellCount();
      this.calculateCellPossibilities();
      this.populateCellsWithSinglePossibility();
      let emptyCount = this.getEmptyCellCount();
      if (emptyCount === 0 || emptyCount === preliminaryEmptyCount) {
        exitCondition = true;
        this.calculateCellPossibilities();
      }
    } while (!exitCondition);
  };

  // Solves Medium but not Hard
  executeBetaSolution = () => {
    let exitCondition = false;
    do {
      let preliminaryEmptyCount = this.getEmptyCellCount();
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getGridListByGridId);
      this.executeAlphaSolution();
      let emptyCount = this.getEmptyCellCount();
      if (emptyCount === 0 || emptyCount === preliminaryEmptyCount) {
        exitCondition = true;
      }
    } while (!exitCondition);
  };

  // Solves Hard but not Extreme
  executeDeltaSolution = () => {
    let exitCondition = false;
    do {
      let preliminaryEmptyCount = this.getEmptyCellCount();
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getRowListByRowId);
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getColListByColId);
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getGridListByGridId);
      this.executeAlphaSolution();
      let emptyCount = this.getEmptyCellCount();
      if (emptyCount === 0 || emptyCount === preliminaryEmptyCount) {
        exitCondition = true;
      }
    } while (!exitCondition);
  };

  // Solves Extreme but not Evil
  executeGammaSolution = () => {
    this.useSkewerStrategy = true;
    this.useMatchedSetStrategy = true;
    let exitCondition = false;
    do {
      let preliminaryEmptyCount = this.getEmptyCellCount();
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getRowListByRowId);
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getColListByColId);
      this.calculateCellPossibilities();
      this.populateSingleOptionInListForNumber(this.getGridListByGridId);
      this.executeAlphaSolution();
      let emptyCount = this.getEmptyCellCount();
      if (emptyCount === 0 || emptyCount === preliminaryEmptyCount) {
        exitCondition = true;
      }
    } while (!exitCondition);
    this.useSkewerStrategy = false;
    this.useMatchedSetStrategy = false;
  };

  // Solves Evil ???
  executeOmegaSolution = () => {
    throw new Error('Not Implemented');
    // Can employ the Hidden Set strategy and the X-Wing strategy
    // https://www.conceptispuzzles.com/index.aspx?uri=puzzle/sudoku/techniques
  };

  solve = () => {
    this.executeGammaSolution();
  };
}
