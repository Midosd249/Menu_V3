/**
 * The upstream identity providers this app offers for sign-in.
 *
 * Google is the only social provider intentionally enabled for Menu V3.
 * Email/password remains available through Better Auth.
 */
export type GrokProvider = {
  providerId: string;
  idp: string;
  label: string;
};

export const GROK_PROVIDERS: readonly GrokProvider[] = [
  { providerId: "grok-google", idp: "google", label: "Google" },
];
