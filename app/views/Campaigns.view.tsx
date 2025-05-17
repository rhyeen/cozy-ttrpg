import { useEffect, useState } from 'react';
import { Campaign } from '@rhyeen/entities/entities/Campaign';
import { campaignService } from '~/utils/services';
import Loading from '~/components/Loading';

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>();

  const getCampaigns = async () => {
    const result = await campaignService.getCampaigns();
    setCampaigns(result);
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
    </>
  );
}
