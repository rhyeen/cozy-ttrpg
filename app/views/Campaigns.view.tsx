import { useEffect, useState } from 'react';
import { Campaign } from '@rhyeen/cozy-ttrpg-shared';
import { campaignController } from '../utils/services';
import Loading from '../components/Loading';
import Button from 'app/components/Button';

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>();

  const getCampaigns = async () => {
    const result = await campaignController.getCampaigns();
    setCampaigns(result);
  };

  const createCampaign = async () => {
    const newCampaign = new Campaign('', 'New Campaign', '', []);
    const createdCampaign = await campaignController.createCampaign(newCampaign);
    setCampaigns((prev) => (prev ? [...prev, createdCampaign] : [createdCampaign]));
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  if (!campaigns) {
    return <Loading type="spinner" />;
  }

  return (
    <>
      {campaigns.map((campaign) => (
        <h2 key={campaign.id}>{campaign.name}</h2>
      ))}
      <Button type={campaigns.length ? 'secondary' : 'primary'} onClick={createCampaign}>
        Create Campaign
      </Button>
    </>
  );
}
