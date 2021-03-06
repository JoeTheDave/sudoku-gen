import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { v4 as uuidv4 } from 'uuid';

export default function IndexRoute() {
  const navigate = useNavigate();
  const seed = uuidv4();

  useEffect(() => {
    navigate(`/${seed}/medium`);
  }, []);

  return <></>;
}
