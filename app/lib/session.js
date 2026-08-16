export const SESSION_COOKIE = "archi_session";

const encoder = new TextEncoder();

const toBase64Url = (bytes) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const secretMaterial = () => {
  const username = process.env.DASHBOARD_USERNAME;
  const password = process.env.DASHBOARD_PASSWORD;
  if (!username || !password) return null;
  return `${username}:${password}`;
};

const sign = async (payload) => {
  const material = secretMaterial();
  if (!material) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(material),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
};

export const SESSION_MAX_AGE = 60 * 60 * 12;

export async function createSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expiresAt);
  const signature = await sign(payload);
  if (!signature) return null;
  return `${payload}.${signature}`;
}

export async function isValidSessionToken(token) {
  if (!token || typeof token !== "string") return false;

  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = await sign(payload);
  if (!expected || expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
