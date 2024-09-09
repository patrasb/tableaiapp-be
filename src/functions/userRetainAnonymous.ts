import { getDocs, query, where } from 'firelord';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { user } from '@/models/user';
import { auth } from '@/utils/firebase';

/** We delete anonymous users after 30 days. Triggers userOnDelete to cleanup data */
export const userRetainAnonymous = onSchedule('0 0 * * *', async () => {
  const afterDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

  const querySnapshot = await getDocs(query(user.collection(), where('createdAt', '<', afterDate), where('isAnonymous', '==', true)));

  const uids = querySnapshot.docs.map((doc) => doc.id);
  await auth.deleteUsers(uids);

  return;
});
