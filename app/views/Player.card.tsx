import { Toast } from '@base-ui-components/react';
import { Campaign, FriendConnection, Player, PlayerScope, User } from '@rhyeen/cozy-ttrpg-shared';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
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
import Paragraph from 'app/components/Paragraph';
import Section from 'app/components/Section';
import Switch from 'app/components/Switch';
import { selectFirebaseUser } from 'app/store/userSlice';
import { useFindFriend, useFriendIsSelf } from 'app/utils/hooks/useFriend';
import { listFormatter } from 'app/utils/listFormatter';
import { campaignController } from 'app/utils/services';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

interface Props {
  campaign: Campaign;
  playerUid: string;
  players: Player[];
  onSetPlayer: (player: Player) => void;
  friendUsers: User[];
  friendConnections: FriendConnection[];
}

interface ScopeSet {
  checked: boolean;
  loading: boolean;
}

export const PlayerCard: React.FC<Props> = ({
  playerUid,
  players,
  onSetPlayer,
  friendUsers,
  friendConnections,
  campaign,
}) => {
  const toastManager = Toast.useToastManager();
  const firebaseUser = useSelector(selectFirebaseUser);
  const friendIsSelf = useFriendIsSelf(playerUid);
  const friend = useFindFriend(playerUid, friendConnections, friendUsers);
  const [editScopes, setEditScopes] = useState(false);
  const [scopeGameMaster, setScopeGameMaster] = useState<boolean>(false);
  const [scopeOwner, setScopeOwner] = useState<boolean>(false);
  const [scopePlayer, setScopePlayer] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [selfAsPlayer, setSelfAsPlayer] = useState<Player | undefined>(undefined);

  useEffect(() => {
    const player = players.find((p) => p.uid === playerUid);
    const selfAsPlayer = players.find((p) => p.uid === firebaseUser?.uid);
    setPlayer(player);
    setSelfAsPlayer(selfAsPlayer);
    setScopeGameMaster(player?.scopes.includes(PlayerScope.GameMaster) || false);
    setScopeOwner(player?.scopes.includes(PlayerScope.Owner) || false);
    setScopePlayer(player?.scopes.includes(PlayerScope.Player) || false);
  }, [firebaseUser?.uid, playerUid, players]);

  const canEditScopes = (
    selfAsPlayer?.scopes.includes(PlayerScope.Owner) ||
    selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
  );

  const inviteFriend = async () => {
    // Logic to invite a friend
  };

  const approveFriend = async () => {
    // Logic to approve a friend
  };

  if (!player) {
    return <Loading key={playerUid} type="spinner" page />;
  }

  if (!friend && !friendIsSelf) {
    return (
      <Section key={playerUid}>
        <Header type="h5">Not a friend</Header>
        <Button
          type="secondary"
          onClick={inviteFriend}
        >
          Invite as Friend
        </Button>
      </Section>
    );
  }

  if (!friend?.selfAsFriend.approvedAt && !friendIsSelf) {
    return (
      <Section key={playerUid}>
        <Header type="h5">Not a friend</Header>
        <Button
          type="secondary"
          onClick={approveFriend}
        >
          Approve Friend
        </Button>
      </Section>
    );
  }

  const getScopeName = (scope: PlayerScope) => {
    switch (scope) {
      case PlayerScope.Player:
        return 'Player';
      case PlayerScope.GameMaster:
        return 'Game Master';
      case PlayerScope.Owner:
        return 'Owner';
      default:
        throw new Error(`Unknown scope: ${scope}`);
    }
  };

  const handleScopeChange = async (scope: PlayerScope, checked: boolean) => {
    let setScopeState;
    switch (scope) {
      case PlayerScope.Owner:
        setScopeState = setScopeOwner;
        break;
      case PlayerScope.GameMaster:
        setScopeState = setScopeGameMaster;
        break;
      case PlayerScope.Player:
        setScopeState = setScopePlayer;
        break;
      default:
        throw new Error(`Unknown scope: ${scope}`);
    }
    setLoading(true);
    try {
      const updatedScopes = checked
        ? [...player.scopes, scope]
        : player.scopes.filter((s) => s !== scope);
      const updatedPlayer = new Player({
        ...player.toJSON(true),
        scopes: updatedScopes,
      });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay for UI feedback
      await campaignController.updatePlayerScopes(
        campaign.id,
        playerUid,
        updatedScopes,
      );
      onSetPlayer(updatedPlayer);
      setScopeState(checked);
    } catch (error) {
      console.error(`Error updating scope ${scope}:`, error);
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to update scope: "${getScopeName(scope)}".`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card key={playerUid}>
      <Card.Header>
        <Card.Header.Left>
          <Header type="h4">{friend?.friendDisplayName || 'This is you'}</Header>
          <Paragraph>{listFormatter.format(player.scopes.map((scope) => getScopeName(scope)))}</Paragraph>
        </Card.Header.Left>
        <Card.Header.Right>
          <IconButton.Bar>
            {canEditScopes && (
              <IconButton
                onClick={() => setEditScopes(!editScopes)}
              >
                <EditIcon />
              </IconButton>
            )}
            <Menu
              icon={<SettingsIcon />}
              items={[
                {
                  label: 'View Friend Details',
                  onClick: () => navigate(`/`),
                  icon: <SupervisedUserCircleIcon />,
                },
                {
                  label: 'View Characters',
                  onClick: () => navigate(`/`),
                  icon: <FaceIcon />,
                },
                {
                  label: 'Remove from Campaign',
                  onClick: () => navigate(`/`),
                  icon: <DeleteIcon />,
                },
              ]}
            />
          </IconButton.Bar>
        </Card.Header.Right>
      </Card.Header>
      {editScopes && (
        <Card.Body>
          <Form>
            <Header type="h5">Edit Scopes</Header>
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
              loading={loading || true}
            >Player</Switch>
          </Form>
        </Card.Body>
      )}
    </Card>
  );
};
