import { firestore } from 'firebase-admin';

export class Route {
  protected db: firestore.Firestore;

  constructor(
    db: firestore.Firestore,
  ) {
    this.db = db;
  }
}
