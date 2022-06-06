import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

export default function SeedIndexRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`medium`);
  }, []);

  return <></>;
}
