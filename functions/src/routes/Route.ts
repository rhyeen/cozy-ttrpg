import { firestore } from 'firebase-admin';
import type { Response } from 'express';
import { type CallableRequest, HttpsError } from 'firebase-functions/https';
import { getPlayRequest, PlayRequest } from '../utils/playRequest';

export class Route {
  protected db: firestore.Firestore;

  constructor(
    db: firestore.Firestore,
  ) {
    this.db = db;
  }

  protected handleJsonResponse(resp: any, type?: string, res?: Response<any>): any {
    const result = JSON.parse(JSON.stringify({
        type: type !== null && type !== void 0 ? type : null,
        data: resp,
    }));
    if (res) {
      res.status(200).send({ result });
    }
    return result;
  }

  protected handleOkResponse(res?: Response<any>): any {
    if (res) {
      res.status(200).send({ result: null });
    }
    return { result: { data: null } };
  }

  protected handleErrorResponse = (
    code: string,
    message?: string,
    data?: any,
    res?: Response<any>,
  ): JSON => {
    return this.handleJsonResponse({
      code,
      message,
      data,
    }, 'error', res);
  }

  protected getUserFromRequest(
    request: CallableRequest<any>,
  ): {
    uid: string;
    email: string | null;
  } {
    const uid = request.auth?.uid;
    const email = request.auth?.token?.email || null;
    if (!uid) {
      throw new HttpsError('unauthenticated', 'User is not authenticated');
    }
    return { uid, email };
  }

  protected getUidFromRequest(
    request: CallableRequest<any>,
  ): string {
    return this.getUserFromRequest(request).uid;
  }

  protected getPlayFromRequest(
    request: CallableRequest<any>,
  ): PlayRequest | undefined {
    return getPlayRequest(request) || undefined;
  }
}
