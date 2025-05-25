import { useMatches, useNavigate, useParams } from 'react-router';
import type { Route } from "./+types/home";
import { CampaignPage, CampaignSubPage } from 'app/pages/Campaign.page';
import Loading from 'app/components/Loading';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Campaign" },
    { name: "description", content: "" },
  ];
}

export default function Campaign() {
  const { campaignId } = useParams();
  const matches = useMatches();
  const navigate = useNavigate();
  const [subPage, setSubPage] = useState<CampaignSubPage | undefined>(undefined);
  useEffect(() => {
    const onPlayersPage = matches.some(m => m.id === "players");
    const onCharactersPage = matches.some(m => m.id === "characters");
    const onPlayPage = matches.some(m => m.id === "play");
    if (onPlayersPage) {
      setSubPage(CampaignSubPage.Players);
    } else if (onCharactersPage) {
      setSubPage(CampaignSubPage.Characters);
    } else if (onPlayPage) {
      setSubPage(CampaignSubPage.Play);
    } else {
      setSubPage(undefined);
    }
  }, [matches]);

  if (!campaignId) {
    navigate('/404');
    return <Loading type="spinner" page />;
  }

  return <CampaignPage campaignId={campaignId} subPage={subPage} />;
}
