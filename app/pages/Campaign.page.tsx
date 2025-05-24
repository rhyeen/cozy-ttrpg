import { useEffect, useState } from 'react';
import { CampaignView } from '../views/Campaign.view';
import { Campaign, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { campaignController, friendConnectionController } from 'app/utils/services';
import Loading from 'app/components/Loading';
import { useNavigate } from 'react-router';
import { PlayersView } from 'app/views/Players.view';

interface Props {
  campaignId: string;
  subPage?: 'players';
}

export function CampaignPage({ campaignId, subPage }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>();
  const [campaign, setCampaign] = useState<Campaign | undefined>();
  const [friends, setFriends] = useState<FriendConnection[] | undefined>();
  const [friendUsers, setFriendUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const getFriends = async () => {
    if (friends) return;
    const result = await friendConnectionController.getFriendConnections();
    setFriends(result.friendConnections);
    setFriendUsers(result.users);
  };

  const getCampaigns = async () => {
    const result = await campaignController.getCampaigns();
    setCampaigns(result);
    const foundCampaign = result.find(campaign => campaign.id === campaignId);
    if (foundCampaign) {
      setCampaign(foundCampaign);
    } else {
      navigate('/404');
    }
  };

  useEffect(() => {
    getCampaigns();
    getFriends();
  }, [campaignId]);

  if (!campaigns || !friends || !friendUsers) {
    return <Loading type="spinner" page />;
  }

  if (!campaign) {
    return <Loading type="spinner" page />;
  }

  const setCampaignsState = (updatedCampaign: Campaign) => {
    setCampaigns((prev) =>
      prev ? prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)) : []
    );
    setCampaign(updatedCampaign);
  };

  if (subPage === 'players') {
    return (
      <PlayersView
        campaign={campaign}
        onSetCampaign={setCampaignsState}
        friendUsers={friendUsers}
        friendConnections={friends}
        onSetFriendUsers={setFriendUsers}
        onSetFriendConnections={setFriends}
      />
    );
  }

  return (
    <CampaignView
      campaign={campaign}
      onSetCampaign={setCampaignsState}
    />
  );
}
