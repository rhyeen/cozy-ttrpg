import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestore } from '../firebase';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { copyDate, type StorePrivatePlayEventJson, type StorePublicPlayEventJson } from '@rhyeen/cozy-ttrpg-shared';
import { campaignController, playController } from '../controller';
import { playEventActions } from 'app/store/playEvent.slice';
import { privatePlayEventFactory, publicPlayEventFactory } from '../factories';

export function usePlayEventSnapshot(
  campaignId: string,
  uid: string,
  characterId: string,
): void {
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState<{
    campaignId: string;
    uid: string;
    characterId: string;
  } | null>(null);

  const onPublicEventSnapshot = () => {
    const eventsRef = collection(firestore, "campaigns", campaignId, "events");
    // @NOTE: Don't get events that are older than 1 minute
    const eventsQuery = query(
      eventsRef,
      where("createdAt" , ">=", new Date(new Date().getTime() - (60 * 1000))),
    );
    return onSnapshot(eventsQuery, snap => {
      snap.docChanges().forEach(change => {
        const data = change.doc.data() as StorePublicPlayEventJson;
        data.id = change.doc.id;
        const event = publicPlayEventFactory.storeJson(data);
        dispatch(playEventActions.addPublicEvent(event.clientJson()));
      });
    });
  };

  const onPrivateEventSnapshot = () => {
    const eventsRef = collection(firestore, "campaigns", campaignId, "players", uid, "characters", characterId, "events");
    // @NOTE: Don't get events that are older than 1 minute
    const eventsQuery = query(
      eventsRef,
      where("createdAt" , ">=", new Date(new Date().getTime() - (60 * 1000))),
    );
    return onSnapshot(eventsQuery, snap => {
      snap.docChanges().forEach(change => {
        const data = change.doc.data() as StorePrivatePlayEventJson;
        data.id = change.doc.id;
        const event = privatePlayEventFactory.storeJson(data);
        dispatch(playEventActions.addPrivateEvent(event.clientJson()));
      });
    });
  };

  const getCampaign = async () => {
    const result = await campaignController.getCampaigns();
    const campaign = result.find(campaign => campaign.id === campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found.`);
    }
    dispatch(playEventActions.setCampaign(campaign.clientJson()));
  };

  const getCharacters = async () => {
    const result = await playController.getCampaignPlays(campaignId);
    dispatch(playEventActions.setCharacters(result.characters.map(c => c.clientJson())));
  };

  const initializeEntities = async () => {
    await Promise.all([
      getCampaign(),
      getCharacters(),
    ]);
  };

  useEffect(() => {
    if (
      campaignId === loading?.campaignId &&
      characterId === loading?.characterId &&
      uid === loading?.uid
    ) {
      return;
    }
    setLoading({ campaignId, uid, characterId });
  }, [campaignId, uid, characterId]);

  /**
   * We do this funky bit of logic for two reasons: to prevent subscribing
   * to a stale play session that we moved away from and to prevent subscribing
   * back-to-back if there are multiple React DOM loads (which there often are).
   */
  useEffect(() => {
    if (!loading) {
      return;
    }
    if (
      campaignId !== loading.campaignId ||
      characterId !== loading.characterId ||
      uid !== loading.uid
    ) {
      return;
    }
    console.info('Subscribing to play snapshots for campaign:', campaignId, 'character:', characterId);
    const unsubscribePublic = onPublicEventSnapshot();
    const unsubscribePrivate = onPrivateEventSnapshot();
    initializeEntities();
    return () => {
      console.info('Unsubscribing from play snapshots.');
      unsubscribePublic();
      unsubscribePrivate();
    };
  }, [loading]);
}