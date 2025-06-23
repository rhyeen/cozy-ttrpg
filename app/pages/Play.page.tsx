import { Toast } from '@base-ui-components/react';
import Loading from 'app/components/Loading';
import { playController } from 'app/utils/controller';
import { PlayView } from 'app/views/play/Play.view';
import { useEffect, useState } from 'react';
import { Play } from '@rhyeen/cozy-ttrpg-shared';
import { useAtMountPlaySessionToken } from 'app/utils/hooks/usePlaySessionToken';
import { useNavigate } from 'react-router';

export function PlayPage() {
  const toastManager = Toast.useToastManager();
  const navigate = useNavigate();
  const [ play, setPlay ] = useState<Play | undefined>();
  const playSessionToken = useAtMountPlaySessionToken();

  const getPlay = async () => {
    if (!playSessionToken || !playSessionToken.campaignId || !playSessionToken.characterId) {
      console.error('No play session token found. Cannot load play. This should have been loaded on play.tsx beforehand.');
      navigate('/404');
      return;
    }
    try {
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

  useEffect(() => {
    if (!playSessionToken) return;
    getPlay();
  }, [playSessionToken]);

  if (!play || !playSessionToken) {
    return <Loading type="spinner" page />;
  }

  return <PlayView play={play} />;
}
