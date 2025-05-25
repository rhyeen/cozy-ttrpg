import React from 'react';
import styles from './Card.module.css';
import Divider from './Divider';

interface CardProps {
  children: React.ReactNode;
  noBorder?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
}

type CardHeaderComponent = React.FC<CardHeaderProps> & {
  Left: React.FC<{ children: React.ReactNode }>;
  Right: React.FC<{ children: React.ReactNode }>;
}

type CardComponent = React.FC<CardProps> & {
  Header: CardHeaderComponent;
  Body: React.FC<CardBodyProps>;
};

const CardBase: React.FC<CardProps> = ({ children, onClick, noBorder }) => {
  return (
    <section
      className={`${styles.wrapper} ${onClick ? styles.clickable : ''} ${noBorder ? styles.noBorder : ''}`}
      onClick={onClick}
    >
      <div className={styles.innerWrapper}>
        {children}
      </div>
    </section>
  );
};

const CardHeaderLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.headerLeft}>
      {children}
    </div>
  );
};

const CardHeaderRight: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.headerRight}>
      {children}
    </div>
  );
};

const CardHeaderBase: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.header}>
      {children}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children }) => {
  return (
    <div className={styles.body}>
      <Divider />
      {children}
    </div>
  );
};

const CardHeader: CardHeaderComponent = Object.assign(CardHeaderBase, {
  Left: CardHeaderLeft,
  Right: CardHeaderRight,
});

const Card: CardComponent = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
});

Card.Header.Left = CardHeader.Left;
Card.Header.Right = CardHeader.Right;

export default Card;