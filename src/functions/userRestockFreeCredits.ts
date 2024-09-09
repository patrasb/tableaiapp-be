import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getDocs, query, where, writeBatch } from 'firelord';
import { user } from '@/models/user';
import { StripeRole, StripeRoleAvailableCredits } from '@/shared/Billing';

/** Free users have their free credits restocked every 24 hours */
export const userRestockFreeCredits = onSchedule('0 0 * * *', async () => {
  const querySnapshot = await getDocs(
    query(user.collection(), where('stripeRole', '==', StripeRole.Free), where('availableCredits', '<', StripeRoleAvailableCredits[StripeRole.Free])),
  );

  const firestoreBatch = writeBatch();

  querySnapshot.docs.forEach(({ ref }) => {
    firestoreBatch.update(ref, { availableCredits: StripeRoleAvailableCredits[StripeRole.Free] });
  });

  await firestoreBatch.commit();

  return;
});
