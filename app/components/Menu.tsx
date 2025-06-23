import React from 'react';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import styles from './Menu.module.css';
import inputStyles from './Input.module.css';
import MenuIcon from './Icons/Menu';
import IconButton from './IconButton';
import ChevronIcon from './Icons/Chevron';

export interface MenuItemProps {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  separator?: boolean;
}

interface MenuProps {
  items: MenuItemProps[];
  icon?: React.ReactNode;
  text?: {
    label?: string;
    trigger: string;
  };
  disabled?: boolean;
  loading?: boolean;
}

const Menu: React.FC<MenuProps> = ({ items, icon, loading, disabled, text }) => {
  const [ open, setOpen ] = React.useState(false);

  return (
    <BaseMenu.Root onOpenChange={setOpen} disabled={disabled || loading}>
      {!!text?.label &&
        <div className={inputStyles.textLabelMenu}>
          {text.label}
        </div>
      }
      <BaseMenu.Trigger className={`${styles.trigger} ${text ? inputStyles.inputMenu : ''}`}>
        {(!text || icon) &&
          <IconButton asDiv active={open}>
            {icon || <MenuIcon />}
          </IconButton>
        }
        {!!text &&
          <div className={styles.textTrigger}>
            {text.trigger}
            <ChevronIcon position={open ? 'up' : 'down'} size="24" color="var(--secondaryTextColor)" />
          </div>
        }
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