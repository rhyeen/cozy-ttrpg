import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type: 'primary' | 'secondary';
  submit?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type,
  submit = false,
  disabled = false,
  loading = false,
}) => {
  const buttonClass = type === 'secondary' ? styles.secondary : styles.primary;

  return (
    <button
      onClick={onClick}
      className={`${styles.wrapper} ${buttonClass}`}
      type={submit ? 'submit' : 'button'}
      disabled={disabled || loading}
    >
      <div className={styles.innerWrapper}>
        {children}
      </div>
    </button>
  );
};

export default Button;