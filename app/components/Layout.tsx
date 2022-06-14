import type { FC } from 'react';
import { useNavigate } from '@remix-run/react';
import { v4 as uuidv4 } from 'uuid';
import MenuLink from '~/components/MenuLink';
import svg from '~/assets/settings.svg';

const Layout: FC = ({ children }) => {
  const navigate = useNavigate();
  const seed = uuidv4();

  return (
    <div className="relative">
      <div className="hover-zone">
        <div className="font-bold text-gray-700">New Puzzle</div>
        <div className="flex justify-between w-80 mb-5">
          <MenuLink clickHandler={() => navigate(`/${seed}/gentle`)}>
            Gentle
          </MenuLink>
          <MenuLink clickHandler={() => navigate(`/${seed}/easy`)}>
            Easy
          </MenuLink>
          <MenuLink clickHandler={() => navigate(`/${seed}/medium`)}>
            Medium
          </MenuLink>
          <MenuLink clickHandler={() => navigate(`/${seed}/hard`)}>
            Hard
          </MenuLink>
          <MenuLink clickHandler={() => navigate(`/${seed}/extreme`)}>
            Extreme
          </MenuLink>
        </div>
        <div className="font-bold text-gray-700">Tools</div>
        <div className="flex justify-between w-80 mb-5">
          <MenuLink clickHandler={() => navigate(`/solver`)}>Solver</MenuLink>
        </div>
        <img src={svg} className="settings-icon" alt="settings-icon" />
      </div>
      <div className="text-center font-logo text-5xl text-gray-500 mt-10">
        Sudoku
      </div>
      {children}
    </div>
  );
};

export default Layout;
