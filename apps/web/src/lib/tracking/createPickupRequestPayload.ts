type PickupRequestFormInput = {
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
  items: Array<{
    category: string;
    description: string;
    estimatedSize: string;
  }>;
};

function toUtcIso(date: string, time: string) {
  return new Date(`${date}T${time}:00Z`).toISOString();
}

export function buildPickupRequestPayload(input: PickupRequestFormInput) {
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
    items: input.items.map((item) => ({
      category: item.category,
      description: item.description,
      estimatedSize: item.estimatedSize
    }))
  };
}
