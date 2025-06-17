import { Campaign, FriendConnection, PlayerScope, User } from '@rhyeen/cozy-ttrpg-shared';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { PlayerCard } from './Player.card';
import IconButton from 'app/components/IconButton';
import { useNavigate } from 'react-router';
import ArrowBackIcon from 'app/components/Icons/ArrowBack';
import { selectFirebaseUser } from 'app/store/user.slice';
import { useSelector } from 'react-redux';
import Button from 'app/components/Button';
import { useState } from 'react';
import Form from 'app/components/Form';
import Divider from 'app/components/Divider';
import Input from 'app/components/Input';
import Card from 'app/components/Card';
import { getFriend } from 'app/utils/hooks/useFriend';
import MailIcon from 'app/components/Icons/Mail';
import Paragraph from 'app/components/Paragraph';
import SaveStateIcon from 'app/components/Icons/SaveState';
import { inviteFriend } from './Friends.view';
import { campaignController } from 'app/utils/controller';
import { Toast } from '@base-ui-components/react';

interface Props {
  campaign: Campaign;
  onSetCampaign: (campaign: Campaign) => void;
  friendUsers: User[];
  onSetFriendUsers: (users: User[]) => void;
  friendConnections: FriendConnection[];
  onSetFriendConnections: (connections: FriendConnection[]) => void;
  onRefreshFriends: () => Promise<void>;
}

export const PlayersView: React.FC<Props> = ({
  campaign,
  onSetCampaign,
  friendUsers,
  friendConnections,
  onSetFriendUsers,
  onSetFriendConnections,
  onRefreshFriends,
}) => {
  const navigate = useNavigate();
  const firebaseUser = useSelector(selectFirebaseUser);
  const selfAsPlayer = campaign.players.find((p) => p.uid === firebaseUser?.uid);
  const isOwner = selfAsPlayer?.scopes.includes(PlayerScope.Owner);
  const isGameMaster = selfAsPlayer?.scopes.includes(PlayerScope.GameMaster);
  const canEdit = isOwner || isGameMaster;
  const [friendEmail, setFriendEmail] = useState('');
  const [friendEmailError, setFriendEmailError] = useState<string | null>(null);
  const [invitingPlayer, setInvitingPlayer] = useState(false);
  const [invitingPlayers, setInvitingPlayers] = useState<{ [uid: string]: 'saving' | 'error' }>({});
  const [loading, setLoading] = useState(false);
  const toastManager = Toast.useToastManager();

  const handlePlayerInvite = async (uid: string) => {
    if (invitingPlayers[uid] === 'saving') return;
    if (campaign.players.some((p) => p.uid === uid)) return;
    setLoading(true);
    setInvitingPlayers((prev) => ({ ...prev, [uid]: 'saving' }));
    try {
      const player = await campaignController.addPlayer(campaign.id, uid);
      const updatedCampaign = campaign.copy();
      updatedCampaign.players.push(player);
      onSetCampaign(updatedCampaign);
    } catch (error) {
      setInvitingPlayers((prev) => ({ ...prev, [uid]: 'error' }));
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to add player.`,
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayer = async (uid: string) => {
    // @NOTE: You cannot remove yourself from the campaign if you are the owner or GM of it.
    const isSelf = uid === firebaseUser?.uid;
    if (isSelf && canEdit) return;
    setLoading(true);
    try {
      await campaignController.removePlayer(campaign.id, uid);
      const updatedCampaign = campaign.copy();
      updatedCampaign.players = updatedCampaign.players.filter((p) => p.uid !== uid);
      onSetCampaign(updatedCampaign);
      if (isSelf) {
        // If the user is removing themselves, navigate back to the campaigns list
        navigate('/campaigns');
      }
    } catch (error) {
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to remove player.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerInviteViaEmail = async () => {
    setLoading(true);
    const email = friendEmail.trim();
    if (!email) return;
    const friendConnection = await inviteFriend(
      friendEmail,
      setFriendEmail,
      setFriendEmailError,
      setInvitingPlayer,
    );
    if (!friendConnection) {
      setLoading(false);
      return;
    }
    onSetFriendConnections([...friendConnections, friendConnection]);
    onSetFriendUsers([...friendUsers, new User(
      friendConnection.invited.uid,
      email,
      '',
    )]);
    await handlePlayerInvite(friendConnection.invited.uid);
    setLoading(false);
  };

  return (
    <Section>
      <Header type="h3" iconLeft={
        <IconButton onClick={() => navigate(`/campaigns/${campaign.id}`)}>
          <ArrowBackIcon />
        </IconButton>
      }>{campaign.name}</Header>
      {!invitingPlayer ? (
        <Section>
          <Header type="h1">Players</Header>
          {campaign.players.map((player) => (
            <PlayerCard
              key={player.uid}
              campaign={campaign}
              playerUid={player.uid}
              players={campaign.players}
              onSetPlayer={(updatedPlayer) => {
                const updatedCampaign = campaign.copy();
                updatedCampaign.players = updatedCampaign.players.map((p) =>
                  p.uid === updatedPlayer.uid ? updatedPlayer : p
                );
                onSetCampaign(updatedCampaign);
              }}
              friendUsers={friendUsers}
              friendConnections={friendConnections}
              onRemovePlayer={() => handleRemovePlayer(player.uid)}
              onSetFriendConnections={onSetFriendConnections}
              loading={loading}
              onRefreshFriends={onRefreshFriends}
            />
          ))}
          {canEdit && !invitingPlayer && (
            <Button
              type={campaign.players.length < 2 ? 'primary' : 'secondary'}
              onClick={() => {
                setInvitingPlayer(true);
                setInvitingPlayers({});
              }}
            >
              Add Player
            </Button>
          )}
        </Section>
      ) : (
        <Section>
          <Form onSubmit={handlePlayerInviteViaEmail}>
            <Header type="h1">Add Players</Header>
            { friendConnections.map(connection => {
              const friend = getFriend(firebaseUser, connection, friendUsers);
              if (!friend) return null;
              const friendUid = friend.friend.uid;
              let saveState: 'hide' | 'success' | 'saving' | 'error' = 'hide';
              if (campaign.players.some(p => p.uid === friendUid)) {
                saveState = 'success';
              } else if (invitingPlayers[friendUid]) {
                saveState = invitingPlayers[friendUid];
              }
              return (
                <Card key={connection.id} onClick={() => handlePlayerInvite(friendUid)}>
                  <Card.Header>
                    <Card.Header.Left>
                      <Header type="h5">{friend.friendDisplayName}</Header>
                      <Paragraph type="caption">{friend.friendAsUser?.email}</Paragraph>
                    </Card.Header.Left>
                    <Card.Header.Right>
                      <SaveStateIcon
                        state={saveState}
                        onStateChange={() => {}}
                        hideIcon={<MailIcon />}
                      />
                    </Card.Header.Right>
                  </Card.Header>
                </Card>
              );
            })}
            { !!friendConnections.length && <Divider label="or" /> }
            <Input
              type="email"
              label="Friend's Email"
              value={friendEmail}
              onChange={(e) => {
                setFriendEmail(e.target.value);
                setFriendEmailError(null);
              }}
              placeholder="Invite a new friend to play"
              error={friendEmailError}
              required
            />
            <Button
              type="primary"
              submit
              onClick={handlePlayerInviteViaEmail}
              disabled={!friendEmail || !!friendEmailError}
              loading={loading}
            >
              Send Invite
            </Button>
            <Button type={friendEmail ? 'secondary' : 'primary'} onClick={() => setInvitingPlayer(false)}>Done</Button>
          </Form>
        </Section>
      )}
    </Section>
  )
};
