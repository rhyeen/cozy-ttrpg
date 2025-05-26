import Header from 'app/components/Header';
import { Character, FriendConnection, Play, User } from '@rhyeen/cozy-ttrpg-shared';
import Card from 'app/components/Card';
import Paragraph from 'app/components/Paragraph';
import { useFindFriend } from 'app/utils/hooks/useFriend';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from 'app/store/userSlice';
import { useNavigate } from 'react-router';
import IconButton from 'app/components/IconButton';
import PlayCircleIcon from 'app/components/Icons/PlayCircle';
import Menu from 'app/components/Menu';
import SettingsIcon from 'app/components/Icons/Settings';
import { useState } from 'react';
import SupervisedUserCircleIcon from 'app/components/Icons/SupervisedUserCircle';
import FaceIcon from 'app/components/Icons/Face';
import DeleteIcon from 'app/components/Icons/Delete';
import Modal from 'app/components/Modal';
import { FriendCard } from './Friend.card';
import { characterController } from 'app/utils/controller';
import { Toast } from '@base-ui-components/react';
import { CharacterSheet } from './play/CharacterSheet';

interface Props {
  friendConnections: FriendConnection[];
  onSetFriendConnections: (connections: FriendConnection[]) => void;
  onCharacterUpdate: (character: Character) => void;
  onViewCharacter: () => void;
  friendUsers: User[];
  character: Character;
  play?: Play;
}

export const CharacterCard: React.FC<Props> = ({
  friendConnections,
  onSetFriendConnections,
  friendUsers,
  character,
  play,
  onCharacterUpdate,
  onViewCharacter,
}) => {
  const toastManager = Toast.useToastManager();
  const firebaseUser = useSelector(selectFirebaseUser);
  const friend = useFindFriend(character.uid, friendConnections, friendUsers);
  const selfIsCharacter = character.uid === firebaseUser?.uid;
  const [viewFriend, setViewFriend] = useState(false);
  const [deleteCharacter, setDeleteCharacter] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlay = () => {
    if (play) {
      navigate(`/play/${play.id}`);
    }
  };

  const setFriendConnection = (connection: FriendConnection) => {
    const updatedConnections = friendConnections.map((fc) =>
      fc.id === connection.id ? connection : fc
    );
    onSetFriendConnections(updatedConnections);
  };

  const getMenuItems = () => {
    const items = [];
    items.push({
      label: 'View Character',
      onClick: onViewCharacter,
      icon: <FaceIcon />,
    });
    if (friend) {
      items.push({
        label: 'Friend Info',
        onClick: () => setViewFriend(true),
        icon: <SupervisedUserCircleIcon />,
      });
    }
    if (selfIsCharacter) {
      items.push({
        label: 'Delete Character',
        onClick: () => setDeleteCharacter(true),
        icon: <DeleteIcon />,
      });
    }
    return items;
  };

  const handleDeleteCharacter = async () => {
    setLoading(true);
    try {
      await characterController.deleteCharacter(character.id);
      const updatedCharacter = character.copy();
      updatedCharacter.deletedAt = new Date();
      onCharacterUpdate(updatedCharacter);
    } catch (error) {
      console.error('Failed to delete character:', error);
      toastManager.add({
        title: 'Error',
        description: 'Failed to delete character. Please try again later.',
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Card onClick={onViewCharacter}>
        <Card.Header>
          <Card.Header.Left>
            <Header type="h4">{character.name || character.nickname || 'Unnamed Character'}</Header>
            <Paragraph type="caption">{selfIsCharacter ? 'Your character' : (`${friend?.friendDisplayName || 'Unknown Player'}'s character`)}</Paragraph>
          </Card.Header.Left>
          <Card.Header.Right>
            <IconButton.Bar>
              {selfIsCharacter && (
                <IconButton onClick={handlePlay}>
                  <PlayCircleIcon />
                </IconButton>
              )}
              <Menu
                icon={<SettingsIcon />}
                items={getMenuItems()}
              />
            </IconButton.Bar>
          </Card.Header.Right>
        </Card.Header>
      </Card>
      {!!friend && (
        <Modal
          secondaryBtn
          open={viewFriend}
          onOpenChange={() => setViewFriend(false)}
          size="formMax"
        >
          <FriendCard
            noBorder
            friendConnection={friend.friendConnection}
            friendUsers={friendUsers}
            onSetFriendConnection={setFriendConnection}
            setByDefault="showView"
          />
        </Modal>
      )}
      <Modal
        title="Delete Character"
        secondaryBtn
        primaryBtn={{ onClick: handleDeleteCharacter, label: 'Delete' }}
        open={deleteCharacter}
        onOpenChange={() => setDeleteCharacter(false)}
        loading={loading}
      >
        Are you sure you want to delete this character? This action cannot currently be undone.
      </Modal>
    </>
  );
};
