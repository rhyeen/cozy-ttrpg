import { Controller } from 'app/controllers/Controller';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export function useIsPlaying(): boolean {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(location.pathname.startsWith('/play'));
  }, [location.pathname]);

  return isPlaying;
}

/**
 * Note that this hook does not listen for changes to the play session token.
 * It only retrieves the token once when the component mounts.
 */
export function useAtMountPlaySessionToken(): {
  playId: string | null;
  campaignId: string | null;
  characterId: string | null;
} | null {
  const [ playSessionToken, setPlaySessionToken ] = useState<{
    playId: string | null;
    campaignId: string | null;
    characterId: string | null;
  } | null>(null);
  useEffect(() => {
    const token = Controller.getPlaySessionToken();
    if (token.playId) {
      setPlaySessionToken(token);
    } else {
      // @NOTE: playSessionToken of null indicates this hasn't mounted yet, so
      // we don't use that.
      setPlaySessionToken({ playId: null, campaignId: null, characterId: null });
    }
  }, []);
  return playSessionToken;
}
