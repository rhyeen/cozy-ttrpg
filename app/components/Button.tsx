import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type: 'primary' | 'secondary' | 'smallText' | 'icon' | 'infoBubble';
  submit?: boolean;
  disabled?: boolean;
  loading?: boolean;
  asComponent?: React.ElementType;
  noTextWrap?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type,
  submit = false,
  disabled = false,
  loading = false,
  asComponent = 'button',
  noTextWrap = false,
}) => {
  const Component = asComponent;
  return (
    <Component
      onClick={onClick}
      className={`${styles.wrapper} ${styles[type]} ${noTextWrap ? styles.noTextWrap : ''}`}
      type={submit ? 'submit' : 'button'}
      disabled={disabled || loading}
    >
      <div className={styles.innerWrapper}>
        {children}
      </div>
    </Component>
  );
};

export default Button;