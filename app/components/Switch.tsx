import React from 'react';
import styles from './Switch.module.css';
import { Switch as BaseSwitch } from '@base-ui-components/react/switch';

interface SwitchProps {
  children?: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  children, checked, onCheckedChange, disabled, loading,
}) => {

  return (
    <div className={`${styles.wrapper} ${loading ? styles.loading : ''}`}>
      <BaseSwitch.Root
        className={styles.switch}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled || loading}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {children && <span className={styles.label}>{children}</span>}
    </div>
  );
};

export default Switch;