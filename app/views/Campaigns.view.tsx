import { useEffect, useState } from 'react';
import { Campaign } from '@rhyeen/cozy-ttrpg-shared';
import { campaignController } from '../utils/services';
import Loading from '../components/Loading';
import Button from 'app/components/Button';
import Section from 'app/components/Section';
import { CampaignCard } from './Campaign.card';
import Header from 'app/components/Header';

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
    return <Loading type="spinner" page />;
  }

  const filteredCampaigns = campaigns.filter((campaign) => !campaign.deletedAt);

  return (
    <Section>
      <Header type="h1">Campaigns</Header>
      {filteredCampaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onSetCampaign={(updatedCampaign) => {
            setCampaigns((prev) =>
              prev ? prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)) : []
            );
          }}
        />
      ))}
      <Button type={filteredCampaigns.length ? 'secondary' : 'primary'} onClick={createCampaign}>
        Create Campaign
      </Button>
    </Section>
  );
}
