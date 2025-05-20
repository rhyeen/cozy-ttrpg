import React from 'react';
import styles from './NavBar.module.css';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from '../store/userSlice';
import { auth } from '../utils/firebase';
import Menu from './Menu';
import AccountCircleIcon from './Icons/AccountCircle';
import DoorOpenIcon from './Icons/DoorOpen';
import FaceIcon from './Icons/Face';

const NavBar: React.FC = () => {
  const firebaseUser = useSelector(selectFirebaseUser);

  const logout = async () => {
    await auth.signOut();
  };

  const menuItems = [];
  if (firebaseUser) {
    menuItems.push(...[{
      label: 'Profile',
      onClick: () => {},
      icon: <AccountCircleIcon />,
    },
    {
      label: 'Characters',
      onClick: () => {},
      icon: <FaceIcon />,
    },
    {
      label: 'Logout',
      onClick: logout,
      icon: <DoorOpenIcon />,
    }]);
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <nav className={styles.wrapper}>
      <div className={styles.left}>
        {firebaseUser.email}
      </div>
      <div className={styles.right}>
        <Menu
          items={menuItems}
        />
      </div>
    </nav>
  );
};

export default NavBar;