export abstract class Entity<JsonT> {
  public abstract toJSON(): JsonT;
  public abstract copy(): Entity<JsonT>;
}

export abstract class EntityFactory<T extends Entity<JsonT>, JsonT> {
  public abstract fromJSON(json: JsonT): T;
}
