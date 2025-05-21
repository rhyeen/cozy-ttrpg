import { CharactersPage } from 'app/pages/Characters.page';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Characters Page" },
    { name: "description", content: "" },
  ];
}

export default function Characters() {
  return <CharactersPage />;
}
