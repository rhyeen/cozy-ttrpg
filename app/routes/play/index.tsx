import { DashboardView } from 'app/views/play/Dashboard.view';
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play" },
    { name: "description", content: "" },
  ];
}

export default function PlayDashboard() {
  return <DashboardView />;
}
