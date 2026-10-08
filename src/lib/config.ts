// Site-specific configuration, injected at build time via PUBLIC_* env vars.
// Every value is optional; unset values disable the corresponding feature.

export const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? "";
export const CANONICAL_URL = import.meta.env.PUBLIC_CANONICAL_URL ?? "";
export const ANALYTICS_DOMAIN = import.meta.env.PUBLIC_ANALYTICS_DOMAIN ?? "";

export const D1_API_URL = (import.meta.env.PUBLIC_D1_API_URL ?? "").replace(
  /\/$/,
  "",
);
export const D1_ENABLED = Boolean(D1_API_URL);

export const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL ?? "";

// "gm@example.com" + "dolmenwood-map" -> "gm+dolmenwood-map@example.com"
export function contactEmailWithTag(tag: string): string {
  if (!CONTACT_EMAIL) return "";
  const [local, domain] = CONTACT_EMAIL.split("@");
  if (!domain) return CONTACT_EMAIL;
  return `${local}+${tag}@${domain}`;
}
