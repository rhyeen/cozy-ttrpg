import { useMatches, useNavigate, useParams } from 'react-router';
import type { Route } from "./+types/home";
import { CampaignPage } from 'app/pages/Campaign.page';
import Loading from 'app/components/Loading';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Campaign" },
    { name: "description", content: "" },
  ];
}

export default function Campaign() {
  const { campaignId } = useParams();
  const matches = useMatches();                                     // ← all matches:contentReference[oaicite:0]{index=0}
  const onPlayersPage = matches.some(m => m.id === "players");
  const navigate = useNavigate();
  const subPage = onPlayersPage ? 'players' : undefined;

  if (!campaignId) {
    navigate('/404');
    return <Loading type="spinner" page />;
  }

  return <CampaignPage campaignId={campaignId} subPage={subPage} />;
}
