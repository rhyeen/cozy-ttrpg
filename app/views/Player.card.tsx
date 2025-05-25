import { Toast } from '@base-ui-components/react';
import { Campaign, expandScope, FriendConnection, Player, PlayerScope, User } from '@rhyeen/cozy-ttrpg-shared';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import Divider from 'app/components/Divider';
import Form from 'app/components/Form';
import Header from 'app/components/Header';
import IconButton from 'app/components/IconButton';
import DeleteIcon from 'app/components/Icons/Delete';
import EditIcon from 'app/components/Icons/Edit';
import FaceIcon from 'app/components/Icons/Face';
import SettingsIcon from 'app/components/Icons/Settings';
import SupervisedUserCircleIcon from 'app/components/Icons/SupervisedUserCircle';
import Loading from 'app/components/Loading';
import Menu from 'app/components/Menu';
import Modal from 'app/components/Modal';
import Paragraph from 'app/components/Paragraph';
import Radio from 'app/components/Radio';
import Section from 'app/components/Section';
import Switch from 'app/components/Switch';
import { selectFirebaseUser } from 'app/store/userSlice';
import { useFindFriend, useFriendIsSelf } from 'app/utils/hooks/useFriend';
import { listFormatter } from 'app/utils/listFormatter';
import { campaignController, friendConnectionController } from 'app/utils/services';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { FriendCard, updateFriendStatus } from './Friend.card';
import HeartIcon from 'app/components/Icons/Heart';
import ErrorIcon from 'app/components/Icons/Error';
import { FirebaseError } from 'firebase/app';

interface Props {
  campaign: Campaign;
  playerUid: string;
  players: Player[];
  onSetPlayer: (player: Player) => void;
  onRemovePlayer: () => void;
  onRefreshFriends: () => Promise<void>;
  friendUsers: User[];
  friendConnections: FriendConnection[];
  onSetFriendConnections: (connections: FriendConnection[]) => void;
  loading?: boolean;
}

