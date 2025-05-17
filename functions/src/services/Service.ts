import { firestore } from 'firebase-admin';

export class Service {
  protected db: firestore.Firestore;

  constructor(db: firestore.Firestore) {
    this.db = db;
  }
}
