export type Urgency = "critical" | "high" | "routine";
export type RescueStatus = "new" | "assigned" | "en-route" | "on-site" | "released" | "closed";

export type Rescue = {
  id: string;
  code: string;
  species: string;
  venomous: boolean;
  location: string;
  district: string;
  reportedBy: string;
  phone: string;
  urgency: Urgency;
  status: RescueStatus;
  reportedAt: string;
  responder: string | null;
  notes: string;
  coords: { x: number; y: number };
};

export const rescues: Rescue[] = [
  {
    id: "r1",
    code: "SR-2418",
    species: "Spectacled Cobra",
    venomous: true,
    location: "Kalimati Vegetable Market, storage shed",
    district: "Kathmandu",
    reportedBy: "Sunita Maharjan",
    phone: "+977 98•• ••4412",
    urgency: "critical",
    status: "en-route",
    reportedAt: "12 min ago",
    responder: "Bikash Thapa",
    notes: "Snake coiled behind crates. Crowd gathered, area being cleared.",
    coords: { x: 28, y: 42 },
  },
  {
    id: "r2",
    code: "SR-2417",
    species: "Common Krait",
    venomous: true,
    location: "Residential bedroom, ground floor",
    district: "Lalitpur",
    reportedBy: "Ramesh Shrestha",
    phone: "+977 98•• ••1180",
    urgency: "critical",
    status: "on-site",
    reportedAt: "41 min ago",
    responder: "Anjali Rai",
    notes: "Family relocated to neighbour's house. Hook and tube ready.",
    coords: { x: 46, y: 61 },
  },
  {
    id: "r3",
    code: "SR-2416",
    species: "Rat Snake (non-venomous)",
    venomous: false,
    location: "Poultry farm, feed room",
    district: "Chitwan",
    reportedBy: "Krishna Gurung",
    phone: "+977 98•• ••7729",
    urgency: "routine",
    status: "assigned",
    reportedAt: "1 hr ago",
    responder: "Dipesh Lama",
    notes: "Likely hunting rodents. Owner asked for relocation, not harm.",
    coords: { x: 62, y: 30 },
  },
  {
    id: "r4",
    code: "SR-2415",
    species: "Russell's Viper",
    venomous: true,
    location: "Schoolyard hedge near gate 2",
    district: "Bharatpur",
    reportedBy: "Meera Adhikari",
    phone: "+977 98•• ••3055",
    urgency: "high",
    status: "new",
    reportedAt: "1 hr 20 min ago",
    responder: null,
    notes: "Students kept indoors. Needs responder within 30 minutes.",
    coords: { x: 71, y: 55 },
  },
  {
    id: "r5",
    code: "SR-2412",
    species: "Checkered Keelback",
    venomous: false,
    location: "Irrigation canal beside paddy field",
    district: "Pokhara",
    reportedBy: "Hari Baral",
    phone: "+977 98•• ••9901",
    urgency: "routine",
    status: "released",
    reportedAt: "4 hrs ago",
    responder: "Sabina Tamang",
    notes: "Released into Begnas wetland buffer. Health good.",
    coords: { x: 18, y: 68 },
  },
  {
    id: "r6",
    code: "SR-2409",
    species: "Monocled Cobra",
    venomous: true,
    location: "Temple courtyard drain",
    district: "Janakpur",
    reportedBy: "Prakash Yadav",
    phone: "+977 98•• ••2287",
    urgency: "high",
    status: "closed",
    reportedAt: "Yesterday",
    responder: "Bikash Thapa",
    notes: "Relocated 9 km away. Community briefing delivered on site.",
    coords: { x: 84, y: 44 },
  },
];

export type Volunteer = {
  id: string;
  name: string;
  district: string;
  tier: "Lead handler" | "Certified handler" | "Trainee" | "Transport";
  status: "available" | "on-call" | "on-rescue" | "off-duty";
  rescues: number;
  rating: number;
  since: string;
  skills: string[];
  initials: string;
};

export const volunteers: Volunteer[] = [
  {
    id: "v1",
    name: "Bikash Thapa",
    district: "Kathmandu",
    tier: "Lead handler",
    status: "on-rescue",
    rescues: 412,
    rating: 4.9,
    since: "2019",
    skills: ["Venomous handling", "Night ops", "Trainer"],
    initials: "BT",
  },
  {
    id: "v2",
    name: "Anjali Rai",
    district: "Lalitpur",
    tier: "Lead handler",
    status: "on-rescue",
    rescues: 288,
    rating: 4.8,
    since: "2020",
    skills: ["Venomous handling", "First aid", "Community talks"],
    initials: "AR",
  },
  {
    id: "v3",
    name: "Sabina Tamang",
    district: "Pokhara",
    tier: "Certified handler",
    status: "available",
    rescues: 164,
    rating: 4.7,
    since: "2021",
    skills: ["Wetland release", "Photography"],
    initials: "ST",
  },
  {
    id: "v4",
    name: "Dipesh Lama",
    district: "Chitwan",
    tier: "Certified handler",
    status: "on-call",
    rescues: 121,
    rating: 4.6,
    since: "2022",
    skills: ["Farm rescues", "Transport"],
    initials: "DL",
  },
  {
    id: "v5",
    name: "Nisha Poudel",
    district: "Bharatpur",
    tier: "Trainee",
    status: "available",
    rescues: 23,
    rating: 4.4,
    since: "2025",
    skills: ["Non-venomous handling", "Data logging"],
    initials: "NP",
  },
  {
    id: "v6",
    name: "Prabin Sah",
    district: "Janakpur",
    tier: "Transport",
    status: "off-duty",
    rescues: 58,
    rating: 4.5,
    since: "2023",
    skills: ["Vehicle", "Release logistics"],
    initials: "PS",
  },
];

