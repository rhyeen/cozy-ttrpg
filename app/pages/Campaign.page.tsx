import { useEffect, useState } from 'react';
import { CampaignView } from '../views/Campaign.view';
import { Campaign, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { campaignController, friendConnectionController } from 'app/utils/controller';
import Loading from 'app/components/Loading';
import { useNavigate } from 'react-router';
import { PlayersView } from 'app/views/Players.view';
import { CampaignCharactersView } from 'app/views/CampaignCharacters.view';

interface Props {
  campaignId: string;
  subPage?: CampaignSubPage;
}

export enum CampaignSubPage {
  Players = 'players',
  Characters = 'characters',
  Play = 'play',
}

export function CampaignPage({ campaignId, subPage }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>();
  const [campaign, setCampaign] = useState<Campaign | undefined>();
  const [friends, setFriends] = useState<FriendConnection[] | undefined>();
  const [friendUsers, setFriendUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const getFriends = async (forceRefresh = false) => {
    if (friends && !forceRefresh) return;
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

  if (subPage === CampaignSubPage.Players) {
    return (
      <PlayersView
        campaign={campaign}
        onSetCampaign={setCampaignsState}
        friendUsers={friendUsers}
        friendConnections={friends}
        onSetFriendUsers={setFriendUsers}
        onSetFriendConnections={setFriends}
        onRefreshFriends={() => getFriends(true)}
      />
    );
  } else if (subPage === CampaignSubPage.Characters) {
    return (
      <CampaignCharactersView
        campaign={campaign}
        onSetCampaign={setCampaignsState}
        friendUsers={friendUsers}
        friendConnections={friends}
        onSetFriendUsers={setFriendUsers}
        onSetFriendConnections={setFriends}
      />
    );
  } else if (subPage === CampaignSubPage.Play) {
    return (
      <CampaignCharactersView
        campaign={campaign}
        onSetCampaign={setCampaignsState}
        friendUsers={friendUsers}
        friendConnections={friends}
        onSetFriendUsers={setFriendUsers}
        onSetFriendConnections={setFriends}
        viewOtherPlayerCharacters
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
