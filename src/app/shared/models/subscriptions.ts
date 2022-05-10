export interface GetSubscriptionsResponse {
  totalPurchased: number;
  using: string[];
  assigned: AuthSubscription[];
  previouslyAssigned: string[];
}

export interface AuthSubscription {
  activated: boolean;
  autoRenew: boolean;
  email: string;
  expiryDate: string;
}
