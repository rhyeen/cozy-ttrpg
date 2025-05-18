import { firestore } from 'firebase-admin';
import type { Response } from 'express';

export type FunctionsResponse<T = any> = Response<any>;

export class Route {
  protected db: firestore.Firestore;

  constructor(
    db: firestore.Firestore,
  ) {
    this.db = db;
  }

  protected handleJsonResponse(resp: any, type?: string, res?: FunctionsResponse): any {
    const result = JSON.parse(JSON.stringify({
        type: type !== null && type !== void 0 ? type : null,
        data: resp,
    }));
    if (res) {
      res.status(200).send({ result });
    }
    return result;
  }
}
