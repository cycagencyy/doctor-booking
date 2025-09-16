const BUCKET = new Map();
// very simple token bucket per IP in memory (per function instance)
export function rateLimit(ip, { tokens = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const key = ip || "unknown";
  let b = BUCKET.get(key);
  if (!b || b.reset < now) {
    b = { remaining: tokens, reset: now + windowMs };
  }
  if (b.remaining <= 0) {
    const err = new Error("Too many requests, please try again shortly.");
    err.status = 429;
    throw err;
  }
  b.remaining -= 1;
  BUCKET.set(key, b);
  return b;
}



