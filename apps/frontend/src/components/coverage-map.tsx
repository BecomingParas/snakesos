import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";

import { coverageZones, type CoverageZone } from "@/lib/coverage-zones";

const READY = "#34d399";
const BUSY = "#f0b429";

function zoneIcon(zone: CoverageZone) {
  return L.divIcon({
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<span class="block h-4 w-4 rounded-full border-2 border-background shadow-lg animate-pulse" style="background:${
      zone.status === "ready" ? READY : BUSY
    }"></span>`,
  });
}

function FitZones() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(coverageZones.flatMap((z) => z.polygon));
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(bounds.pad(0.15), { animate: false });
    };
    fit();
    const t = window.setTimeout(fit, 300);
    return () => window.clearTimeout(t);
  }, [map]);
  return null;
}


export default function CoverageMap({
  selected,
  onSelect,
}: {
  selected?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[27.62, 83.46]}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <TileLayer
        attribution='Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <FitZones />
      {coverageZones.map((zone) => {
        const active = selected === zone.id;
        const color = zone.status === "ready" ? READY : BUSY;
        return (
          <Polygon
            key={zone.id}
            positions={zone.polygon}
            eventHandlers={{ click: () => onSelect?.(zone.id) }}
            pathOptions={{
              color,
              weight: active ? 3 : 2,
              dashArray: active ? undefined : "6 6",
              fillColor: color,
              fillOpacity: active ? 0.28 : 0.1,
            }}
          />
        );
      })}
      {coverageZones.map((zone) => (
        <Marker
          key={zone.id}
          position={zone.center}
          icon={zoneIcon(zone)}
          eventHandlers={{ click: () => onSelect?.(zone.id) }}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            {zone.name} · {zone.rescuers} rescuers · {zone.openCalls} open
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
