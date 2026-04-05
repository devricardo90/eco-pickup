import {
  type PickupRequestExecutionUi,
  type HistoryScope,
  type PickupRequestDetail,
  type PickupRequestListCardUi,
  type PickupRequestMetadataEntry,
  type PickupRequestPaymentUi,
  type PickupRequestPricingUi,
  type PickupRequestSchedulingUi,
  type PickupRequestSummaryUi
} from "@/lib/tracking/types";
import { formatTimelineDate, mapStatusLabel } from "@/lib/tracking/mapTimelineEventToUi";

function formatUtcRange(startUtc: string, endUtc: string) {
  return `${formatTimelineDate(startUtc)} to ${formatTimelineDate(endUtc)}`;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency
  }).format(value);
}

function humanizeCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatPricingBreakdownLabel(value: number, currency: string) {
  return formatCurrency(value, currency);
}

export function mapPickupRequestSummaryToUi(
  detail: PickupRequestDetail,
  lastUpdatedLabel: string
): PickupRequestSummaryUi {
  const itemCount = detail.items.length;

  return {
    requestId: detail.id,
    headline: detail.description,
    currentStatus: mapStatusLabel(detail.status),
    lastUpdatedLabel,
    itemSummary: `${humanizeCount(itemCount, "item", "items")} | ${detail.items.map((item) => item.category).join(", ")}`,
    createdLabel: formatTimelineDate(detail.createdUtc)
  };
}

export function mapPickupRequestMetadataToUi(detail: PickupRequestDetail): PickupRequestMetadataEntry[] {
  const entries: PickupRequestMetadataEntry[] = [
    {
      label: "Requested pickup window",
      value: formatUtcRange(detail.pickupWindowStartUtc, detail.pickupWindowEndUtc)
    },
    {
      label: "Address",
      value: `${detail.address.street}, ${detail.address.postalCode} ${detail.address.city}`
    },
    {
      label: "Access",
      value: detail.address.floor
        ? `Floor ${detail.address.floor} | ${detail.address.hasElevator ? "Elevator available" : "No elevator"}`
        : detail.address.hasElevator
          ? "Ground access | Elevator available"
          : "Ground access | No elevator"
    },
    {
      label: "Photos attached",
      value: humanizeCount(
        detail.items.reduce((total, item) => total + item.photos.length, 0),
        "photo",
        "photos"
      )
    }
  ];

  if (detail.address.accessNotes) {
    entries.push({
      label: "Access notes",
      value: detail.address.accessNotes
    });
  }

  if (detail.scheduling) {
    entries.push({
      label: "Confirmed schedule",
      value: formatUtcRange(
        detail.scheduling.confirmedPickupWindowStartUtc,
        detail.scheduling.confirmedPickupWindowEndUtc
      )
    });
  }

  if (detail.pricing) {
    entries.push({
      label: "Quoted total",
      value: formatCurrency(detail.pricing.total, detail.pricing.currency)
    });
  }

  return entries;
}

export function mapPickupRequestPricingToUi(detail: PickupRequestDetail): PickupRequestPricingUi | null {
  if (detail.status === "under_review" && !detail.pricing) {
    return {
      title: "Quote in review",
      description:
        "Your request is being reviewed. Pricing has not been published yet, so there is nothing to approve or pay at this stage.",
      totalLabel: null,
      breakdown: [],
      tone: "pending"
    };
  }

  if (!detail.pricing) {
    return null;
  }

  if (detail.status === "quoted") {
    return {
      title: "Quote available",
      description:
        "Pricing has been prepared for this request. Payment is not yet active on this surface, but the current quote is now visible.",
      totalLabel: formatCurrency(detail.pricing.total, detail.pricing.currency),
      breakdown: [
        {
          label: "Base price",
          value: formatPricingBreakdownLabel(detail.pricing.basePrice, detail.pricing.currency)
        },
        {
          label: "Size adjustment",
          value: formatPricingBreakdownLabel(detail.pricing.sizeAdjustment, detail.pricing.currency)
        },
        {
          label: "Floor adjustment",
          value: formatPricingBreakdownLabel(detail.pricing.floorAdjustment, detail.pricing.currency)
        },
        {
          label: "Distance adjustment",
          value: formatPricingBreakdownLabel(detail.pricing.distanceAdjustment, detail.pricing.currency)
        }
      ],
      tone: "quoted"
    };
  }

  if (detail.status === "awaiting_payment") {
    return {
      title: "Awaiting payment",
      description:
        "This request is priced and waiting for payment. The pricing below is the active amount currently attached to the request.",
      totalLabel: formatCurrency(detail.pricing.total, detail.pricing.currency),
      breakdown: [
        {
          label: "Base price",
          value: formatPricingBreakdownLabel(detail.pricing.basePrice, detail.pricing.currency)
        },
        {
          label: "Size adjustment",
          value: formatPricingBreakdownLabel(detail.pricing.sizeAdjustment, detail.pricing.currency)
        },
        {
          label: "Floor adjustment",
          value: formatPricingBreakdownLabel(detail.pricing.floorAdjustment, detail.pricing.currency)
        },
        {
          label: "Distance adjustment",
          value: formatPricingBreakdownLabel(detail.pricing.distanceAdjustment, detail.pricing.currency)
        }
      ],
      tone: "awaiting_payment"
    };
  }

  return detail.pricing
    ? {
        title: "Pricing snapshot",
        description: "The latest persisted pricing for this request is shown below.",
        totalLabel: formatCurrency(detail.pricing.total, detail.pricing.currency),
        breakdown: [
          {
            label: "Base price",
            value: formatPricingBreakdownLabel(detail.pricing.basePrice, detail.pricing.currency)
          },
          {
            label: "Size adjustment",
            value: formatPricingBreakdownLabel(detail.pricing.sizeAdjustment, detail.pricing.currency)
          },
          {
            label: "Floor adjustment",
            value: formatPricingBreakdownLabel(detail.pricing.floorAdjustment, detail.pricing.currency)
          },
          {
            label: "Distance adjustment",
            value: formatPricingBreakdownLabel(detail.pricing.distanceAdjustment, detail.pricing.currency)
          }
        ],
        tone: detail.status === "paid" ? "paid" : "quoted"
      }
    : null;
}

