import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ params }) => {
  return {
    params,
  };
};

type LoaderData = {
  params: {
    seed: string;
    difficulty: string;
  };
};

export default function DifficultyRoute() {
  const { params } = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="text-center font-logo text-2xl">{params.difficulty}</div>
    </div>
  );
}
