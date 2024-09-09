export enum StripeRole {
  Free = 'free',
  Starter = 'starter',
  Pro = 'pro',
}

export const StripeRoleAvailableCredits: Record<StripeRole, number> = {
  [StripeRole.Free]: 0,
  [StripeRole.Starter]: 100,
  [StripeRole.Pro]: 500,
};
