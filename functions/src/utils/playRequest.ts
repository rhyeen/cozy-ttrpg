import { CallableRequest } from 'firebase-functions/https';

export interface PlayRequest {
  campaignId: string;
  characterId: string;
  uid: string;
}

export function getPlayRequest(request: CallableRequest<any>): PlayRequest | null {
  const data = request.data;
  if (!data || !data._play) {
    return null;
  }
  
  const playData = data._play;
  if (!playData.campaign || !playData.character || !request.auth?.uid) {
    return null;
  }

  return {
    campaignId: playData.campaignId,
    characterId: playData.characterId,
    uid: request.auth.uid,
  };
}
