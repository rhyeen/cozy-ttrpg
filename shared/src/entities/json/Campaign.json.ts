export interface PlayerJson {
  uid: string;
}

export interface CampaignJson {
  name: string;
  players: PlayerJson[];
  id: string;
}
