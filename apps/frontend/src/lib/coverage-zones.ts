export type ZoneStatus = "ready" | "busy";

export type CoverageZone = {
  id: string;
  name: string;
  nepali: string;
  coverage: string;
  status: ZoneStatus;
  center: [number, number];
  polygon: [number, number][];
  rescuers: number;
  openCalls: number;
  avgResponse: string;
};

/** Rupandehi district municipalities served by SnakeSOS. */
export const coverageZones: CoverageZone[] = [
  {
    id: "butwal",
    name: "Butwal",
    nepali: "बुटवल",
    coverage: "Full Municipal Coverage",
    status: "ready",
    center: [27.7005, 83.4486],
    polygon: [
      [27.745, 83.395],
      [27.752, 83.492],
      [27.688, 83.512],
      [27.652, 83.44],
      [27.681, 83.383],
    ],
    rescuers: 6,
    openCalls: 1,
    avgResponse: "14 min",
  },
  {
    id: "tilottama",
    name: "Tilottama",
    nepali: "तिलोत्तमा",
    coverage: "Full Municipal Coverage",
    status: "ready",
    center: [27.6415, 83.4515],
    polygon: [
      [27.681, 83.383],
      [27.652, 83.44],
      [27.61, 83.495],
      [27.575, 83.44],
      [27.606, 83.374],
    ],
    rescuers: 4,
    openCalls: 0,
    avgResponse: "17 min",
  },
  {
    id: "siddharthanagar",
    name: "Siddharthanagar",
    nepali: "सिद्धार्थनगर",
    coverage: "Full Municipal Coverage",
    status: "busy",
    center: [27.505, 83.4498],
    polygon: [
      [27.552, 83.4],
      [27.556, 83.5],
      [27.47, 83.505],
      [27.462, 83.404],
    ],
    rescuers: 3,
    openCalls: 3,
    avgResponse: "22 min",
  },
  {
    id: "devdaha",
    name: "Devdaha",
    nepali: "देवदह",
    coverage: "Full Municipal Coverage",
    status: "busy",
    center: [27.6605, 83.5825],
    polygon: [
      [27.71, 83.53],
      [27.716, 83.64],
      [27.62, 83.648],
      [27.607, 83.535],
    ],
    rescuers: 2,
    openCalls: 2,
    avgResponse: "26 min",
  },
  {
    id: "sainamaina",
    name: "Sainamaina",
    nepali: "सैनामैना",
    coverage: "Full Municipal Coverage",
    status: "busy",
    center: [27.6905, 83.3255],
    polygon: [
      [27.735, 83.27],
      [27.74, 83.378],
      [27.648, 83.385],
      [27.641, 83.272],
    ],
    rescuers: 2,
    openCalls: 2,
    avgResponse: "24 min",
  },
];

export const coverageSummary = {
  readyResponders: coverageZones
    .filter((z) => z.status === "ready")
    .reduce((n, z) => n + z.rescuers, 0),
  avgDispatch: "18 Mins",
};
