import { functions } from '../utils/firebase';
import { httpsCallable } from 'firebase/functions';
import { Play } from '@rhyeen/cozy-ttrpg-shared';

export interface FirebaseResult<T> {
  data: T;
  error?: string;
}

export class Controller {
  constructor() {}

  protected async callFirebase<RequestData, ResultData>(
    functionName: string, data: RequestData,
  ): Promise<ResultData> {
    const callable = httpsCallable<
      RequestData,
      FirebaseResult<ResultData>
    >(functions, functionName);
    const playSession = Controller.getPlaySessionToken();
    if (playSession.playId) {
      data = {
        ...data,
        _play: { campaignId: playSession.campaignId, characterId: playSession.characterId },
      } as RequestData;
    }
    const result = await callable(data);
    if (result.data.error) {
      throw new Error(result.data.error);
    }
    return result.data.data;
  }

  public static setPlaySessionToken(play: Play) {
    sessionStorage.setItem('_play', JSON.stringify({
      playId: play.uid,
      campaignId: play.campaignId,
      characterId: play.characterId,
    }));
  }

  public static getPlaySessionToken(): {
    playId: string | null;
    campaignId: string | null;
    characterId: string | null;
  } {
    const playSession = sessionStorage.getItem('_play');
    const parsed = playSession ? JSON.parse(playSession) : null;
    if (parsed) {
      return {
        playId: parsed.playId || null,
        campaignId: parsed.campaignId || null,
        characterId: parsed.characterId || null,
      };
    } else {
      return {
        playId: null,
        campaignId: null,
        characterId: null,
      };
    }
  }
}
