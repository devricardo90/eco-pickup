export type HistoryScope = "owner" | "admin";

export type PickupRequestAddress = {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  floor: string | null;
  hasElevator: boolean;
  accessNotes: string | null;
};

export type PickupRequestItemPhoto = {
  id: string;
  storageKey: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  createdUtc: string;
};

export type PickupRequestItem = {
  id: string;
  category: string;
  description: string;
  estimatedSize: string;
  createdUtc: string;
  photos: PickupRequestItemPhoto[];
};

export type PickupRequestPricing = {
  basePrice: number;
  sizeAdjustment: number;
  floorAdjustment: number;
  distanceAdjustment: number;
  total: number;
  currency: string;
};

export type PickupRequestScheduling = {
  confirmedPickupWindowStartUtc: string;
  confirmedPickupWindowEndUtc: string;
};

export type PickupRequestDetail = {
  id: string;
  userId: string;
  description: string;
  status: string;
  pricing: PickupRequestPricing | null;
  scheduling: PickupRequestScheduling | null;
  pickupWindowStartUtc: string;
  pickupWindowEndUtc: string;
  createdUtc: string;
  address: PickupRequestAddress;
  items: PickupRequestItem[];
};

export type PickupRequestDetailResult =
  | {
      ok: true;
      data: PickupRequestDetail;
    }
  | {
      ok: false;
      kind: "configuration" | "not-found" | "request";
      message: string;
      statusCode?: number;
    };

export type PickupRequestHistoryEvent = {
  id: string;
  action: string;
  fromStatus: string;
  toStatus: string;
  actorUserId: string | null;
  note: string | null;
  createdUtc: string;
};

export type PickupRequestHistory = {
  pickupRequestId: string;
  currentStatus: string;
  events: PickupRequestHistoryEvent[];
};

export type PickupRequestHistoryResult =
  | {
      ok: true;
      data: PickupRequestHistory;
    }
  | {
      ok: false;
      kind: "configuration" | "not-found" | "request";
      message: string;
      statusCode?: number;
    };

export type TimelineUiEvent = {
  id: string;
  title: string;
  transitionLabel: string;
  actorLabel: string;
  note: string | null;
  createdLabel: string;
  isSystemEvent: boolean;
};

export type PickupRequestSummaryUi = {
  requestId: string;
  headline: string;
  currentStatus: string;
  lastUpdatedLabel: string;
  itemSummary: string;
  createdLabel: string;
};

export type PickupRequestMetadataEntry = {
  label: string;
  value: string;
};
