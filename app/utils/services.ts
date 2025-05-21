import { UserController } from 'app/controllers/User.controller';
import { CampaignController } from '../controllers/Campaign.controller';
import { FriendConnectionController } from 'app/controllers/FriendConnection.controller';
import { CharacterController } from 'app/controllers/Character.controller';

export const campaignController = new CampaignController();
export const userController = new UserController();
export const friendConnectionController = new FriendConnectionController();
export const characterController = new CharacterController();
