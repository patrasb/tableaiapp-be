import { type StripeRole } from '@/shared/Billing';
import { db } from '@/utils/firebase';

import { type MetaTypeCreator, getFirelord, Timestamp, ServerTimestamp, PossiblyReadAsUndefined } from 'firelord';

export type User = MetaTypeCreator<
  {
    displayName: string | null;
    email: string | null;
    emailVerified: boolean | null;
    photoUrl: string | null;
    isAnonymous: boolean;
    createdAt: Timestamp;
    availableCredits: number;
    stripeRole: StripeRole;
  },
  'users',
  string
>;

export type CheckoutSession = MetaTypeCreator<
  {
    price: string;
    success_url: string;
    cancel_url: string;
    url: string | PossiblyReadAsUndefined;
    created: ServerTimestamp | PossiblyReadAsUndefined;
  },
  'checkout_sessions',
  string,
  User
>;

export type Subscription = MetaTypeCreator<
  {
    id: string;
    stripeLink: string;
    role: StripeRole;
    status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
    quantity: number;
    current_period_end: Date;
  },
  'subscriptions',
  string,
  User
>;

export const user = getFirelord<User>(db, 'users');
export const checkoutSession = getFirelord<CheckoutSession>(db, 'users', 'checkout_sessions');
export const subscription = getFirelord<Subscription>(db, 'users', 'subscriptions');
