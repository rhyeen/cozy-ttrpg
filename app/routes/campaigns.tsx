import type { Route } from "./+types/home";
import { CampaignsPage } from 'app/pages/Campaigns.page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Campaigns" },
    { name: "description", content: "" },
  ];
}

export default function Campaigns() {
  return <CampaignsPage />;
}
