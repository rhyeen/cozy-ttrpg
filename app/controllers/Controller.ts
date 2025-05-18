import { functions } from '../utils/firebase';
import { httpsCallable } from 'firebase/functions';

export interface FirebaseResult<T> {
  data: T;
  error?: string;
}

export class Controller {
  constructor() {}

  protected async callFirebase<RequestData, ResultData>(
    functionName: string, data: RequestData,
  ): Promise<ResultData> {
    const callable = httpsCallable<
      RequestData,
      FirebaseResult<ResultData>
    >(functions, functionName);
    const result = await callable(data);
    if (result.data.error) {
      throw new Error(result.data.error);
    }
    return result.data.data;
  }
}
