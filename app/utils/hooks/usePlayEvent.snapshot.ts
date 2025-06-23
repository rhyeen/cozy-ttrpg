import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestore } from '../firebase';
import { useEffect } from 'react';
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

  const onPublicEventSnapshot = () => {
    const eventsRef = collection(firestore, "campaigns", campaignId, "events");
    // @NOTE: Don't get events that are older than 1 minute
    const publicQ = query(
      eventsRef,
      where("createdAt" , ">=", new Date(Date.now() - 60 * 1000)),
      orderBy("createdAt"),
    );
    return onSnapshot(publicQ, snap => {
      snap.docChanges().forEach(change => {
        const data = change.doc.data() as StorePublicPlayEventJson;
        data.id = change.doc.id;
        const event = publicPlayEventFactory.storeJson(data);
        dispatch(playEventActions.addPublicEvent(event.clientJson()));
      });
    });
  };

  const onPrivateEventSnapshot = () => {
    const myEventsRef = collection(firestore, "campaigns", campaignId, "players", uid, "characters", characterId, "events");
    const myQ = query(myEventsRef, orderBy("createdAt"));
    return onSnapshot(myQ, snap => {
      snap.docChanges().forEach(change => {
        const data = change.doc.data() as StorePrivatePlayEventJson;
        data.createdAt = copyDate(data.createdAt);
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
    const unsubscribePublic = onPublicEventSnapshot();
    const unsubscribePrivate = onPrivateEventSnapshot();
    initializeEntities();
    return () => {
      unsubscribePublic();
      unsubscribePrivate();
    };
  }, [campaignId, uid, characterId]);
}