/**
 * Fire-and-forget sign-up notification (server-only).
 *
 * Off unless both ONLYMEN_WEBHOOK_URL and ONLYMEN_WEBHOOK_KEY are set. Sends only
 * non-personal data: event, public username, role, timestamp. Never awaited by
 * the caller; failures and slowness are swallowed (1.5 s timeout).
 */
export function notifySignup(username: string, type: "member" | "creator"): void {
  const url = process.env.ONLYMEN_WEBHOOK_URL?.trim();
  const key = process.env.ONLYMEN_WEBHOOK_KEY?.trim();
  if (!url || !key || !/^https:\/\//.test(url)) return;
  const body = JSON.stringify({ event: "signup", username, role: type === "creator" ? "creator" : "fan", at: new Date().toISOString() });
  try {
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body,
      signal: AbortSignal.timeout(1500),
    }).catch(() => {});
  } catch {
    /* never break sign-up */
  }
}
