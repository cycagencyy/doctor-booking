export function requireFields(body, fields) {
  const missing = fields.filter(f => !body || !String(body[f] || "").trim());
  if (missing.length) {
    const err = new Error("Missing fields: " + missing.join(", "));
    err.status = 400;
    throw err;
  }
}

export function isValidPhone(p) {
  return /^[0-9+\s()-]{7,}$/.test(String(p || ""));
}

export function isValidISODate(d) {
  // accepts YYYY-MM-DD or ISO date string
  return /^\d{4}-\d{2}-\d{2}/.test(String(d || ""));
}

export function isValidTime(t) {
  // HH:MM 24h
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ""));
}



