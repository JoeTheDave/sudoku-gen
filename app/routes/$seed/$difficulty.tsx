import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { SudokuData } from '~/lib/sudokuData';
import SudokuGrid from '~/components/SudokuGrid';

import type { LoaderFunction } from '@remix-run/server-runtime';
import type { Difficulty } from '~/lib/sudokuData';

export const loader: LoaderFunction = async ({ params }) => {
  return {
    params,
  };
};

type LoaderData = {
  params: {
    seed: string;
    difficulty: Difficulty;
  };
};

export default function DifficultyRoute() {
  const { params } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !['easy', 'medium', 'hard', 'extreme', 'evil'].includes(
        params.difficulty.toLowerCase(),
      )
    ) {
      navigate('/');
    }
  }, [params.difficulty]);

  const sudokuData = new SudokuData();
  sudokuData.generatePuzzle(params.seed, params.difficulty);

  return (
    <div>
      <div className="text-center font-logo text-2xl">{params.difficulty}</div>
      <SudokuGrid data={sudokuData} showSolver />
    </div>
  );
}
