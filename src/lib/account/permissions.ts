import type { PermissionKey, PermissionState } from "./types.ts";

/**
 * Trigger the real browser prompt for one capability and report the outcome.
 * Never throws; a denial is just a state. Call ONLY after the in-app explainer.
 */
export async function requestPermission(key: PermissionKey): Promise<PermissionState> {
  try {
    if (key === "location") {
      if (!("geolocation" in navigator)) return "unsupported";
      return await new Promise<PermissionState>((resolve) =>
        navigator.geolocation.getCurrentPosition(
          () => resolve("granted"),
          (err) => resolve(err.code === err.PERMISSION_DENIED ? "denied" : "granted"),
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 },
        ),
      );
    }
    if (key === "notifications") {
      if (typeof Notification === "undefined") return "unsupported";
      const r = await Notification.requestPermission();
      return r === "granted" ? "granted" : r === "denied" ? "denied" : "skipped";
    }
    if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
    const stream = await navigator.mediaDevices.getUserMedia(key === "camera" ? { video: true } : { audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return "granted";
  } catch (e) {
    const name = (e as DOMException)?.name;
    if (name === "NotFoundError" || name === "OverconstrainedError") return "unsupported";
    return "denied";
  }
}
