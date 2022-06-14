import type { FC } from 'react';

interface MenuLinkProps {
  clickHandler: () => void;
}

const MenuLink: FC<MenuLinkProps> = ({ children, clickHandler }) => {
  return (
    <div
      className="cursor-pointer text-white text-shadow hover:text-green-300 font-bold font-logo"
      onClick={clickHandler}
    >
      {children}
    </div>
  );
};

export default MenuLink;
