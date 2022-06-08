import type { FC } from 'react';

const Layout: FC = ({ children }) => {
  return (
    <div>
      <div className="text-center font-logo text-5xl text-gray-500 mt-10">
        Sudoku
      </div>
      {children}
    </div>
  );
};

export default Layout;
