export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  createdUtc: string;
};

export type AuthTokenResult = {
  accessToken: string;
  tokenType: string;
  expiresAtUtc: string;
  user: AuthenticatedUser;
};

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresAtUtc: string;
  user: AuthenticatedUser;
};

export type AuthActionState = {
  error?: string;
};
