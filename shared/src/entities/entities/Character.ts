import type { DocumentJson } from '../json/Json';
import type { ClientCharacterJson, RootCharacterJson, StoreCharacterJson } from '../json/Character.json';
import { DocumentEntity, removeUndefinedFields } from './Entity';
import { generateId } from '../../utils/idGenerator';

export class Character extends DocumentEntity<StoreCharacterJson, ClientCharacterJson> {
  public id: string;
  public name?: string;
  public nickname?: string;
  public uid: string;
  public background?: string;
  public private: {
    background?: string;
  } = {};

  constructor(
    id: string,
    uid: string,
    name?: string,
    nickname?: string,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.nickname = nickname;
  }

  private rootJson(): RootCharacterJson {
    return {
      id: this.id,
      uid: this.uid,
      name: this.name || '',
      nickname: this.nickname || '',
      background: this.background,
      private: {
        background: this.private.background,
      },
    };
  }

  private rootPartialJson(diff: Character): Partial<RootCharacterJson> {
    return {
      id: this.id,
      uid: diff.uid !== this.uid ? this.uid : undefined,
      name: diff.name !== this.name ? this.name : undefined,
      nickname: diff.nickname !== this.nickname ? this.nickname : undefined,
      background: diff.background !== this.background ? this.background : undefined,
      private: {
        background: diff.private.background !== this.private.background ?
          this.private.background : undefined,
      },
    };
  }

  public override update(updates: Partial<ClientCharacterJson>): void {
    // @NOTE: There are several fields that are not allowed to be updated
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.nickname !== undefined) this.nickname = updates.nickname;
    if (updates.background !== undefined) this.background = updates.background;
    if (updates.private?.background !== undefined) {
      this.private.background = updates.private.background;
    }
  }

  public storeJson(): StoreCharacterJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
    };
  }

  public clientJson(): ClientCharacterJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
    };
  }

  public override storePartialJson(diff: Character): Partial<StoreCharacterJson> {
    return removeUndefinedFields({
      ...this.rootPartialJson(diff),
      ...this.storePartialDocumentJson(diff),
    });
  }

  public override clientPartialJson(diff: Character): Partial<ClientCharacterJson> {
    return removeUndefinedFields({
      ...this.rootPartialJson(diff),
      ...this.clientPartialDocumentJson(diff),
    });
  }

  public copy(): Character {
    const copy = new Character(
      this.id,
      this.uid,
      this.name,
      this.nickname,
      this.clientDocumentJson(),
    );
    copy.background = this.background;
    copy.private.background = this.private.background;
    return copy;
  }

  public static generateId(): string {
    return generateId('CH', 20);
  }
}