import React from 'react';
import styles from './Radio.module.css';
import { Radio as BaseRadio } from '@base-ui-components/react/radio';
import { RadioGroup } from '@base-ui-components/react';

interface RadioListProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  label?: string;
}

interface RadioItemProps {
  disabled?: boolean;
  loading?: boolean;
  value: string;
  children: React.ReactNode;
}

type RadioComponent = React.FC<RadioListProps> & {
  Item: React.FC<RadioItemProps>;
};

const RadioList: React.FC<RadioListProps> = ({
  children,
  value,
  onValueChange,
  label,
  disabled = false,
  loading = false,
}) => {
  const handleChange = (value: unknown) => {
    if (onValueChange && typeof value === 'string') {
      onValueChange(value);
    }
  };

  return (
    <RadioGroup
      className={`${styles.radioGroup} ${loading ? styles.loading : ''} ${disabled ? styles.disabled : ''}`}
      value={value}
      onValueChange={handleChange}
      disabled={disabled || loading}
    >
      {label && <span className={styles.caption}>{label}</span>}
      {React.Children.map(children, (child) =>
        React.isValidElement<RadioItemProps>(child) && child.type === RadioItem
          ? React.cloneElement(child, {
              loading,
              disabled,
            } as Partial<RadioItemProps>)
          : child
      )}
    </RadioGroup>
  );
};

const RadioItem: React.FC<RadioItemProps> = ({
  value,
  disabled = false,
  loading = false,
  children,
}) => {
  return (
    <label className={styles.item}>
      <BaseRadio.Root
        className={`${styles.radio} ${loading ? styles.loading : ''} ${disabled ? styles.disabled : ''}`}
        value={value}
        disabled={disabled || loading}
      >
        <BaseRadio.Indicator className={styles.indicator} />
      </BaseRadio.Root>
      <span className={styles.label}>{children}</span>
    </label>
  );
};

const Radio: RadioComponent = Object.assign(RadioList, {
  Item: RadioItem,
});

export default Radio;