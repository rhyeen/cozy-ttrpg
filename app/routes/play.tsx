import Loading from 'app/components/Loading';
import type { Route } from "./+types/home";
import { PlayPage } from 'app/pages/Play.page';
import { useAtMountPlaySessionToken } from 'app/utils/hooks/usePlaySessionToken';
import { MyCharactersView } from 'app/views/MyCharacters.view';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play" },
    { name: "description", content: "" },
  ];
}

export default function Play() {
  const playSessionToken = useAtMountPlaySessionToken();

  const reload = () => {
    window.location.reload();
  };

  if (!playSessionToken) {
    return <Loading type="spinner" page />;
  }

  // @NOTE: If we don't have a play session token yet, we need to have the user
  // select their campaign and character first. But we don't want to navigate
  // as the URL may contain necessary parameters for the play session.
  if (!playSessionToken.playId) {
    return <MyCharactersView onSelectForPlay={reload} />;
  }

  return <PlayPage />;
}
