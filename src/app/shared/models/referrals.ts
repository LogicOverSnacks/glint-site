export interface GetReferralAccountResponse {
  account: {
    accountId: string;
    refersVia: string;
    signupComplete: boolean;
  } | null;
}
