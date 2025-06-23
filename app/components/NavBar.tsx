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

  const playCampgaignCharacterSubMenu = [];
  if (myCharacter) {
    playCampgaignCharacterSubMenu.push({
      label: myCharacter.nickname || myCharacter.name || myCharacter.id,
      value: `/play/characters/${myCharacter.id}`,
      onClick: () => navigate(`/play/characters/${myCharacter.id}`),
    });
    if (characters && characters.length > 1) {
      playCampgaignCharacterSubMenu.push({ separator: true });
    }
  }
  playCampgaignCharacterSubMenu.push(...(characters || [])
  .sort((a, b): number => {
    const aName = a.nickname || a.name || a.id;
    const bName = b.nickname || b.name || b.id;
    return aName.localeCompare(bName);
  })
  .filter(character => character.id !== myCharacter?.id)
  .map(character => ({
    label: character.nickname || character.name || character.id,
    value: `/play/characters/${character.id}`,
    onClick: () => navigate(`/play/characters/${character.id}`),
  })));

  const playCampaignMenuItems = [
    {
      label: 'Dashboard',
      value: '/play',
      icon: <CottageIcon />,
      onClick: () => navigate('/play'),
    },
    {
      label: 'Character',
      value: '/play/characters',
      icon: <FaceIcon />,
      onClick: () => navigate('/play/characters/' + myCharacter?.id),
      subMenu: playCampgaignCharacterSubMenu,
    },
  ];

  const playCampaignSelectedMenuItem = [...playCampaignMenuItems].sort((a, b) => {
    // count the number of slashes in the value
    const aSlashes = (a.value.match(/\//g) || []).length;
    const bSlashes = (b.value.match(/\//g) || []).length;
    return bSlashes - aSlashes;
  }).find(item => location.pathname.startsWith(item.value));

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
            icon={playCampaignSelectedMenuItem?.icon}
            text={{ trigger: playCampaignSelectedMenuItem?.label || '???' }}
            items={playCampaignMenuItems}
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