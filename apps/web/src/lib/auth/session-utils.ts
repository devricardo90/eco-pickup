export function isSessionExpired(expiresAtUtc: string) {
  return Number.isNaN(Date.parse(expiresAtUtc)) || Date.parse(expiresAtUtc) <= Date.now();
}
