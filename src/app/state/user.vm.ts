export interface UserVm {
  email: string;
  createdAt: string;
  confirmed: boolean;

  accessToken: string;
  refreshToken: string;
  expires: string;
}
