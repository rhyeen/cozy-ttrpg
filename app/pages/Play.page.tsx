import { Toast } from '@base-ui-components/react';
import Loading from 'app/components/Loading';
import { playController } from 'app/utils/controller';
import { HomePlayView } from 'app/views/play/HomePlay.view';
import { useEffect, useState } from 'react';
import { Play } from '@rhyeen/cozy-ttrpg-shared';

interface Props {
  playId: string;
}

export function PlayPage({ playId }: Props) {
  const toastManager = Toast.useToastManager();
  const [ play, setPlay ] = useState<Play | undefined>();

  const getPlay = async () => {
    try {
      const { campaignId, characterId } = Play.extractId(playId);
      if (!campaignId) {
        throw new Error('Invalid play ID format. Missing campaign ID.');
      }
      if (!characterId) {
        throw new Error('Invalid play ID format. Missing character ID.');
      }
      const result = await playController.startPlay(campaignId, characterId);
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
    getPlay();
  }, [playId]);

  if (!play) {
    return <Loading type="spinner" page />;
  }

  return <HomePlayView play={play} />;
}
