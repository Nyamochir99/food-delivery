const LEGACY_SSL_MODES = new Set(["require", "prefer", "verify-ca"]);

export const normalizeDatabaseUrl = (url: string | undefined): string => {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get("sslmode");

    if (
      sslmode &&
      LEGACY_SSL_MODES.has(sslmode) &&
      !parsed.searchParams.has("uselibpqcompat")
    ) {
      parsed.searchParams.set("uselibpqcompat", "true");
    }

    return parsed.toString();
  } catch {
    return url;
  }
};
