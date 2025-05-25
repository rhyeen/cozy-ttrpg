import type { Route } from "./+types/home";
import { PlayPage } from 'app/pages/Play.page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play" },
    { name: "description", content: "" },
  ];
}

export default function Play() {
  return <PlayPage />;
}
