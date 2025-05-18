import React from 'react';
import styles from './NavBar.module.css';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from '../store/userSlice';
import Button from './Button';
import { auth } from '../utils/firebase';

const NavBar: React.FC = () => {
  const firebaseUser = useSelector(selectFirebaseUser);

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.left}>
        {!!firebaseUser && <span>{firebaseUser.email}</span>}
      </div>
      <div className={styles.right}>
        {!!firebaseUser && (
          <Button onClick={logout} type="secondary">
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;