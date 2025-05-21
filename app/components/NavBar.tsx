import React from 'react';
import styles from './NavBar.module.css';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from '../store/userSlice';
import { auth } from '../utils/firebase';
import Menu from './Menu';
import AccountCircleIcon from './Icons/AccountCircle';
import DoorOpenIcon from './Icons/DoorOpen';
import FaceIcon from './Icons/Face';
import { useNavigate } from 'react-router';
import IconButton from './IconButton';
import CottageIcon from './Icons/Cottage';
import SupervisedUserCircleIcon from './Icons/SupervisedUserCircle';

const NavBar: React.FC = () => {
  const firebaseUser = useSelector(selectFirebaseUser);
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
  };

  const menuItems = [];
  if (firebaseUser) {
    menuItems.push(...[{
      label: 'Profile',
      onClick: () => {
        navigate('/profile');
      },
      icon: <AccountCircleIcon />,
    },
    {
      label: 'Characters',
      onClick: () => {
        navigate('/characters');
      },
      icon: <FaceIcon />,
    },
    {
      label: 'Friends',
      onClick: () => {
        navigate('/friends');
      },
      icon: <SupervisedUserCircleIcon />,
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
        <IconButton onClick={() => navigate('/')}>
          <CottageIcon />
        </IconButton>
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