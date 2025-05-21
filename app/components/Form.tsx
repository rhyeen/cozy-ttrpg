import React from 'react';
import styles from './Form.module.css';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  align?: 'center';
}

const Form: React.FC<FormProps> = ({ children, onSubmit, align }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className={styles.wrapper}
      onSubmit={handleSubmit}
      style={{ alignSelf: align }}
    >
      {children}
    </form>
  );
};

export default Form;