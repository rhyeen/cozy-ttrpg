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
    sessionStorage.setItem('play_id', play.id);
    sessionStorage.setItem('play_campaign_id', play.campaignId);
    sessionStorage.setItem('play_character_id', play.characterId);
  }

  public static getPlaySessionToken(): {
    playId: string | null;
    campaignId: string | null;
    characterId: string | null;
  } {
    return {
      playId: sessionStorage.getItem('play_id'),
      campaignId: sessionStorage.getItem('play_campaign_id'),
      characterId: sessionStorage.getItem('play_character_id'),
    };
  }
}
