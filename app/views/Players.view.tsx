import { Campaign, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { PlayerCard } from './Player.card';
import IconButton from 'app/components/IconButton';
import { useNavigate } from 'react-router';
import ArrowBackIcon from 'app/components/Icons/ArrowBack';

interface Props {
  campaign: Campaign;
  onSetCampaign: (campaign: Campaign) => void;
  friendUsers: User[];
  friendConnections: FriendConnection[];
}

export const PlayersView: React.FC<Props> = ({
  campaign,
  onSetCampaign,
  friendUsers,
  friendConnections,
}) => {
  const navigate = useNavigate();

  return (
    <Section>
      <Header type="h3" iconPosition="left" icon={
        <IconButton onClick={() => navigate(`/campaigns/${campaign.id}`)}>
          <ArrowBackIcon />
        </IconButton>
      }>{campaign.name}</Header>
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
        />
      ))}
    </Section>
  )
};
