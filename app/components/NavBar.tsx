import React from 'react';
import styles from './NavBar.module.css';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from '~/store/userSlice';

const NavBar: React.FC = () => {
  const firebaseUser = useSelector(selectFirebaseUser);
  return (
    <nav className={styles.wrapper}>
      {firebaseUser && <span>Welcome, {firebaseUser.email}</span>}
    </nav>
  );
};

export default NavBar;