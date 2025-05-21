import { DocumentJson } from '../json/Json';

export abstract class Entity<JsonT> {
  public abstract toJSON(): JsonT;
  public abstract copy(): Entity<JsonT>;
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

export abstract class EntityFactory<T extends Entity<JsonT>, JsonT> {
  public abstract fromJSON(json: JsonT): T;

  protected copyDocumentJson(json: DocumentJson): DocumentJson {
    return {
      createdAt: copyDate(json.createdAt),
      updatedAt: copyDate(json.updatedAt),
      deletedAt: json.deletedAt ? copyDate(json.deletedAt) : null,
    };
  }
}

export abstract class DocumentEntity<JsonT extends DocumentJson> extends Entity<JsonT> {
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(json?: DocumentJson) {
    super();
    this.createdAt = copyDate(json?.createdAt ?? new Date());
    this.updatedAt = copyDate(json?.updatedAt ?? new Date());
    this.deletedAt = json?.deletedAt ? copyDate(json.deletedAt) : null;
  }

  protected copyDocumentJson(): DocumentJson {
    return {
      createdAt: copyDate(this.createdAt),
      updatedAt: copyDate(this.updatedAt),
      deletedAt: this.deletedAt ? copyDate(this.deletedAt) : null,
    };
  }
}
