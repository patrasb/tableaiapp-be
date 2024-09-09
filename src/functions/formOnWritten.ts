import { Form } from '@/models/form';
import { storage } from '@/utils/firebase';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { type DocumentSnapshot } from 'firelord';

/**
 * Deletes the cloud storage objects on the form doc, either when the doc has been deleted,
 * or the field `deleted` has been set to `true`.
 */
export const formOnWritten = onDocumentWritten('forms/{id}', async ({ data, params }) => {
  const formDocBefore = data?.before as DocumentSnapshot<Form>;
  const formDocAfter = data?.after as DocumentSnapshot<Form>;

  // If an after doc doesn't exists, that means that it has been delted. Otherwise we check if deleted has been set to true
  if (!formDocAfter.exists || (formDocBefore.data()?.deleted === false && formDocAfter.data()?.deleted === true)) {
    await storage.bucket().deleteFiles({ prefix: params.id });
  }

  return;
});
