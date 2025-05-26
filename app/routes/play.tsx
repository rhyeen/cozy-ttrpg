import { useNavigate, useParams } from 'react-router';
import type { Route } from "./+types/home";
import { PlayPage } from 'app/pages/Play.page';
import Loading from 'app/components/Loading';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play" },
    { name: "description", content: "" },
  ];
}

export default function Play() {
  const { playId } = useParams();
  const navigate = useNavigate();

  if (!playId) {
    navigate('/404');
    return <Loading type="spinner" page />;
  }

  return <PlayPage playId={playId} />;
}
