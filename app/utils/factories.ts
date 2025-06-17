import { CampaignFactory, CharacterFactory, FriendConnectionFactory, PlayFactory, PrivatePlayEventFactory, PublicPlayEventFactory, UserFactory } from '@rhyeen/cozy-ttrpg-shared';

export const campaignFactory = new CampaignFactory();
export const friendConnectionFactory = new FriendConnectionFactory();
export const userFactory = new UserFactory();
export const characterFactory = new CharacterFactory();
export const playFactory = new PlayFactory();
export const publicPlayEventFactory = new PublicPlayEventFactory();
export const privatePlayEventFactory = new PrivatePlayEventFactory();