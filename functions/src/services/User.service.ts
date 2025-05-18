import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { User, UserFactory } from '@rhyeen/cozy-ttrpg-shared';

export class UserService extends Service{
  private factory: UserFactory;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new UserFactory();
  }

  public async getUser(id: string): Promise<User | null> {
    const doc = await this.db.collection('users').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.factory.fromJSON({ id: doc.id, ...doc.data() } as any);
  }

  public async createUser(
    uid: string,
    email?: string,
    displayName?: string,
  ): Promise<User> {
    const user = new User(
      uid,
      email || '',
      displayName || '',
    );
    await this.db.collection('users').doc(user.uid).set(user.toJSON());
    return user;
  }

  public async updateUser(
    uid: string,
    displayName?: string,
  ): Promise<User | null> {
    const user = await this.getUser(uid);
    if (!user) {
      return null;
    }
    user.displayName = displayName || user.displayName;
    user.updatedAt = new Date();
    await this.db.collection('users').doc(user.uid).set(user.toJSON());
    return user;
  }
}
