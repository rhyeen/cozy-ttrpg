import React from 'react';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import styles from './Menu.module.css';
import inputStyles from './Input.module.css';
import MenuIcon from './Icons/Menu';
import IconButton from './IconButton';
import ChevronIcon from './Icons/Chevron';
import { useWindowSize } from '@uidotdev/usehooks';

export interface MenuItemProps {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  separator?: boolean;
  subMenu?: MenuItemProps[];
  // @NOTE: Purely for parent to keep track of child.
  value?: string;
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
  const width = useWindowSize().width;
  const isMobile = width ? width < 500 : false;

  return (
    <BaseMenu.Root onOpenChange={setOpen} disabled={disabled || loading}>
      {!!text?.label &&
        <div className={inputStyles.textLabelMenu}>
          {text.label}
        </div>
      }
      <BaseMenu.Trigger className={`
          ${styles.trigger}
          ${text ? text.label ? inputStyles.inputMenu : styles.textTrigger : ''}
          ${open ? styles.open : ''}
        `}>
        {(!text) &&
          <IconButton asDiv active={open}>
            {icon || <MenuIcon />}
          </IconButton>
        }
        {!!text &&
          <div className={`${styles.textTriggerText} ${open ? styles.open : ''}`}>
            {!!icon &&
              <div className={styles.textTriggerTextIcon}>
                <IconButton asDiv>{icon}</IconButton>
              </div>
            }
            {text.trigger}
            <div className={styles.textTriggerTextIcon}>
              <ChevronIcon position={open ? 'up' : 'down'} size="24" />
            </div>
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
              if (item.subMenu && item.subMenu.length > 0) {
                return (
                  <BaseMenu.Root key={index}>
                    <BaseMenu.SubmenuTrigger
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
                      <ChevronIcon position={isMobile ? 'down' : 'right'} size="24" />
                    </BaseMenu.SubmenuTrigger>
                    <BaseMenu.Portal>
                      <BaseMenu.Positioner
                        className={styles.positioner}
                        sideOffset={0}
                        alignOffset={-8}
                        side={isMobile ? 'bottom' : 'right'}
                      >
                        <BaseMenu.Popup className={styles.popup}>
                          {item.subMenu.map((subItem, subIndex) => {
                            if (subItem.separator) {
                              return <BaseMenu.Separator key={subIndex} className={styles.separator} />;
                            }
                            return (
                              <BaseMenu.Item
                                key={subIndex}
                                onClick={subItem.onClick ? (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (subItem.onClick) {
                                    subItem.onClick();
                                  }
                                } : undefined}
                                className={styles.item}
                              >
                                {subItem.icon && <span className={styles.icon}>{subItem.icon}</span>}
                                {subItem.label}
                              </BaseMenu.Item>
                            );
                          })}
                        </BaseMenu.Popup>
                      </BaseMenu.Positioner>
                    </BaseMenu.Portal>
                  </BaseMenu.Root>
                )
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