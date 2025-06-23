import { DashboardView } from 'app/views/play/Dashboard.view';
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play - My Character" },
    { name: "description", content: "" },
  ];
}

export default function PlayCharacter() {
  return <DashboardView />;
}
