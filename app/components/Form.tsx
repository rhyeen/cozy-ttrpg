import React from 'react';
import styles from './Form.module.css';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
}

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default Form;