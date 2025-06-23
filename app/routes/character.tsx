import { CharacterPage } from 'app/pages/Character.page';
import type { Route } from "./+types/home";
import { useNavigate, useParams } from 'react-router';
import Loading from 'app/components/Loading';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Character Page" },
    { name: "description", content: "" },
  ];
}

export default function Character() {
  const { characterId } = useParams();
  const navigate = useNavigate();

  if (!characterId) {
    navigate('/404');
    return <Loading type="spinner" page />;
  }

  return <CharacterPage characterId={characterId} />;
}