export const PlayerCard: React.FC<Props> = ({
  playerUid,
  players,
  onSetPlayer,
  friendUsers,
  friendConnections,
  campaign,
  onRemovePlayer,
  onSetFriendConnections,
  onRefreshFriends,
}) => {
  const toastManager = Toast.useToastManager();
  const firebaseUser = useSelector(selectFirebaseUser);
  const friendIsSelf = useFriendIsSelf(playerUid);
  const friend = useFindFriend(playerUid, friendConnections, friendUsers);
  const [editScopes, setEditScopes] = useState(false);
  const [scopeGameMaster, setScopeGameMaster] = useState<boolean>(false);
  const [scopeOwner, setScopeOwner] = useState<boolean>(false);
  const [scopePlayer, setScopePlayer] = useState<boolean>(false);
  const [scopeSpectator, setScopeSpectator] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [selfAsPlayer, setSelfAsPlayer] = useState<Player | undefined>(undefined);
  const [advancedScopes, setAdvancedScopes] = useState(false);
  const [viewFriend, setViewFriend] = useState(false);

  useEffect(() => {
    const player = players.find((p) => p.uid === playerUid);
    const selfAsPlayer = players.find((p) => p.uid === firebaseUser?.uid);
    setPlayer(player);
    setSelfAsPlayer(selfAsPlayer);
    setScopeGameMaster(player?.scopes.includes(PlayerScope.GameMaster) || false);
    setScopeOwner(player?.scopes.includes(PlayerScope.Owner) || false);
    setScopePlayer(player?.scopes.includes(PlayerScope.Player) || false);
    setScopeSpectator(player?.scopes.includes(PlayerScope.Spectator) || false);
  }, [firebaseUser?.uid, playerUid, players]);

  const canEdit = (
    selfAsPlayer?.scopes.includes(PlayerScope.Owner) ||
    selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
  );

  const inviteFriend = async () => {
    setLoading(true);
    try {
      await friendConnectionController.inviteFriendViaUid(playerUid);
      // @NOTE: Since we don't know the friend user's email, we have to do a full refresh.
      await onRefreshFriends();
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'functions/already-exists') {
          toastManager.add({
            title: 'Already Friends',
            description: 'You are already friends with this user. The page is likely out of sync and should be refreshed.',
          });
        } else {
          console.error('Error inviting friend:', error.code, error);
          toastManager.add({
            title: 'Unexpected Error',
            description: `Failed to invite player as a friend. Error: ${error.message}`,
          });
        }
      } else {
        console.error('Error inviting friend:', error);
        toastManager.add({
          title: 'Unexpected Error',
          description: `Failed to invite player as a friend.`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const approveFriend = async () => {
    if (!friend || !friend.friendConnection) {
      toastManager.add({
        title: 'Error',
        description: 'No friend connection found.',
      });
      return;
    }
    setLoading(true);
    try {
      const updatedFriendConnection = await updateFriendStatus(
        friend?.friendConnection,
        friend,
        'approved',
      );
      setFriendConnection(updatedFriendConnection);
    } catch (error) {
      console.error('Error approving friend:', error);
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to approve friendship.`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!player) {
    return <Loading type="spinner" page />;
  }

  const getScopeName = (scope: PlayerScope) => {
    switch (scope) {
      case PlayerScope.Player:
        return 'Player';
      case PlayerScope.GameMaster:
        return 'Game Master';
      case PlayerScope.Owner:
        return 'Owner';
      case PlayerScope.Spectator:
        return 'Spectator';
      default:
        throw new Error(`Unknown scope: ${scope}`);
    }
  };

  const handleScopeChange = async (scope: PlayerScope, checked: boolean) => {
    const updatedScopes = checked
        ? [...player.scopes, scope]
        : player.scopes.filter((s) => s !== scope);
    await updateScopes(updatedScopes);
  };

  const updateScopes = async (scopes: PlayerScope[]) => {
    setLoading(true);
    try {
      const updatedPlayer = new Player({
        ...player.toJSON(true),
        scopes,
      });
      await campaignController.updatePlayerScopes(
        campaign.id,
        playerUid,
        scopes,
      );
      onSetPlayer(updatedPlayer);
    } catch (error) {
      console.error(`Error updating scopes ${scopes}:`, error);
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to update scopes.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const getUnexpandedScopeValue = () => {
    if (scopeOwner) return PlayerScope.Owner;
    if (scopeGameMaster) return PlayerScope.GameMaster;
    if (scopePlayer) return PlayerScope.Player;
    return PlayerScope.Spectator;
  };

  const handleUnexpandedScopeChange = async (value: string) => {
    const expandedScopes = expandScope(value as PlayerScope);
    await updateScopes(expandedScopes);
  };

  const setFriendConnection = (connection: FriendConnection) => {
    const updatedConnections = friendConnections.map((fc) =>
      fc.id === connection.id ? connection : fc
    );
    onSetFriendConnections(updatedConnections);
  };

  const getMenuItems = () => {
    const items = [];
    const isSelf = !friend || friend.friendIsSelf;
    if (!isSelf) {
      if (friend) {
        items.push({
          label: 'Friend Info',
          onClick: () => setViewFriend(true),
          icon: <SupervisedUserCircleIcon />,
        });
      } else {
        items.push({
          label: 'Add as Friend',
          onClick: inviteFriend,
          icon: <HeartIcon />,
        });
      }
    }
    items.push({
      label: 'Characters',
      onClick: () => navigate(`/campaigns/${campaign.id}/characters`),
      icon: <FaceIcon />,
    });
    if (!isSelf && canEdit) {
      items.push({
        label: 'Remove from Campaign',
        onClick: onRemovePlayer,
        icon: <DeleteIcon />,
      });
    }
    if (!canEdit && isSelf) {
      items.push({
        label: 'Leave Campaign',
        onClick: onRemovePlayer,
        icon: <DeleteIcon />,
      });
    }
    return items;
  };

  const todoAction = !friend?.selfAsFriend.approvedAt && !friendIsSelf;

  let displayName = friend?.friendDisplayName;
  if (!displayName) {
    displayName = friendIsSelf ? 'This is you' : 'Unknown Player';
  }

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Header.Left>
            <Header type="h4">{displayName}</Header>
            <Paragraph>{listFormatter.format(player.scopes.map((scope) => getScopeName(scope)))}</Paragraph>
          </Card.Header.Left>
          <Card.Header.Right>
            <IconButton.Bar>
              {canEdit && (
                <IconButton
                  onClick={() => setEditScopes(!editScopes)}
                >
                  <EditIcon />
                </IconButton>
              )}
              <Menu
                icon={<SettingsIcon />}
                items={getMenuItems()}
                loading={loading}
              />
            </IconButton.Bar>
          </Card.Header.Right>
        </Card.Header>
        {(editScopes || todoAction) && (
          <Card.Body>
            { todoAction && (
              <Section>
                <Header type="h5" icon={<ErrorIcon />} iconPosition="left">Action Required!</Header>
                <Button
                  type="primary"
                  onClick={!friend ? inviteFriend : approveFriend}
                  loading={loading}
                >
                  {!friend ? 'Add as Friend' : 'Approve Friendship'}
                </Button>
              </Section>
            )}
            {editScopes && (
              <Form>
                <Header type="h5">Edit Permissions</Header>
                <Switch
                  checked={advancedScopes}
                  onCheckedChange={setAdvancedScopes}
                >
                  <Paragraph>Show Advanced Options</Paragraph>
                  <Paragraph type="caption">(Not Recommended)</Paragraph>
                </Switch>
                {advancedScopes ? (
                  <>
                    <Switch
                      checked={scopeOwner}
                      onCheckedChange={(checked) => {
                        handleScopeChange(PlayerScope.Owner, checked);
                      }}
                      disabled={(
                        !friend ||
                        friend?.friendIsSelf ||
                        !selfAsPlayer?.scopes.includes(PlayerScope.Owner)
                      )}
                      loading={loading}
                    >Owner</Switch>
                    <Switch
                      checked={scopeGameMaster}
                      onCheckedChange={(checked) => {
                        handleScopeChange(PlayerScope.GameMaster, checked);
                      }}
                      disabled={(
                        !selfAsPlayer?.scopes.includes(PlayerScope.Owner) &&
                        !selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
                      )}
                      loading={loading}
                    >Game Master</Switch>
                    <Switch
                      checked={scopePlayer}
                      onCheckedChange={(checked) => {
                        handleScopeChange(PlayerScope.Player, checked);
                      }}
                      disabled={(
                        !selfAsPlayer?.scopes.includes(PlayerScope.Owner) &&
                        !selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
                      )}
                      loading={loading}
                    >Player</Switch>
                    <Switch
                      checked={scopeSpectator}
                      onCheckedChange={(checked) => {
                        handleScopeChange(PlayerScope.Spectator, checked);
                      }}
                      disabled={(
                        !selfAsPlayer?.scopes.includes(PlayerScope.Owner) &&
                        !selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
                      )}
                      loading={loading}
                    >Spectator</Switch>
                  </>
                ) : (
                  <>
                    <Radio
                      value={getUnexpandedScopeValue()}
                      onValueChange={handleUnexpandedScopeChange}
                      loading={loading}
                      disabled={!friend || friend.friendIsSelf}
                      label={!friend || friend.friendIsSelf ? 'Cannot change own permissions' : ''}
                    >
                      <Radio.Item
                        value={PlayerScope.Owner}
                        disabled={!selfAsPlayer?.scopes.includes(PlayerScope.Owner)}
                      >Owner</Radio.Item>
                      <Radio.Item
                        value={PlayerScope.GameMaster}
                        disabled={(
                          !selfAsPlayer?.scopes.includes(PlayerScope.GameMaster) &&
                          !selfAsPlayer?.scopes.includes(PlayerScope.Owner)
                        )}
                      >Game Master</Radio.Item>
                      <Radio.Item
                        value={PlayerScope.Player}
                        disabled={(
                          !selfAsPlayer?.scopes.includes(PlayerScope.GameMaster) &&
                          !selfAsPlayer?.scopes.includes(PlayerScope.Owner)
                        )}
                      >Player</Radio.Item>
                      <Radio.Item
                        value={PlayerScope.Spectator}
                        disabled={(
                          !selfAsPlayer?.scopes.includes(PlayerScope.GameMaster) &&
                          !selfAsPlayer?.scopes.includes(PlayerScope.Owner)
                        )}
                      >Spectator</Radio.Item>
                    </Radio>
                  </>
                )}
              </Form>
            )}
          </Card.Body>
        )}
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
            friendConnection={friend?.friendConnection}
            friendUsers={friendUsers}
            onSetFriendConnection={setFriendConnection}
            setByDefault="showView"
          />
        </Modal>
      )}
    </>
  );
};
