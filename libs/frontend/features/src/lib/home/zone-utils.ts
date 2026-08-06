export type Zone = {
  name: string;
  nameNe: string;
  lat: number;
  lng: number;
  polygon: [number, number][];
  status: "active" | "busy";
  responders: number;
};

export type Volunteer = {
  id: string;
  municipality?: string | null;
  assignedZone?: string | null;
  isAvailableNow?: boolean;
};

export const INITIAL_ZONES: Zone[] = [
  {
    name: "Butwal",
    nameNe: "बुटवल",
    lat: 27.7006,
    lng: 83.4532,
    polygon: [
      [27.732, 83.415],
      [27.745, 83.468],
      [27.712, 83.485],
      [27.675, 83.48],
      [27.67, 83.422],
    ],
    status: "busy",
    responders: 0,
  },
  {
    name: "Tilottama",
    nameNe: "तिलोत्तमा",
    lat: 27.6623,
    lng: 83.5232,
    polygon: [
      [27.675, 83.48],
      [27.665, 83.515],
      [27.58, 83.51],
      [27.565, 83.45],
      [27.575, 83.425],
      [27.67, 83.422],
    ],
    status: "busy",
    responders: 0,
  },
  {
    name: "Siddharthanagar",
    nameNe: "सिद्धार्थनगर",
    lat: 27.5038,
    lng: 83.454,
    polygon: [
      [27.565, 83.45],
      [27.55, 83.49],
      [27.495, 83.485],
      [27.485, 83.445],
      [27.5, 83.42],
      [27.575, 83.425],
    ],
    status: "busy",
    responders: 0,
  },
  {
    name: "Devdaha",
    nameNe: "देवदहा",
    lat: 27.606,
    lng: 83.576,
    polygon: [
      [27.712, 83.485],
      [27.725, 83.61],
      [27.65, 83.63],
      [27.58, 83.56],
      [27.58, 83.51],
      [27.665, 83.515],
    ],
    status: "busy",
    responders: 0,
  },
  {
    name: "Sainamaina",
    nameNe: "सैनामैना",
    lat: 27.678,
    lng: 83.345,
    polygon: [
      [27.71, 83.29],
      [27.732, 83.415],
      [27.67, 83.422],
      [27.655, 83.39],
      [27.64, 83.295],
    ],
    status: "busy",
    responders: 0,
  },
];

function parseAssignedZones(assignedZone: string | null | undefined): string[] {
  if (!assignedZone) return [];
  return assignedZone
    .split(/[,;|]/)
    .map((zone) => zone.trim())
    .filter(Boolean);
}

export function computeZones(volunteers?: Volunteer[]) {
  if (!volunteers || volunteers.length === 0) {
    return { zones: INITIAL_ZONES, totalActive: 0 };
  }

  const uniqueActiveIds = new Set<string>();
  const zones = INITIAL_ZONES.map((zone) => {
    const zVols = volunteers.filter((v) => {
      const assignedZones = parseAssignedZones(v.assignedZone);
      return v.municipality === zone.name || assignedZones.includes(zone.name);
    });

    const uniqueZoneVols = Array.from(
      new Map(zVols.map((v) => [v.id, v])).values()
    );

    const activeVols = uniqueZoneVols.filter((v) => {
      if (v.isAvailableNow) {
        uniqueActiveIds.add(v.id);
        return true;
      }
      return false;
    });

    return {
      ...zone,
      responders: uniqueZoneVols.length,
      status: activeVols.length > 0 ? "active" : "busy",
    } as Zone;
  });

  return { zones, totalActive: uniqueActiveIds.size };
}
