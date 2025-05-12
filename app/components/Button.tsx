import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'primary' }) => {
  const buttonClass = type === 'secondary' ? styles.secondary : styles.primary;

  return (
    <button
      onClick={onClick}
      className={`${styles.wrapper} ${buttonClass}`}
    >
 {children}
    </button>
  );
};

export default Button;