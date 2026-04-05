export type HistoryScope = "owner" | "admin";

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
