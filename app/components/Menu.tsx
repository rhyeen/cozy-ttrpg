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
  disabled?: boolean;
  loading?: boolean;
}

const Menu: React.FC<MenuProps> = ({ items, icon, loading, disabled }) => {
  const [ open, setOpen ] = React.useState(false);

  return (
    <BaseMenu.Root onOpenChange={setOpen} disabled={disabled || loading}>
      <BaseMenu.Trigger className={styles.trigger}>
        <IconButton asDiv active={open}>
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
                  onClick={item.onClick ? (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (item.onClick) {
                      item.onClick();
                    }
                  } : undefined}
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