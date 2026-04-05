type CreatePickupRequestFormInput = {
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
  itemCategory: string;
  itemDescription: string;
  itemEstimatedSize: string;
};

function toUtcIso(date: string, time: string) {
  return new Date(`${date}T${time}:00Z`).toISOString();
}

export function buildCreatePickupRequestPayload(input: CreatePickupRequestFormInput) {
  return {
    description: input.description,
    pickupWindowStartUtc: toUtcIso(input.pickupWindowDate, input.pickupWindowStartTime),
    pickupWindowEndUtc: toUtcIso(input.pickupWindowDate, input.pickupWindowEndTime),
    address: {
      street: input.street,
      city: input.city,
      postalCode: input.postalCode,
      floor: input.floor || null,
      hasElevator: input.hasElevator,
      accessNotes: input.accessNotes || null
    },
    items: [
      {
        category: input.itemCategory,
        description: input.itemDescription,
        estimatedSize: input.itemEstimatedSize
      }
    ]
  };
}
