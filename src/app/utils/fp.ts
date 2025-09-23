import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedId: string | null = null;

export async function getFingerprint(): Promise<string> {
  if (cachedId) return cachedId;

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  cachedId = result.visitorId;

  // persist in localStorage for stability across refresh
  if (typeof window !== "undefined") {
    localStorage.setItem("visitorId", cachedId);
  }

  return cachedId;
}

// On first load, hydrate from localStorage
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("visitorId");
  if (stored) cachedId = stored;
}
