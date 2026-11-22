/**
 * Opt-in map (MapLibre GL JS + OpenFreeMap, both free, no API key). Loaded
 * only when the member opens the map. Pins are already jittered server-side;
 * this component never sees an exact location.
 */
import { useEffect, useRef } from "react";
import type { Pin } from "@/lib/nearby/repo.server";

export const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function NearbyMap({ center, pins, onPick }: { center: { lat: number; lng: number }; pins: Pin[]; onPick: (username: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let dead = false;
    void (async () => {
      if (import.meta.env.SSR) return; // keep maplibre out of the Worker bundle
      const [{ default: maplibregl }] = await Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]);
      if (dead || !el.current) return;
      const m = new maplibregl.Map({ container: el.current, style: MAP_STYLE, center: [center.lng, center.lat], zoom: 11, maxZoom: 14, attributionControl: { compact: false } });
      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      for (const p of pins) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "size-9 overflow-hidden rounded-full border-2 border-gold bg-surface shadow-lg";
        dot.setAttribute("aria-label", p.displayName);
        if (p.photoId) {
          const img = document.createElement("img");
          img.src = `/api/photo/${encodeURIComponent(p.photoId)}`;
          img.alt = "";
          img.className = "size-full object-cover";
          dot.appendChild(img);
        } else dot.textContent = p.displayName.slice(0, 1).toUpperCase();
        dot.addEventListener("click", () => onPick(p.username));
        new maplibregl.Marker({ element: dot }).setLngLat([p.lng, p.lat]).addTo(m);
      }
      map = m;
    })();
    return () => {
      dead = true;
      map?.remove();
    };
  }, [center.lat, center.lng, pins, onPick]);
  return (
    <div className="grid gap-2">
      <div ref={el} className="h-[60vh] min-h-80 w-full overflow-hidden rounded-2xl border border-line" />
      <p className="text-xs text-dim">Pins are approximate (moved randomly up to about a kilometre, a new spot each day). People inside their home zone never get a pin. Map data © OpenStreetMap contributors, tiles by OpenFreeMap.</p>
    </div>
  );
}
