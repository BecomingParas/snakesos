'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletLocationMapProps {
  lat: number;
  lng: number;
  address?: string;
  className?: string;
}

/**
 * Simple Leaflet map component for displaying a single location marker
 * Uses OpenStreetMap tiles (free, no API key required)
 */
export function LeafletLocationMap({ lat, lng, address, className = 'h-48' }: LeafletLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker at the location
    const marker = L.marker([lat, lng]).addTo(map);
    
    if (address) {
      marker.bindPopup(address);
    }

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, address]);

  // Update marker position if coordinates change
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setView([lat, lng], 15);
    
    // Clear existing markers and add new one
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    const marker = L.marker([lat, lng]).addTo(mapRef.current);
    if (address) {
      marker.bindPopup(address);
    }
  }, [lat, lng, address]);

  return (
    <div 
      ref={containerRef} 
      className={`${className} rounded-lg overflow-hidden border border-border`}
    />
  );
}
