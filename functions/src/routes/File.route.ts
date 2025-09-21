import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { FileService } from '../services/File.service';
import { type CallableRequest, HttpsError, type HttpsFunction } from 'firebase-functions/https';

export class FileRoute extends Route {
  private service: FileService;

  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new FileService(db);
  }

  public async getFiles(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    if (!request.data || !request.data.filterTo || !request.data.filterTo.contentTypes) {
      throw new HttpsError('invalid-argument', 'Filter to content types is required');
    }
    const data = {
      filterTo: {
        contentTypes: [...request.data.filterTo.contentTypes],
      },
    };
    if (!data.filterTo.contentTypes.length) {
      throw new HttpsError('invalid-argument', 'Content types are required');
    }
    const files = await this.service.getFiles(
      this.getUidFromRequest(request),
      data.filterTo,
    );
    return this.handleJsonResponse({ items: files.map(file => file.clientJson()) });
  }

  public async setFile(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    if (!request.data || !request.data.file) {
      throw new HttpsError('invalid-argument', 'File is required');
    }
    const data = {
      file: request.data.file,
    };
    const file = await this.service.setFile(
      this.getUidFromRequest(request),
      data.file,
    );
    return this.handleJsonResponse({ item: file.clientJson() });
  }
}
