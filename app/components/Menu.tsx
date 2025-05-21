import React from 'react';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import styles from './Menu.module.css';
import MenuIcon from './Icons/Menu';
import IconButton from './IconButton';

export interface MenuItemProps {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  separator?: boolean;
}

interface MenuProps {
  items: MenuItemProps[];
  icon?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ items, icon }) => {
  const [ open, setOpen ] = React.useState(false);

  return (
    <BaseMenu.Root onOpenChange={setOpen}>
      <BaseMenu.Trigger className={styles.trigger}>
        <IconButton asDiv onClick={() => {}} active={open}>
          {icon || <MenuIcon />}
        </IconButton>
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner className={styles.positioner} sideOffset={-3}>
          <BaseMenu.Popup className={styles.popup}>
            {items.map((item, index) => {
              if (item.separator) {
                return <BaseMenu.Separator key={index} className={styles.separator} />;
              }
              return (
                <BaseMenu.Item
                  key={index}
                  onClick={item.onClick}
                  className={styles.item}
                >
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  {item.label}
                </BaseMenu.Item>
              );
            })}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
};

export default Menu;