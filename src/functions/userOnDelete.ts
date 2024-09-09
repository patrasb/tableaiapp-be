import { functionsRegion } from '@/definitions';
import { form } from '@/models/form';
import { user } from '@/models/user';
import { db } from '@/utils/firebase';
import * as functions from 'firebase-functions';
import { deleteDoc, getDocs, query, where, writeBatch } from 'firelord';

/** When a user is deleted, we also delete all their formDocs and their userDoc */
export const userOnDelete = functions
  .region(functionsRegion)
  .auth.user()
  .onDelete(async ({ uid }) => {
    const formQuery = query(form.collection(), where('userDocRef', '==', user.doc(uid)));

    const formDocs = await getDocs(formQuery);

    const batch = writeBatch(db);

    formDocs.forEach((formDoc) => {
      batch.delete(formDoc.ref);
    });

    batch.delete(user.doc(uid));

    await batch.commit();
    await deleteDoc(user.doc(uid));

    return;
  });
