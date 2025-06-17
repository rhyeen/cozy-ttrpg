import type { ClientDocumentJson, DocumentJson, StoreDocumentJson } from '../json/Json';

export abstract class Entity<StoreJsonT, ClientJsonT> {
  public abstract storeJson(): StoreJsonT;
  public abstract clientJson(): ClientJsonT;
  public abstract copy(): Entity<StoreJsonT, ClientJsonT>;
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

export abstract class EntityFactory<T extends Entity<StoreJsonT, ClientJsonT>, StoreJsonT, ClientJsonT, StoreOtherT, ClientOtherT> {
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

export abstract class DocumentEntity<StoreJsonT extends DocumentJson, ClientJsonT extends DocumentJson> extends Entity<StoreJsonT, ClientJsonT> {
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

  protected storeDocumentJson(): StoreDocumentJson {
    return {
      createdAt: copyDate(this.createdAt),
      updatedAt: copyDate(this.updatedAt),
      deletedAt: this.deletedAt ? copyDate(this.deletedAt) : null,
    };
  }
}