export type Species = {
  id: string;
  name: string;
  scientific: string;
  venom: "Highly venomous" | "Mildly venomous" | "Non-venomous";
  confidence: number;
  traits: string[];
  habitat: string;
  firstAid: string;
};

export const speciesLibrary: Species[] = [
  {
    id: "s1",
    name: "Spectacled Cobra",
    scientific: "Naja naja",
    venom: "Highly venomous",
    confidence: 94,
    traits: ["Hood with spectacle mark", "Smooth scales", "Raises front third"],
    habitat: "Farmland, village outskirts, granaries",
    firstAid: "Immobilise limb, no tourniquet, reach antivenom centre immediately.",
  },
  {
    id: "s2",
    name: "Common Krait",
    scientific: "Bungarus caeruleus",
    venom: "Highly venomous",
    confidence: 88,
    traits: ["Glossy black with white bands", "Hexagonal vertebral scales", "Nocturnal"],
    habitat: "Inside homes at night, rubble piles",
    firstAid: "Bites often painless — monitor for drooping eyelids, seek hospital at once.",
  },
  {
    id: "s3",
    name: "Russell's Viper",
    scientific: "Daboia russelii",
    venom: "Highly venomous",
    confidence: 91,
    traits: ["Chain of dark ovals", "Loud hiss", "Triangular head"],
    habitat: "Grassland, paddy edges, scrub",
    firstAid: "Keep victim still and calm, transport lying down, antivenom urgent.",
  },
  {
    id: "s4",
    name: "Rat Snake",
    scientific: "Ptyas mucosa",
    venom: "Non-venomous",
    confidence: 96,
    traits: ["Long slender body", "Large eyes", "Fast mover"],
    habitat: "Barns, fields, roof spaces",
    firstAid: "Harmless to humans. Clean any bite wound and relocate the snake safely.",
  },
  {
    id: "s5",
    name: "Checkered Keelback",
    scientific: "Fowlea piscator",
    venom: "Non-venomous",
    confidence: 93,
    traits: ["Checkerboard pattern", "Keeled scales", "Strong swimmer"],
    habitat: "Ponds, canals, wetlands",
    firstAid: "Harmless. Wash wound with soap and water.",
  },
];

export const idHistory = [
  { id: "h1", file: "cobra_kalimati.jpg", result: "Spectacled Cobra", confidence: 94, time: "10 min ago" },
  { id: "h2", file: "bedroom_night.jpg", result: "Common Krait", confidence: 88, time: "38 min ago" },
  { id: "h3", file: "farm_shed.jpg", result: "Rat Snake", confidence: 96, time: "1 hr ago" },
  { id: "h4", file: "canal_edge.jpg", result: "Checkered Keelback", confidence: 93, time: "3 hrs ago" },
];

export const stats = [
  { label: "Active rescues", value: "4", delta: "2 critical" },
  { label: "Responders on duty", value: "11", delta: "3 districts" },
  { label: "Avg. response time", value: "24 min", delta: "-6 min this month" },
  { label: "Snakes released", value: "2,847", delta: "since 2019" },
];

export const trainings = [
  { id: "t1", title: "Venomous handling refresher", date: "Aug 12", seats: "6 of 20 left", place: "Kathmandu HQ" },
  { id: "t2", title: "Snakebite first aid for schools", date: "Aug 19", seats: "Open", place: "Bharatpur" },
  { id: "t3", title: "Night rescue safety drill", date: "Aug 27", seats: "4 of 12 left", place: "Chitwan" },
];

export const communityPosts = [
  {
    id: "c1",
    author: "Anjali Rai",
    role: "Lead handler",
    time: "2 hrs ago",
    body: "Krait season is here. Please sleep on raised beds with tucked mosquito nets — most night bites we attend happen on floor bedding.",
    likes: 214,
    replies: 31,
    tag: "Safety",
  },
  {
    id: "c2",
    author: "Sabina Tamang",
    role: "Certified handler",
    time: "6 hrs ago",
    body: "Released the Begnas keelback this morning. Wetland buffer is recovering nicely — third release site we've been able to reuse this year.",
    likes: 168,
    replies: 12,
    tag: "Release log",
  },
  {
    id: "c3",
    author: "Dr. Kamal Basnet",
    role: "Toxinology advisor",
    time: "Yesterday",
    body: "Reminder: no cutting, no sucking, no tight tourniquets. Splint the limb and move the patient to an antivenom centre.",
    likes: 402,
    replies: 47,
    tag: "Medical",
  },
];

export const donationTiers = [
  {
    id: "d1",
    name: "Field kit",
    amount: "NPR 1,500",
    blurb: "Hooks, tongs and gloves for one responder for a season.",
    highlight: false,
  },
  {
    id: "d2",
    name: "Rescue run",
    amount: "NPR 5,000",
    blurb: "Fuel and transport for ten rescue call-outs, including release travel.",
    highlight: true,
  },
  {
    id: "d3",
    name: "Antivenom vial",
    amount: "NPR 12,000",
    blurb: "One vial stocked at a partner rural health post.",
    highlight: false,
  },
];

export const impact = [
  { label: "Funds raised this quarter", value: "NPR 18.4L" },
  { label: "Villages covered", value: "126" },
  { label: "School sessions run", value: "89" },
  { label: "Bite fatalities prevented*", value: "31" },
];
