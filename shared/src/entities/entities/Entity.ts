import type { ClientDocumentJson, DocumentJson, PartialClientDocumentJson, PartialStoreDocumentJson, StoreDocumentJson } from '../json/Json';

export abstract class Entity<
StoreJsonT,
ClientJsonT,
PartialStoreJsonT,
PartialClientJsonT
> {
  public abstract storeJson(): StoreJsonT;
  public abstract clientJson(): ClientJsonT;

  /**
   * Compares the current entity with the provided diff entity and returns only the fields that have changed.
   */
  public storePartialJson(
    diff: Entity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT>,
  ): PartialStoreJsonT {
    return this.storeJson() as any as PartialStoreJsonT;
  }

  /**
   * Compares the current entity with the provided diff entity and returns only the fields that have changed.
   */
  public clientPartialJson(
    diff: Entity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT>
  ): PartialClientJsonT {
    return this.clientJson() as any as PartialClientJsonT;
  }

  /**
   * Updates the entity with the provided partial updates.
   * Note that the override should ignore any fields that are not allowed to be updated. 
   */
  public update(updates: Partial<ClientJsonT>): void {
    throw new Error('Not implemented: This entity does not support partial updates');
  }

  public abstract copy(): Entity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT>;
}

export function copyDate(
  date: Date | any,
): Date {
  if (date instanceof Date) {
    return new Date(date);
  }
  if (date.toDate) {
    return new Date(date.toDate());
  }
  return new Date(date);
}

export function removeUndefinedFields(json: any): any {
  // @NOTE: We have to call _removeUndefinedFields twice to fully scrub the object
  // once to remove all undefined fields, then again to check if there are now
  // any empty objects that need to be removed, now that they don't have
  // any undefined fields. We repeat this all the way up the object tree.
  let res = _removeUndefinedFields(json);
  res = _removeUndefinedFields(res.json);
  let removedCount = res.countOfRemovedEmptyObjects;
  while (removedCount > 0) {
    res = _removeUndefinedFields(res.json);
    removedCount = res.countOfRemovedEmptyObjects;
  }
  return res.json;
}

/**
 * @SOURCE: https://stackoverflow.com/a/38340374/6090140
 */
function _removeUndefinedFields(json: any): { json: any, countOfRemovedEmptyObjects: number } {
  let newObj: any = {};
  let countOfRemovedEmptyObjects = 0;
  Object.keys(json).forEach((key) => {
    if (json[key] === Object(json[key])) {
      if (Object.keys(json[key]).length > 0) {
        const res = _removeUndefinedFields(json[key]);
        newObj[key] = res.json;
        countOfRemovedEmptyObjects += res.countOfRemovedEmptyObjects;
      } else {
        countOfRemovedEmptyObjects++;
      }
    } else if (json[key] !== undefined) {
      newObj[key] = json[key];
    }
  });
  return { json: newObj, countOfRemovedEmptyObjects };
}

export function splitPrivatePublicJson(
  json: Partial<any>,
): {
  public: Partial<typeof json> | null;
  private: Partial<typeof json> | null;
} {
  let publicJson: Record<string, any> | null = { ...json };
  delete publicJson.private;
  let privateJson: { private: Record<string, any> } | null = { private: json.private };
  if (Object.keys(publicJson).length === 0) {
    publicJson = null;
  }
  if (!privateJson.private || Object.keys(privateJson.private).length === 0) {
    privateJson = null;
  }
  return { public: publicJson, private: privateJson };
}

export abstract class EntityFactory<T extends Entity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT>, StoreJsonT, ClientJsonT, StoreOtherT, ClientOtherT, PartialStoreJsonT, PartialClientJsonT> {
  public abstract storeJson(json: StoreJsonT, other: StoreOtherT): T;
  public abstract clientJson(json: ClientJsonT, other: ClientOtherT): T;

  protected copyDocumentJson(json: DocumentJson): DocumentJson {
    return {
      createdAt: copyDate(json.createdAt),
      updatedAt: copyDate(json.updatedAt),
      deletedAt: json.deletedAt ? copyDate(json.deletedAt) : null,
    };
  }
}

export abstract class DocumentEntity<
  StoreJsonT extends StoreDocumentJson,
  ClientJsonT extends ClientDocumentJson,
  PartialStoreJsonT extends PartialStoreDocumentJson | undefined,
  PartialClientJsonT extends PartialClientDocumentJson | undefined
> extends Entity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT> {
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(json?: DocumentJson) {
    super();
    this.createdAt = copyDate(json?.createdAt ?? new Date());
    this.updatedAt = copyDate(json?.updatedAt ?? new Date());
    this.deletedAt = json?.deletedAt ? copyDate(json.deletedAt) : null;
  }

  protected clientDocumentJson(): ClientDocumentJson {
    return {
      createdAt: copyDate(this.createdAt).getTime(),
      updatedAt: copyDate(this.updatedAt).getTime(),
      deletedAt: this.deletedAt ? copyDate(this.deletedAt).getTime() : null,
    };
  }

  protected clientPartialDocumentJson(
    diff: DocumentEntity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT>,
  ): PartialClientDocumentJson {
    return {
      createdAt: diff.createdAt.getTime() !== this.createdAt.getTime() ?
        copyDate(this.createdAt).getTime() : undefined,
      updatedAt: diff.updatedAt.getTime() !== this.updatedAt.getTime() ?
        copyDate(this.updatedAt).getTime() : undefined,
      deletedAt: diff.deletedAt?.getTime() !== this.deletedAt?.getTime() ?
        (this.deletedAt ? copyDate(this.deletedAt).getTime() : undefined) :
        undefined,
    };
  }

  protected storeDocumentJson(): StoreDocumentJson {
    return {
      createdAt: copyDate(this.createdAt),
      updatedAt: copyDate(this.updatedAt),
      deletedAt: this.deletedAt ? copyDate(this.deletedAt) : null,
    };
  }

  protected storePartialDocumentJson(
    diff: DocumentEntity<StoreJsonT, ClientJsonT, PartialStoreJsonT, PartialClientJsonT>,
  ): PartialStoreDocumentJson {
    return {
      createdAt: diff.createdAt.getTime() !== this.createdAt.getTime() ?
        copyDate(this.createdAt) : undefined,
      updatedAt: diff.updatedAt.getTime() !== this.updatedAt.getTime() ?
        copyDate(this.updatedAt) : undefined,
      deletedAt: diff.deletedAt?.getTime() !== this.deletedAt?.getTime() ?
        (this.deletedAt ? copyDate(this.deletedAt) : undefined) :
        undefined,
    };
  }
}
