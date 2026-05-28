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

export type PickupRequestItemFormValue = {
  category: string;
  description: string;
  estimatedSize: string;
};

export type PickupRequestFormValues = {
  description: string;
  pickupWindowDate: string;
  pickupWindowStartTime: string;
  pickupWindowEndTime: string;
  street: string;
  city: string;
  postalCode: string;
  floor: string;
  hasElevator: boolean;
  accessNotes: string;
  items: PickupRequestItemFormValue[];
};

export type PickupRequestFormActionState = {
  error?: string;
};

export type UploadPhotoActionState = {
  error?: string;
  ok?: boolean;
};
