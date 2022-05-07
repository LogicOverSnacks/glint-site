export interface UserVm {
  email: string;
  accessLevel: 'free' | 'pro';
  createdAt: string;
  confirmed: boolean;

  accessToken: string;
  refreshToken: string;
  expires: string;
}
