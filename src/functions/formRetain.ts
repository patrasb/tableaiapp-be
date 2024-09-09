import { getDocs, query, where, writeBatch } from 'firelord';
import { form } from '@/models/form';
import { onSchedule } from 'firebase-functions/v2/scheduler';

/** Forms shall not be kept for more than three days. Function deletes old forms every 24 hours */
export const formRetain = onSchedule('0 0 * * *', async () => {
  const afterDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const querySnapshot = await getDocs(query(form.collection(), where('createdAt', '<', afterDate), where('deleted', '==', false)));

  const firestoreBatch = writeBatch();
  querySnapshot.docs.forEach(({ ref }) =>
    firestoreBatch.update(ref, {
      deleted: true,
    }),
  );
  await firestoreBatch.commit();

  return;
});
