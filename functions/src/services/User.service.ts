import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { User, UserColorTheme, UserFactory } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';

export class UserService extends Service{
  private factory: UserFactory;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new UserFactory();
  }

  public async getUser(uid: string): Promise<User | null> {
    const doc = await this.db.collection('users').doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    return this.factory.storeJson({ id: doc.id, ...doc.data() } as any);
  }

  public async createUser(
    uid: string,
    email?: string,
    displayName?: string,
  ): Promise<User> {
    const [ existingUserByUid, existingUserByEmail ] = await Promise.all([
      this.getUser(uid),
      email ? this.searchUserByEmail(email) : Promise.resolve(null),
    ]);
    if (existingUserByUid || existingUserByEmail) {
      throw new HttpsError('already-exists', 'User already exists');
    }
    const user = new User(
      uid,
      email || '',
      displayName || '',
    );
    await this.db.collection('users').doc(user.uid).set(user.storeJson());
    return user;
  }

  public async updateUser(
    uid: string,
    displayName?: string,
    colorTheme?: UserColorTheme,
  ): Promise<User | null> {
    const user = await this.getUser(uid);
    if (!user) {
      return null;
    }
    user.displayName = displayName || user.displayName;
    user.colorTheme = colorTheme || user.colorTheme;
    user.updatedAt = new Date();
    await this.db.collection('users').doc(user.uid).set(user.storeJson());
    return user;
  }

  public async searchUserByEmail(
    email: string,
  ): Promise<User | null> {
    const snapshot = await this.db.collection('users')
      .where('email', '==', email)
      .get();
    if (snapshot.empty || !snapshot.docs.length || !snapshot.docs[0]) {
      return null;
    }
    const data = snapshot.docs[0].data();
    return this.factory.storeJson({ id: snapshot.docs[0].id, ...data } as any);
  }
}
