'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computeZones, type Zone, type Volunteer } from './zone-utils';

// Fix Leaflet default icon path issues in dynamic exports
const fixLeafletIcons = () => {
  // @ts-expect-error - Deleting private property for icon path fix
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

type CoverageMapProps = {
  volunteers?: Volunteer[];
};

// Fully-static class strings so Tailwind's scanner can see and keep them.
const ZONE_STYLES = {
  active: {
    dot: 'bg-emerald-500',
    ping: 'bg-emerald-500/30',
    hex: '#10b981',
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    label: 'Ready',
  },
  busy: {
    dot: 'bg-yellow-500',
    ping: 'bg-yellow-500/30',
    hex: '#eab308',
    badge: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20',
    label: 'Busy',
  },
} as const;

export default function CoverageMap({ volunteers }: CoverageMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());

  const [mapReady, setMapReady] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Compute zones from volunteer data
  const { zones, totalActive } = useMemo(() => computeZones(volunteers), [volunteers]);

  // Init the map exactly once on mount
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    fixLeafletIcons();

    const map = L.map(mapContainer.current, {
      center: [27.61, 83.51],
      zoom: 10,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }
    ).addTo(map);

    setMapReady(true);

    return () => {
      const markers = markersRef.current;
      const polygons = polygonsRef.current;
      markers.forEach(marker => marker.remove());
      polygons.forEach(polygon => polygon.remove());
      markers.clear();
      polygons.clear();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Redraw zone layers whenever zone data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Clear existing markers and polygons
    markersRef.current.forEach(marker => marker.remove());
    polygonsRef.current.forEach(polygon => polygon.remove());
    markersRef.current.clear();
    polygonsRef.current.clear();

    zones.forEach((zone) => {
      const style = ZONE_STYLES[zone.status];

      // Create polygon but don't add it to map yet
      const polygon = L.polygon(zone.polygon, {
        color: style.hex,
        fillColor: style.hex,
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '6, 6',
      });
      polygonsRef.current.set(zone.name, polygon);

      // Create marker with pulsing animation
      const pulseHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-6 h-6 rounded-full ${style.ping} animate-ping"></div>
          <div class="w-3.5 h-3.5 rounded-full ${style.dot} border-2 border-white shadow"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pulseHtml,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const popupContent = `
        <div class="p-3 bg-slate-dark text-white rounded-xl font-manrope min-w-[200px]">
          <h4 class="text-base font-bold text-primary font-poppins border-b border-white/10 pb-1 mb-2">${zone.name}</h4>
          <p class="text-xs text-gray-300 mb-1"><strong>Active Rescuers:</strong> ${zone.responders} Available</p>
          <p class="text-xs text-gray-300 mb-2"><strong>Coverage:</strong> Full Municipality</p>
          <div class="flex items-center gap-1.5 mt-1.5">
            <span class="inline-block w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse"></span>
            <span class="text-xs font-semibold text-gray-200 uppercase">${zone.status === 'active' ? 'High Availability' : 'Limited Coverage'}</span>
          </div>
        </div>
      `;

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
      marker.on('click', () => {
        // Hide all polygons first
        polygonsRef.current.forEach(p => p.remove());
        
        // Show only the clicked zone's polygon
        polygon.addTo(map);
        
        setSelectedZone(zone);
        map.setView([zone.lat, zone.lng], 12);
      });
      
      markersRef.current.set(zone.name, marker);
    });

    // Show polygon for selected zone if it exists
    if (selectedZone) {
      const polygon = polygonsRef.current.get(selectedZone.name);
      if (polygon && !map.hasLayer(polygon)) {
        polygon.addTo(map);
      }
    }
  }, [zones, mapReady, selectedZone]);

  return (
    <div className="flex w-full flex-col items-stretch gap-6 font-manrope lg:flex-row">
      {/* Map Pane */}
      <div className="relative z-10 min-h-[420px] flex-grow overflow-hidden rounded-2xl border border-white/10 shadow-2xl lg:min-h-[520px]">
        <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

        {!mapReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900">
            <div className="flex items-center gap-2.5 text-sm text-gray-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Loading coverage map…
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/80 px-3.5 py-2 text-[11px] font-semibold text-gray-300 backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-yellow-500" /> Busy
          </span>
        </div>
      </div>

      {/* Info Sidebar Pane */}
      <div className="flex flex-col gap-4 lg:w-80">
        <div className="glass flex-grow space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">
          <h3 className="border-b border-white/10 pb-2 font-poppins text-lg font-bold text-white">
            Coverage Municipalities
          </h3>
          <p className="text-sm text-gray-400">
            Click any pulsing zone marker on the map to inspect nearby rescuer density and dispatch status.
          </p>

          <div className="space-y-2.5 pt-1">
            {zones.map((z) => {
              const style = ZONE_STYLES[z.status];
              const isSelected = selectedZone?.name === z.name;
              return (
                <button
                  key={z.name}
                  onClick={() => {
                    // Hide all polygons first
                    polygonsRef.current.forEach(p => p.remove());
                    
                    // Show only the clicked zone's polygon
                    const polygon = polygonsRef.current.get(z.name);
                    if (polygon && mapRef.current) {
                      polygon.addTo(mapRef.current);
                    }
                    
                    setSelectedZone(z);
                    mapRef.current?.setView([z.lat, z.lng], 12);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary/40 bg-primary/10 text-white'
                      : 'border-white/5 bg-white/[0.03] text-gray-300 hover:border-white/15 hover:bg-white/[0.06]'
                  }`}
                >
                  <div>
                    <h4 className="font-poppins text-sm font-semibold">
                      {z.name} <span className="text-gray-500">({z.nameNe})</span>
                    </h4>
                    <p className="font-manrope text-xs text-gray-400">
                      {z.responders} rescuer{z.responders === 1 ? '' : 's'} · Full Municipal Coverage
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                    {style.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Quick Stats Card */}
        <div className="glass flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 p-5">
          <div>
            <span className="block text-xs font-medium text-gray-400">Ready Responders</span>
            <span className="block font-mono text-2xl font-black text-primary">{totalActive} Online</span>
          </div>
          <div className="text-right">
            <span className="block text-xs font-medium text-gray-400">Avg Dispatch Time</span>
            <span className="block text-lg font-bold text-white">18 Mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
