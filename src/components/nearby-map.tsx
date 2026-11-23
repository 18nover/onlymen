/**
 * Nearby map (MapLibre GL JS + OpenFreeMap tiles: free, no API key) in the
 * OnlyMen "noir gold" style. Loaded only on the client.
 *
 * Privacy: the viewer's own position is shown ONLY as a soft ~600 m gold
 * circle around their snapped, rounded cell centre — never a dot. Member pins
 * come from the server already jittered and only for members who opted in
 * (share-pin on, not incognito / offline / distance-hidden / in their home
 * zone). This component never sees an exact location.
 */
import { useEffect, useRef } from "react";
import type { Pin } from "@/lib/nearby/repo.server";

export const MAP_STYLE = "/map/noir-gold-v2.json";

export type MapPin = Pin & { online?: boolean; live?: boolean; photoUrl?: string | null; demo?: boolean };

function circle(lng: number, lat: number, m: number, n = 64) {
  const mLat = 111320;
  const mLng = 111320 * Math.cos((lat * Math.PI) / 180);
  const ring: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    ring.push([lng + (m * Math.sin(a)) / mLng, lat + (m * Math.cos(a)) / mLat]);
  }
  return { type: "Polygon" as const, coordinates: [ring] };
}

export function NearbyMap({ center, pins, onOpen }: { center: { lat: number; lng: number }; pins: MapPin[]; onOpen: (username: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpen);
  openRef.current = onOpen;
  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let dead = false;
    void (async () => {
      if (import.meta.env.SSR) return; // keep maplibre out of the Worker bundle
      const [{ default: maplibregl }] = await Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]);
      if (dead || !el.current) return;
      const m = new maplibregl.Map({
        container: el.current, style: MAP_STYLE, center: [center.lng, center.lat], zoom: 13.4, minZoom: 9, maxZoom: 14,
        attributionControl: false, dragRotate: false,
        // dev only: lets local headless captures read the WebGL canvas
        ...(import.meta.env.DEV ? { canvasContextAttributes: { preserveDrawingBuffer: true } } : {}), pitchWithRotate: false, touchPitch: false,
      });
      m.setPadding({ top: 84, bottom: 96, left: 0, right: 0 });
      m.touchZoomRotate.disableRotation();
      (window as unknown as { __OM_MAP?: unknown }).__OM_MAP = m; // lets local captures wait for tiles
      m.on("load", () => {
        m.addSource("me-area", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [
            { type: "Feature", properties: { kind: "halo" }, geometry: circle(center.lng, center.lat, 900) },
            { type: "Feature", properties: { kind: "core" }, geometry: circle(center.lng, center.lat, 600) },
          ] },
        });
        m.addLayer({ id: "me-halo", type: "fill", source: "me-area", filter: ["==", ["get", "kind"], "halo"], paint: { "fill-color": "#d4af37", "fill-opacity": 0.025 } });
        m.addLayer({ id: "me-core", type: "fill", source: "me-area", filter: ["==", ["get", "kind"], "core"], paint: { "fill-color": "#d4af37", "fill-opacity": 0.055 } });
        m.addLayer({ id: "me-ring-soft", type: "line", source: "me-area", filter: ["==", ["get", "kind"], "core"], paint: { "line-color": "#d4af37", "line-width": 6, "line-opacity": 0.16, "line-blur": 4 } });
        m.addLayer({ id: "me-ring", type: "line", source: "me-area", filter: ["==", ["get", "kind"], "core"], paint: { "line-color": "#e8d5a3", "line-width": 1.6, "line-opacity": 0.7 } });
      });
      for (const p of pins) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `om-pin${p.live ? " is-live" : ""}`;
        b.setAttribute("aria-label", `${p.demo ? "Demo profile: " : ""}${p.displayName}${p.online ? ", online" : ""}. Open profile`);
        const src = p.photoUrl ?? (p.photoId ? `/api/photo/${encodeURIComponent(p.photoId)}` : null);
        if (src) {
          const img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          b.appendChild(img);
        } else {
          const s = document.createElement("span");
          s.className = "om-pin-initial";
          s.textContent = p.displayName.slice(0, 1).toUpperCase();
          b.appendChild(s);
        }
        if (p.online) {
          const d = document.createElement("span");
          d.className = "om-pin-dot";
          b.appendChild(d);
        }
        b.addEventListener("click", () => openRef.current(p.username));
        new maplibregl.Marker({ element: b, anchor: "center" }).setLngLat([p.lng, p.lat]).addTo(m);
      }
      map = m;
    })();
    return () => {
      dead = true;
      map?.remove();
    };
  }, [center.lat, center.lng, pins]);
  return (
    <>
      <div className="om-map" role="region" aria-label="Map of members near your area">
        <div ref={el} style={{ width: "100%", height: "100%" }} />
      </div>
      <p className="om-map-attrib">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · <a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a>
      </p>
    </>
  );
}