export function mapPickupRequestPaymentToUi(detail: PickupRequestDetail): PickupRequestPaymentUi | null {
  if (!detail.pricing) {
    return null;
  }

  if (detail.status === "awaiting_payment") {
    return {
      title: "Payment ready",
      description:
        "Your quote is active and this request is waiting for payment. Continue to checkout using the current persisted total.",
      amountLabel: formatCurrency(detail.pricing.total, detail.pricing.currency),
      actionLabel: "Continue to checkout",
      tone: "awaiting_payment"
    };
  }

  if (detail.status === "paid") {
    return {
      title: "Payment confirmed",
      description:
        "Payment has already been confirmed for this request. No further owner payment action is required on this surface.",
      amountLabel: formatCurrency(detail.pricing.total, detail.pricing.currency),
      actionLabel: null,
      tone: "paid"
    };
  }

  return null;
}

export function mapPickupRequestSchedulingToUi(detail: PickupRequestDetail): PickupRequestSchedulingUi | null {
  if (detail.status === "paid") {
    return {
      title: "Payment complete",
      description:
        "Payment is confirmed. The next operational step is schedule confirmation, which will appear here once the pickup window is locked.",
      confirmedWindowLabel: null,
      tone: "paid"
    };
  }

  if (detail.status === "scheduled" && detail.scheduling) {
    return {
      title: "Pickup scheduled",
      description:
        "Your pickup window has been confirmed. Use this time range as the current operational collection window.",
      confirmedWindowLabel: formatUtcRange(
        detail.scheduling.confirmedPickupWindowStartUtc,
        detail.scheduling.confirmedPickupWindowEndUtc
      ),
      tone: "scheduled"
    };
  }

  return null;
}

export function mapPickupRequestExecutionToUi(detail: PickupRequestDetail): PickupRequestExecutionUi | null {
  if (detail.status === "in_transit") {
    return {
      title: "Pickup in transit",
      description:
        "Your request is currently in the live execution phase. The collection is underway and the team is moving through the confirmed operational flow.",
      highlightLabel: detail.scheduling
        ? formatUtcRange(
            detail.scheduling.confirmedPickupWindowStartUtc,
            detail.scheduling.confirmedPickupWindowEndUtc
          )
        : null,
      tone: "in_transit"
    };
  }

  if (detail.status === "collected") {
    return {
      title: "Items collected",
      description:
        "Collection has been completed and the request has moved past the pickup step. Any remaining processing now happens after the physical collection.",
      highlightLabel: null,
      tone: "collected"
    };
  }

  if (detail.status === "completed") {
    return {
      title: "Request completed",
      description:
        "This pickup request has completed its tracked lifecycle. The main operational steps have finished successfully on this surface.",
      highlightLabel: null,
      tone: "completed"
    };
  }

  return null;
}

export function mapPickupRequestListCardToUi(
  item: PickupRequestDetail,
  scope: HistoryScope
): PickupRequestListCardUi {
  return {
    id: item.id,
    title: item.description,
    href: scope === "admin" ? `/admin/tracking/${item.id}` : `/tracking/${item.id}`,
    statusLabel: mapStatusLabel(item.status),
    createdLabel: formatTimelineDate(item.createdUtc),
    pickupWindowLabel: formatUtcRange(item.pickupWindowStartUtc, item.pickupWindowEndUtc),
    itemSummary: `${humanizeCount(item.items.length, "item", "items")} | ${item.items.map((entry) => entry.category).join(", ")}`,
    priceSummary: item.pricing ? formatCurrency(item.pricing.total, item.pricing.currency) : null
  };
}
