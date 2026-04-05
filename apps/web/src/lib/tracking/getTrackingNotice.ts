export function getTrackingNotice(searchParams: {
  saved?: string;
  submitted?: string;
  submitFailed?: string;
}) {
  if (searchParams.submitFailed === "1") {
    return "Draft saved, but submission did not complete. Retry from this detail page when you are ready.";
  }

  if (searchParams.submitted === "1") {
    return "Pickup request submitted successfully.";
  }

  if (searchParams.saved === "1") {
    return "Pickup request saved as draft.";
  }

  return null;
}
