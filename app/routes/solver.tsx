import { SudokuData } from '~/lib/sudokuData';
import SudokuGrid from '~/components/SudokuGrid';

export default function SolverRoute() {
  const sudokuData = new SudokuData();

  return (
    <div>
      <div className="text-center font-logo text-2xl">Solver</div>
      {sudokuData && <SudokuGrid data={sudokuData} />}
    </div>
  );
}
