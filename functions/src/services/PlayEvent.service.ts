import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { FullPlayEvent, PublicPlayEvent, PrivatePlayEvent } from '@rhyeen/cozy-ttrpg-shared';

export class PlayEventService extends Service{
  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
  }

  public async addEvent(event: FullPlayEvent | undefined | null): Promise<FullPlayEvent | null> {
    if (!event) return null;
    let privatePlayEvent = event.extractPrivate();
    await Promise.all([
      privatePlayEvent ? this.createPrivateEvent(privatePlayEvent) : undefined,
      this.createPublicEvent(event.extractPublic()),
    ]);
    return event;
  }

  private async createPublicEvent(event: PublicPlayEvent): Promise<PublicPlayEvent> {
    const campaignRef = this.db.collection('campaigns').doc(event.pushTo.campaignId);
    await campaignRef.collection('events').add(event.storeJson());
    return event;
  }

  private async createPrivateEvent(event: PrivatePlayEvent): Promise<PrivatePlayEvent> {
    const campaignRef = this.db.collection('campaigns').doc(event.pushTo.campaignId);
    const batch = this.db.batch();
    for (const play of event.pushTo.plays) {
      const playerRef = campaignRef.collection('players').doc(play.playerUid);
      const characterRef = playerRef.collection('characters').doc(play.characterId);
      const eventRef = characterRef.collection('events').doc();
      batch.set(eventRef, event.storeJson());
    }
    await Promise.all([
      batch.commit(),
      this.createPrivateGameMasterEvent(event),
    ]);
    return event;
  }

  private async createPrivateGameMasterEvent(event: PrivatePlayEvent): Promise<PrivatePlayEvent> {
    const campaignRef = this.db.collection('campaigns').doc(event.pushTo.campaignId);
    await campaignRef.collection('gm-events').add(event.storeJson());
    return event;
  }
}
