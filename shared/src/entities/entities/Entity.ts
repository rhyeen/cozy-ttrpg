import { DocumentJson } from '../json/Json';

export abstract class Entity<JsonT> {
  public abstract toJSON(): JsonT;
  public abstract copy(): Entity<JsonT>;
}

export abstract class EntityFactory<T extends Entity<JsonT>, JsonT> {
  public abstract fromJSON(json: JsonT): T;

  protected copyDocumentJson(json: DocumentJson): DocumentJson {
    return {
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      deletedAt: json.deletedAt ? new Date(json.deletedAt) : null,
    };
  }
}

export abstract class DocumentEntity<JsonT extends DocumentJson> extends Entity<JsonT> {
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(json?: DocumentJson) {
    super();
    this.createdAt = json?.createdAt ?? new Date();
    this.updatedAt = json?.updatedAt ?? new Date();
    this.deletedAt = json?.deletedAt ?? null;
  }

  protected copyDocumentJson(): DocumentJson {
    return {
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
      deletedAt: this.deletedAt ? new Date(this.deletedAt) : null,
    };
  }
}
