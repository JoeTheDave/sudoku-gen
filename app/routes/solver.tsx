import { SudokuData } from '~/lib/sudokuData';
import SudokuGrid from '~/components/SudokuGrid';

import dataSetup from '~/lib/dataSetup';

export default function SolverRoute() {
  const sudokuData = dataSetup.extreme(new SudokuData());

  return (
    <div>
      <div className="text-center font-logo text-2xl">Solver</div>
      {sudokuData && <SudokuGrid data={sudokuData} showSolver />}
    </div>
  );
}
