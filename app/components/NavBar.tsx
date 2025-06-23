import React from 'react';
import styles from './NavBar.module.css';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from '../store/user.slice';
import { auth } from '../utils/firebase';
import Menu from './Menu';
import AccountCircleIcon from './Icons/AccountCircle';
import DoorOpenIcon from './Icons/DoorOpen';
import FaceIcon from './Icons/Face';
import { useLocation, useNavigate } from 'react-router';
import IconButton from './IconButton';
import CottageIcon from './Icons/Cottage';
import SupervisedUserCircleIcon from './Icons/SupervisedUserCircle';
import { useSessionStorage } from '@uidotdev/usehooks';
import { selectPlayCampaign, selectPlayCharacters } from 'app/store/playEvent.slice';
import Button from './Button';

const NavBar: React.FC = () => {
  const firebaseUser = useSelector(selectFirebaseUser);
  const navigate = useNavigate();
  const location = useLocation();
  const isPlayPath = location.pathname.startsWith('/play');
  const [ playDetails ] = useSessionStorage<{
    campaignId: string | null;
    characterId: string | null;
    playId: string | null;
  } | null> ('_play', null);
  const campaign = useSelector(selectPlayCampaign);
  const characters = useSelector(selectPlayCharacters);
  // @NOTE: The reason we don't just rely on the campaign selector is that it
  // doesn't go away when the play session ends. It will always return the last
  // campaign that was played, even if the user is not currently playing a campaign.
  const playCampaign = playDetails ? campaign : null;
  const myCharacter = characters.find(c => c.id === playDetails?.characterId);

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
    }]);
  }

  if (playCampaign) {
    menuItems.push({
      label: 'View Campaigns',
      onClick: () => {
        navigate('/campaigns');
      },
      icon: <CottageIcon />,
    });
  }

  menuItems.push({
    label: 'Logout',
    onClick: logout,
    icon: <DoorOpenIcon />,
  });

  if (!firebaseUser) {
    return null;
  }

  return (
    <nav className={styles.wrapper}>
      <div className={styles.left}>
        { !playCampaign && 
          <IconButton onClick={() => navigate('/')}>
            <CottageIcon />
          </IconButton>
        }
        { playCampaign && isPlayPath &&
          <Menu
            icon={<CottageIcon />}
            text={{ trigger: 'Dashboard' }}
            items={[
              {
                label: 'Dashboard',
                icon: <CottageIcon />,
                onClick: () => navigate('/play'),
              },
              {
                label: 'My Character',
                icon: <FaceIcon />,
                onClick: () => navigate('/play/characters/' + myCharacter?.id),
              },
            ]}
          />    
        }
        { !!playCampaign && !isPlayPath &&
          <Button
            onClick={() => navigate('/play')}
            type="infoBubble"
            noTextWrap
          >Back to Game</Button>
        }
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