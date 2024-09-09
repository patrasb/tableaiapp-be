/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Subscription, user } from '@/models/user';
import { StripeRoleAvailableCredits } from '@/shared/Billing';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { updateDoc, type DocumentSnapshot } from 'firelord';

/**
 * This functions checks if a change to the current billing period end has been made in the
 * users subscription subscollection by the stripe webhook. If so, we restock his plans credit.
 * This also triggers on initial plan creation.
 */
export const userRestockPaidCredits = onDocumentWritten('users/{uid}/subscriptions/{subscriptionId}', async (event) => {
  const subscriptionDocBefore = event.data?.before as DocumentSnapshot<Subscription>;
  const subscriptionDocAfter = event.data?.after as DocumentSnapshot<Subscription>;

  const currentPeriodEndBefore = subscriptionDocBefore.data()?.['current_period_end'];
  const currentPeriodEndAfter = subscriptionDocAfter.data()?.['current_period_end'];

  const { role, status } = subscriptionDocAfter.data()!;

  // If the before document doesn't exist, this means that the document has been just created, so we can safely go
  // ahead and credit the user. If a subscription has been renewed, we check if the currentPeriodEndAfter has been
  // updated indicateding that it has been extended by stripe. For all we check if the status is active.
  if ((!currentPeriodEndBefore || currentPeriodEndAfter !== currentPeriodEndBefore) && status === 'active')
    await updateDoc(user.doc(event.params.uid), {
      availableCredits: StripeRoleAvailableCredits[role],
      stripeRole: role,
    });

  return;
});
