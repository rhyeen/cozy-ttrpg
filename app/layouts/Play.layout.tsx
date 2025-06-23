import { Toast } from '@base-ui-components/react';
import Loading from 'app/components/Loading';
import { useAtMountPlaySessionToken } from 'app/utils/hooks/usePlaySessionToken';
import { MyCharactersView } from 'app/views/MyCharacters.view';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Play } from '@rhyeen/cozy-ttrpg-shared';
import { playController } from 'app/utils/controller';
import { usePlayEventSnapshot } from 'app/utils/hooks/usePlayEvent.snapshot';

export default function PlayLayout() {
  const playSessionToken = useAtMountPlaySessionToken();
  const toastManager = Toast.useToastManager();
  const [ play, setPlay ] = useState<Play | undefined>();

  const getPlay = async () => {
    if (!playSessionToken || !playSessionToken.campaignId || !playSessionToken.characterId) {
      return;
    }
    try {
      console.info('Starting play with campaignId:', playSessionToken.campaignId, 'and characterId:', playSessionToken.characterId);
      const result = await playController.startPlay(
        playSessionToken.campaignId,
        playSessionToken.characterId,
      );
      setPlay(result);
    } catch (error) {
      console.error('Error fetching play:', error);
      toastManager.add({
        title: 'Error',
        description: 'Failed to load play data. Please try again later.',
      });
    }
  };

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!playSessionToken) return;
    getPlay();
  }, [playSessionToken]);

  if (!playSessionToken || (playSessionToken && !play)) {
    return <Loading type="spinner" page />;
  }

  // @NOTE: If we don't have a play session token yet, we need to have the user
  // select their campaign and character first. But we don't want to navigate
  // as the URL may contain necessary parameters for the play session.
  if (!playSessionToken.playId || !play) {
    return <MyCharactersView onSelectForPlay={reload} />;
  }

  return (
    <PlayPage play={play}>
      <Outlet />
    </PlayPage>
  );
}

interface Props {
  play: Play;
  children?: React.ReactNode;
}

function PlayPage({ play, children }: Props) {
  // @NOTE: This needs to be initialized and retained at the root level of the play session.
  // Do not initialize this in a child component.
  usePlayEventSnapshot(
    play.campaignId,
    play.uid,
    play.characterId,
  );

  return children;
}