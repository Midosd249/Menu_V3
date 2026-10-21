const PENDING_INVITATION_KEY = "menuun.pending-team-invitation-token";

export function isValidInvitationToken(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length >= 40 && value.length <= 200 && /^[A-Za-z0-9-]+$/.test(value);
}

export function persistPendingInvitationToken(value: string): void {
  if (!isValidInvitationToken(value) || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_INVITATION_KEY, value);
  } catch {
    // The URL remains the primary source when browser storage is unavailable.
  }
}

export function getPendingInvitationToken(search?: string): string {
  if (typeof window === "undefined") return "";
  const query = new URLSearchParams(search ?? window.location.search).get("invite")?.trim() ?? "";
  if (isValidInvitationToken(query)) {
    persistPendingInvitationToken(query);
    return query;
  }
  try {
    const stored = window.localStorage.getItem(PENDING_INVITATION_KEY);
    if (isValidInvitationToken(stored)) return stored;
    if (stored) window.localStorage.removeItem(PENDING_INVITATION_KEY);
  } catch {
    // Browser storage can be disabled; callers still support URL-based invitations.
  }
  return "";
}

export function clearPendingInvitationToken(value?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (value && window.localStorage.getItem(PENDING_INVITATION_KEY) !== value) return;
    window.localStorage.removeItem(PENDING_INVITATION_KEY);
  } catch {
    // Clearing optional recovery state must never block invitation acceptance.
  }
}
