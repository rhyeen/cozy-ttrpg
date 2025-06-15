import Header from 'app/components/Header';
import { Campaign, Character, FriendConnection, Play, User } from '@rhyeen/cozy-ttrpg-shared';
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
import { campaignController, characterController } from 'app/utils/controller';
import { Toast } from '@base-ui-components/react';
import Book2Icon from 'app/components/Icons/Book2';
import RadioButtonUncheckedIcon from 'app/components/Icons/RadioButtonUnchecked';
import SaveStateIcon from 'app/components/Icons/SaveState';

interface Props {
  friendConnections: FriendConnection[];
  onSetFriendConnections: (connections: FriendConnection[]) => void;
  onCharacterUpdate: (character: Character) => void;
  onViewCharacter: () => void;
  friendUsers: User[];
  character: Character;
  campaigns: Campaign[];
  onSetCampaign: (campaign: Campaign) => void;
}

export const CharacterCard: React.FC<Props> = ({
  friendConnections,
  onSetFriendConnections,
  friendUsers,
  character,
  campaigns,
  onCharacterUpdate,
  onViewCharacter,
  onSetCampaign,
}) => {
  const toastManager = Toast.useToastManager();
  const firebaseUser = useSelector(selectFirebaseUser);
  const friend = useFindFriend(character.uid, friendConnections, friendUsers);
  const selfIsCharacter = character.uid === firebaseUser?.uid;
  const [viewFriend, setViewFriend] = useState(false);
  const [deleteCharacter, setDeleteCharacter] = useState(false);
  const [assignCampaign, setAssignCampaign] = useState(false);
  const [
    assigningCampaigns,
    setAssigningCampaigns,
  ] = useState<{ [campaignId: string]: 'saving' | 'error' }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const campaignsWithCharacter = campaigns.filter(campaign => {
    return campaign.plays.some(play => play.characterId === character.id);
  });

  const handlePlay = (campaign: Campaign) => {
    const play = campaign.plays.find(play => play.characterId === character.id);
    if (play) {
      navigate(`/play/${play.id}`);
    }
  };

  const handleAssignCampaign = async (campaign: Campaign) => {
    if (assigningCampaigns[campaign.id] === 'saving') return;
    if (campaign.plays.some((p) => p.characterId === character.id)) return;
    setLoading(true);
    setAssigningCampaigns((prev) => ({ ...prev, [campaign.id]: 'saving' }));
    try {
      const play = await campaignController.addCharacter(campaign.id, character.id);
      const updatedCampaign = campaign.copy();
      updatedCampaign.plays.push(play);
      onSetCampaign(updatedCampaign);
    } catch (error) {
      setAssigningCampaigns((prev) => ({ ...prev, [campaign.id]: 'error' }));
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to assign character to campaign ${campaign.name || campaign.id}.`,
      });
      return;
    } finally {
      setLoading(false);
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
    if (campaigns.length && selfIsCharacter) {
      items.push({
        label: 'Assign to Campaign',
        icon: <Book2Icon />,
        onClick: () => setAssignCampaign(true),
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

  const getPlayMenuItems = () => {
    return campaignsWithCharacter.map((campaign) => ({
      label: campaign.name || campaign.id,
      onClick: () => handlePlay(campaign),
      icon: <PlayCircleIcon />,
    }));
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
              {selfIsCharacter && campaignsWithCharacter.length === 1 && (
                <IconButton onClick={() => handlePlay(campaignsWithCharacter[0])}>
                  <PlayCircleIcon />
                </IconButton>
              )}
              {selfIsCharacter && campaignsWithCharacter.length > 1 && (
                <Menu
                  icon={<PlayCircleIcon />}
                  items={getPlayMenuItems()}
                />
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
      <Modal
        title="Assign to Campaign"
        secondaryBtn
        open={assignCampaign}
        onOpenChange={() => setAssignCampaign(false)}
        loading={loading}
        size="formMax"
      >
        {campaigns.map(campaign => {
          let saveState: 'hide' | 'success' | 'saving' | 'error' = 'hide';
          if (campaign.plays.some(p => p.characterId === character.id)) {
            saveState = 'success';
          } else if (assigningCampaigns[campaign.id]) {
            saveState = assigningCampaigns[campaign.id];
          }
          return (
            <Card key={campaign.id} onClick={() => handleAssignCampaign(campaign)}>
              <Card.Header>
                <Card.Header.Left>
                  <Header type="h5">{campaign.name || campaign.id}</Header>
                </Card.Header.Left>
                <Card.Header.Right>
                  <SaveStateIcon
                    state={saveState}
                    onStateChange={() => {}}
                    hideIcon={<RadioButtonUncheckedIcon />}
                  />
                </Card.Header.Right>
              </Card.Header>
            </Card>
          );
        })}
      </Modal>   
    </>
  );
};
