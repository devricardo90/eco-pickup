import {
  type PickupRequestDetail,
  type PickupRequestMetadataEntry,
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
    itemSummary: `${humanizeCount(itemCount, "item", "items")} · ${detail.items.map((item) => item.category).join(", ")}`,
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
        ? `Floor ${detail.address.floor} · ${detail.address.hasElevator ? "Elevator available" : "No elevator"}`
        : detail.address.hasElevator
          ? "Ground access · Elevator available"
          : "Ground access · No elevator"
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
