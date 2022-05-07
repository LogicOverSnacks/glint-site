export interface GetSubscriptionsResponse {
  totalPurchased: number;
  using: AuthSubscription[];
  assigned: AuthSubscription[];
}

export interface AuthSubscription {
  accessLevel: 'pro';
  activated: boolean;
  autoRenew: boolean;
  email: string;
  expiryDate: string | null;
}
