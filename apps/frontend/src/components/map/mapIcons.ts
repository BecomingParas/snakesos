import L from 'leaflet';

export function createUserLocationIcon() {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-location-dot"></div>
      <div class="user-location-pulse"></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export function createRescueIcon(color: string, selected: boolean) {
  const size = selected ? 40 : 34;

  return L.divIcon({
    className: 'rescue-marker',
    html: `
      <div
        class="rescue-marker-icon"
        style="
          background: ${color};
          width: ${size}px;
          height: ${size}px;
          border-width: ${selected ? 4 : 3}px;
          font-size: ${selected ? 20 : 18}px;
        "
      >
        🐍
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function createRescuerIcon(color: string) {
  return L.divIcon({
    className: 'rescuer-marker',
    html: `
      <div
        class="rescuer-marker-icon"
        style="background: ${color}"
      >
        🚑
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export function createHospitalIcon(color: string) {
  return L.divIcon({
    className: 'hospital-marker',
    html: `
      <div
        class="hospital-marker-icon"
        style="background: ${color}"
      >
        🏥
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}
