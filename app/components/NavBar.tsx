import React from 'react';
import styles from './NavBar.module.css';
import Button from './Button';

interface Props {
  user: { email: string } | undefined;
}

const NavBar: React.FC<Props> = ({ user }) => {
  return (
    <nav className={styles.wrapper}>
      {user ? (
        <span>{user.email}</span> 
      ) : (
        <Button>Sign In</Button>
      )}
    </nav>
  );
};

export default NavBar;