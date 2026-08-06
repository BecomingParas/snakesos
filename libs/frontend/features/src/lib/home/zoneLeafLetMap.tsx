import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Zone } from "./zone-utils";

const fixLeafletIcons = () => {
  // @ts-expect-error private leaflet internal
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

type Props = {
  zones: Zone[];
  focused: Zone | null;
  onSelect: (zone: Zone) => void;
};

export default function ZoneLeafletMap({ zones, focused, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    fixLeafletIcons();

    const map = L.map(containerRef.current, {
      center: [27.61, 83.51],
      zoom: 10,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        maxZoom: 18,
      },
    ).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw / redraw zone layers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layers: L.Layer[] = [];

    zones.forEach((zone) => {
      const active = zone.status === "active";
      const color = active ? "#2ECC71" : "#F1C40F";

      layers.push(
        L.polygon(zone.polygon, {
          color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "6, 6",
        }).addTo(map),
      );

      const icon = L.divIcon({
        html: `<span class="zone-pin ${active ? "zone-pin--active" : "zone-pin--busy"}"><span class="zone-pin__pulse"></span><span class="zone-pin__dot"></span></span>`,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon }).addTo(map);
      layers.push(marker);

      marker.bindPopup(
        `<div class="zone-popup">
          <p class="zone-popup__title">${zone.name} (${zone.nameNe})</p>
          <p class="zone-popup__row">Active Rescuers: <strong>${zone.responders}</strong> Available</p>
          <p class="zone-popup__row">Coverage: Full Municipality</p>
          <p class="zone-popup__status ${active ? "is-active" : "is-busy"}">${
            active ? "High Availability" : "Limited Coverage"
          }</p>
        </div>`,
        { className: "custom-leaflet-popup" },
      );

      marker.on("click", () => selectRef.current(zone));
    });

    return () => {
      layers.forEach((layer) => layer.remove());
    };
  }, [zones]);

  // Fly to the focused zone
  useEffect(() => {
    if (!focused || !mapRef.current) return;
    mapRef.current.setView([focused.lat, focused.lng], 12);
  }, [focused]);

  return <div ref={containerRef} className="h-full w-full" />;
}