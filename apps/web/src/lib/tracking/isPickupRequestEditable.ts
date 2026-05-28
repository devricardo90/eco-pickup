const editableStatuses = new Set(["draft"]);

export function isPickupRequestEditable(status: string) {
  return editableStatuses.has(status.trim().toLowerCase());
}

const photoUploadStatuses = new Set(["draft", "submitted"]);

export function isPickupRequestPhotoUploadAllowed(status: string) {
  return photoUploadStatuses.has(status.trim().toLowerCase());
}
