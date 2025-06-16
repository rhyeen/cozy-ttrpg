import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from '../firebase';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export function usePlayEventSnapshot(
  campaignId: string,
  uid: string,
  characterId: string,
): void {
  const dispatch = useDispatch();

  useEffect(() => {
    const eventsRef = collection(firestore, "campaigns", campaignId, "events");
    const publicQ = query(eventsRef, orderBy("createdAt"));
    const unsubscribePublic = onSnapshot(publicQ, snap => {
      snap.docChanges().forEach(change => {
        const data = change.doc.data();
        debugger;
        if (change.type === "added") {
          dispatch({ type: 'ADD_PUBLIC_EVENT', payload: data });
        } else if (change.type === "modified") {
          dispatch({ type: 'UPDATE_PUBLIC_EVENT', payload: data });
        } else if (change.type === "removed") {
          dispatch({ type: 'REMOVE_PUBLIC_EVENT', payload: data });
        }
      });
    });
    const myEventsRef = collection(firestore, "campaigns", campaignId, "players", uid, "characters", characterId, "events");
    const myQ = query(myEventsRef, orderBy("createdAt"));
    const unsubscribeMy = onSnapshot(myQ, snap => {
      snap.docChanges().forEach(change => {
        const data = change.doc.data();
        debugger;
        if (change.type === "added") {
          dispatch({ type: 'ADD_PRIVATE_EVENT', payload: data });
        } else if (change.type === "modified") {
          dispatch({ type: 'UPDATE_PRIVATE_EVENT', payload: data });
        } else if (change.type === "removed") {
          dispatch({ type: 'REMOVE_PRIVATE_EVENT', payload: data });
        }
      });
    });
    return () => {
      unsubscribePublic();
      unsubscribeMy();
    };
  }, [campaignId, uid, characterId]);
}