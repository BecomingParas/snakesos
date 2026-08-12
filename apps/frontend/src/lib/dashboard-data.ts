export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "ORGANIZATION"
  | "RESCUER"
  | "VOLUNTEER"
  | "CITIZEN";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
export type RequestStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type Row = Record<string, string | number>;

export type TableDef = {
  name: string;
  columns: { key: string; label: string; align?: "left" | "right"; badge?: boolean }[];
  rows: Row[];
};

export type SeriesPoint = { label: string; value: number; secondary?: number };

export type MapMarker = {
  id: string;
  label: string;
  type: "rescue" | "rescuer" | "volunteer" | "sighting";
  priority: Priority;
  status: RequestStatus;
  x: number;
  y: number;
};

export type StatDef = {
  label: string;
  value: string;
  change: number;
  period: string;
  icon: string;
};

export type SectionKind =
  | "overview"
  | "table"
  | "analytics"
  | "map"
  | "form"
  | "cards"
  | "settings";

export type SectionDef = {
  slug: string;
  label: string;
  icon: string;
  kind: SectionKind;
  title: string;
  description: string;
  badge?: number;
  table?: TableDef;
  cards?: { title: string; meta: string; body: string; tag: string }[];
};

export type RoleDef = {
  role: UserRole;
  slug: string;
  name: string;
  persona: string;
  tagline: string;
  accent: string;
  user: { name: string; email: string; initials: string };
  stats: StatDef[];
  series: SeriesPoint[];
  breakdown: { label: string; value: number }[];
  sections: SectionDef[];
};

const districts = ["Kathmandu", "Lalitpur", "Bhaktapur", "Chitwan", "Pokhara", "Dharan", "Butwal"];
const species = [
  "Spectacled Cobra",
  "Common Krait",
  "Russell's Viper",
  "Rat Snake",
  "Checkered Keelback",
  "Green Pit Viper",
];
const people = [
  "Bikash Thapa",
  "Anjali Rai",
  "Prakash Gurung",
  "Sunita Maharjan",
  "Deepak Lama",
  "Nisha Karki",
  "Rohit Adhikari",
  "Maya Tamang",
  "Kiran Bhandari",
  "Sabina Joshi",
];
const orgs = [
  "Himalayan Herp Trust",
  "Terai Snake Rescue",
  "Valley Wildlife Response",
  "Chitwan Reptile Care",
  "Gandaki Field Unit",
  "Koshi Rescue Collective",
];
const statuses: RequestStatus[] = ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"];

const pick = <T,>(arr: T[], i: number): T => arr[i % arr.length] as T;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i);

function requestRows(n = 24): Row[] {
  return seq(n).map((i) => ({
    id: `SR-${2400 - i}`,
    species: pick(species, i * 3 + 1),
    district: pick(districts, i * 2),
    citizen: pick(people, i * 5 + 2),
    rescuer: i % 4 === 0 ? "—" : pick(people, i + 3),
    priority: pick(priorities, i * 3),
    status: pick(statuses, i * 2 + 1),
    reported: `${(i * 17) % 59}m ago`,
    confidence: `${72 + ((i * 7) % 27)}%`,
  }));
}

const requestColumns: TableDef["columns"] = [
  { key: "id", label: "Request" },
  { key: "species", label: "Species" },
  { key: "district", label: "District" },
  { key: "citizen", label: "Reported by" },
  { key: "rescuer", label: "Rescuer" },
  { key: "priority", label: "Priority", badge: true },
  { key: "status", label: "Status", badge: true },
  { key: "reported", label: "Age", align: "right" },
];

const requestsTable: TableDef = {
  name: "rescue-requests",
  columns: requestColumns,
  rows: requestRows(),
};

const organizationsTable: TableDef = {
  name: "organizations",
  columns: [
    { key: "name", label: "Organization" },
    { key: "district", label: "Base" },
    { key: "team", label: "Team", align: "right" },
    { key: "rescues", label: "Rescues", align: "right" },
    { key: "verified", label: "Verified", badge: true },
    { key: "status", label: "Status", badge: true },
  ],
  rows: seq(14).map((i) => ({
    name: `${pick(orgs, i)}${i > 5 ? ` ${Math.floor(i / 6) + 1}` : ""}`,
    district: pick(districts, i + 1),
    team: 6 + ((i * 5) % 34),
    rescues: 40 + ((i * 73) % 900),
    verified: i % 5 === 3 ? "PENDING" : "COMPLETED",
    status: i % 7 === 6 ? "CANCELLED" : "IN_PROGRESS",
  })),
};

const usersTable: TableDef = {
  name: "users",
  columns: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", badge: true },
    { key: "org", label: "Organization" },
    { key: "joined", label: "Joined", align: "right" },
  ],
  rows: seq(20).map((i) => ({
    name: pick(people, i),
    email: `${pick(people, i).toLowerCase().replace(" ", ".")}${i}@sarpa.org`,
    role: pick(["ADMIN", "RESCUER", "VOLUNTEER", "CITIZEN", "ORGANIZATION"], i),
    org: pick(orgs, i * 2),
    joined: `2025-0${(i % 9) + 1}-1${i % 9}`,
  })),
};

const volunteersTable: TableDef = {
  name: "volunteers",
  columns: [
    { key: "name", label: "Volunteer" },
    { key: "district", label: "District" },
    { key: "availability", label: "Availability", badge: true },
    { key: "status", label: "Status", badge: true },
    { key: "hours", label: "Hours", align: "right" },
    { key: "rescues", label: "Rescues", align: "right" },
  ],
  rows: seq(18).map((i) => ({
    name: pick(people, i + 4),
    district: pick(districts, i * 3),
    availability: pick(["AVAILABLE", "BUSY", "UNAVAILABLE"], i),
    status: pick(["APPROVED", "PENDING", "APPROVED", "INACTIVE"], i),
    hours: 20 + ((i * 37) % 400),
    rescues: 2 + ((i * 11) % 60),
  })),
};

const paymentsTable: TableDef = {
  name: "payments",
  columns: [
    { key: "id", label: "Reference" },
    { key: "donor", label: "Donor" },
    { key: "type", label: "Type", badge: true },
    { key: "amount", label: "Amount", align: "right" },
    { key: "status", label: "Status", badge: true },
    { key: "date", label: "Date", align: "right" },
  ],
  rows: seq(16).map((i) => ({
    id: `PAY-90${120 + i}`,
    donor: pick(people, i * 3),
    type: pick(["DONATION", "SUBSCRIPTION", "SERVICE_FEE"], i),
    amount: `NPR ${(1500 + ((i * 917) % 24000)).toLocaleString()}`,
    status: pick(["COMPLETED", "PENDING", "COMPLETED", "FAILED", "REFUNDED"], i),
    date: `2026-0${(i % 8) + 1}-${10 + (i % 18)}`,
  })),
};

const auditTable: TableDef = {
  name: "audit-logs",
  columns: [
    { key: "time", label: "Timestamp" },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action" },
    { key: "entity", label: "Entity" },
    { key: "result", label: "Result", badge: true },
  ],
  rows: seq(22).map((i) => ({
    time: `2026-08-0${(i % 7) + 1} ${String(8 + (i % 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    actor: pick(people, i * 2 + 1),
    action: pick(
      ["ROLE_UPDATED", "ORG_VERIFIED", "REQUEST_ASSIGNED", "PAYMENT_REFUNDED", "LOGIN", "EXPORT_CSV"],
      i,
    ),
    entity: pick(["User", "Organization", "RescueRequest", "Payment"], i * 3),
    result: i % 9 === 4 ? "CANCELLED" : "COMPLETED",
  })),
};

const snakesTable: TableDef = {
  name: "snake-records",
  columns: [
    { key: "species", label: "Species" },
    { key: "venomous", label: "Venomous", badge: true },
    { key: "encounters", label: "Encounters", align: "right" },
    { key: "released", label: "Released", align: "right" },
    { key: "region", label: "Common region" },
  ],
  rows: seq(12).map((i) => ({
    species: pick(species, i),
    venomous: i % 3 === 2 ? "LOW" : "EMERGENCY",
    encounters: 30 + ((i * 53) % 400),
    released: 25 + ((i * 41) % 380),
    region: pick(districts, i + 2),
  })),
};

const missionsTable: TableDef = {
  name: "missions",
  columns: [
    { key: "id", label: "Mission" },
    { key: "species", label: "Species" },
    { key: "location", label: "Location" },
    { key: "priority", label: "Priority", badge: true },
    { key: "status", label: "Status", badge: true },
    { key: "eta", label: "ETA", align: "right" },
  ],
  rows: seq(10).map((i) => ({
    id: `MSN-11${20 + i}`,
    species: pick(species, i + 1),
    location: `${pick(districts, i)} · ward ${(i % 12) + 1}`,
    priority: pick(priorities, i + 2),
    status: pick(statuses, i),
    eta: `${6 + ((i * 5) % 40)} min`,
  })),
};

const trainingTable: TableDef = {
  name: "training-modules",
  columns: [
    { key: "module", label: "Module" },
    { key: "level", label: "Level", badge: true },
    { key: "duration", label: "Duration", align: "right" },
    { key: "progress", label: "Progress", align: "right" },
    { key: "status", label: "Status", badge: true },
  ],
  rows: [
    ["Safe handling basics", "LOW", "45 min", "100%", "COMPLETED"],
    ["Venomous species ID", "MEDIUM", "1 h 20 min", "100%", "COMPLETED"],
    ["Hook & tube technique", "MEDIUM", "2 h", "68%", "IN_PROGRESS"],
    ["Snakebite first aid", "HIGH", "1 h 10 min", "40%", "IN_PROGRESS"],
    ["Crowd control on site", "MEDIUM", "50 min", "0%", "PENDING"],
    ["Release site assessment", "HIGH", "1 h 35 min", "0%", "PENDING"],
  ].map((r) => ({
    module: r[0] as string,
    level: r[1] as string,
    duration: r[2] as string,
    progress: r[3] as string,
    status: r[4] as string,
  })),
};

const eventsTable: TableDef = {
  name: "events",
  columns: [
    { key: "title", label: "Event" },
    { key: "date", label: "Date" },
    { key: "district", label: "District" },
    { key: "seats", label: "Seats", align: "right" },
    { key: "status", label: "Status", badge: true },
  ],
  rows: seq(8).map((i) => ({
    title: pick(
      [
        "Community awareness camp",
        "Handler recertification",
        "School snakebite drill",
        "Antivenom logistics workshop",
      ],
      i,
    ),
    date: `2026-09-${String(3 + i * 3).padStart(2, "0")}`,
    district: pick(districts, i * 2 + 1),
    seats: 20 + ((i * 13) % 90),
    status: pick(["PENDING", "ASSIGNED", "COMPLETED"], i),
  })),
};

const myRequestsTable: TableDef = {
  name: "my-requests",
  columns: [
    { key: "id", label: "Request" },
    { key: "species", label: "Suspected species" },
    { key: "status", label: "Status", badge: true },
    { key: "priority", label: "Priority", badge: true },
    { key: "rescuer", label: "Assigned to" },
    { key: "updated", label: "Updated", align: "right" },
  ],
  rows: seq(6).map((i) => ({
    id: `SR-23${80 + i}`,
    species: pick(species, i + 2),
    status: pick(statuses, i + 1),
    priority: pick(priorities, i),
    rescuer: i === 0 ? "—" : pick(people, i * 2),
    updated: `${(i + 1) * 12} min ago`,
  })),
};

export const markers: MapMarker[] = seq(16).map((i) => ({
  id: `m${i}`,
  label: `${pick(species, i)} · ${pick(districts, i * 2)}`,
  type: pick(["rescue", "rescuer", "volunteer", "sighting"] as const, i),
  priority: pick(priorities, i * 3),
  status: pick(statuses, i + 1),
  x: 8 + ((i * 37) % 84),
  y: 10 + ((i * 53) % 78),
}));

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
  read: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Emergency call-out",
    message: "Russell's viper reported inside a school kitchen in Chitwan.",
    type: "error",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "Rescue assigned",
    message: "SR-2418 assigned to Bikash Thapa. ETA 9 minutes.",
    type: "info",
    time: "12 min ago",
    read: false,
  },
  {
    id: "n3",
    title: "Volunteer approved",
    message: "Nisha Karki completed level-2 certification.",
    type: "success",
    time: "1 h ago",
    read: false,
  },
  {
    id: "n4",
    title: "Payment received",
    message: "NPR 24,000 donation from Valley Wildlife Response.",
    type: "success",
    time: "3 h ago",
    read: true,
  },
  {
    id: "n5",
    title: "Antivenom stock low",
    message: "Dharan depot below reorder threshold (4 vials).",
    type: "warning",
    time: "Yesterday",
    read: true,
  },
];

const monthly = (base: number, spread: number): SeriesPoint[] =>
  ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((label, i) => ({
    label,
    value: base + ((i * spread * 7) % (spread * 5)),
    secondary: Math.round((base + ((i * spread * 5) % (spread * 4))) * 0.62),
  }));

export const roles: RoleDef[] = [
  {
    role: "SUPER_ADMIN",
    slug: "super-admin",
    name: "Super admin",
    persona: "Platform owner",
    tagline: "Full-platform governance, org onboarding, AI and payment oversight.",
    accent: "primary",
    user: { name: "Aarati Shrestha", email: "aarati@sarparescue.org", initials: "AS" },
    stats: [
      { label: "Organizations", value: "42", change: 8.4, period: "vs last month", icon: "building" },
      { label: "Total users", value: "18,204", change: 12.1, period: "vs last month", icon: "users" },
      { label: "Active rescues", value: "37", change: -4.2, period: "vs yesterday", icon: "siren" },
      { label: "Completion rate", value: "94.6%", change: 1.8, period: "vs last month", icon: "check" },
    ],
    series: monthly(320, 40),
    breakdown: [
      { label: "Citizens", value: 62 },
      { label: "Volunteers", value: 21 },
      { label: "Rescuers", value: 11 },
      { label: "Staff", value: 6 },
    ],
    sections: [
      { slug: "organizations", label: "Organizations", icon: "building", kind: "table", title: "Organizations", description: "Verify, suspend and monitor partner rescue organizations.", table: organizationsTable, badge: 3 },
      { slug: "users", label: "Users", icon: "users", kind: "table", title: "All users", description: "Platform-wide user directory with role assignment.", table: usersTable },
      { slug: "rescuers", label: "Rescuers", icon: "shield", kind: "table", title: "Rescuers", description: "Certified handlers, coverage and workload.", table: volunteersTable },
      { slug: "volunteers", label: "Volunteers", icon: "heart", kind: "table", title: "Volunteers", description: "Applications, approvals and contribution hours.", table: volunteersTable },
      { slug: "ai", label: "AI management", icon: "brain", kind: "analytics", title: "AI identification", description: "Model confidence, throughput and misclassification review." },
      { slug: "payments", label: "Payments", icon: "wallet", kind: "table", title: "Payments", description: "Donations, subscriptions and service fees.", table: paymentsTable },
      { slug: "reports", label: "Reports", icon: "chart", kind: "analytics", title: "Platform reports", description: "Cross-organization performance and response analytics." },
      { slug: "audit-logs", label: "Audit logs", icon: "scroll", kind: "table", title: "Audit logs", description: "Immutable record of privileged actions.", table: auditTable },
      { slug: "settings", label: "Settings", icon: "settings", kind: "settings", title: "System settings", description: "Platform defaults, thresholds and notification policy." },
    ],
  },
  {
    role: "ADMIN",
    slug: "admin",
    name: "Admin",
    persona: "Operations lead",
    tagline: "Rescue operations, triage and volunteer management for one org.",
    accent: "accent",
    user: { name: "Prakash Gurung", email: "prakash@himalayanherp.org", initials: "PG" },
    stats: [
      { label: "Open requests", value: "19", change: 6.5, period: "vs yesterday", icon: "siren" },
      { label: "Avg response", value: "17 min", change: -9.3, period: "vs last week", icon: "clock" },
      { label: "Active handlers", value: "12", change: 3.0, period: "on shift", icon: "shield" },
      { label: "Released safely", value: "1,284", change: 4.4, period: "this year", icon: "check" },
    ],
    series: monthly(140, 22),
    breakdown: [
      { label: "Cobra", value: 34 },
      { label: "Krait", value: 22 },
      { label: "Rat snake", value: 28 },
      { label: "Viper", value: 16 },
    ],
    sections: [
      { slug: "rescue-requests", label: "Rescue requests", icon: "siren", kind: "table", title: "Rescue requests", description: "Triage incoming reports and assign handlers.", table: requestsTable, badge: 7 },
      { slug: "snakes", label: "Snakes", icon: "worm", kind: "table", title: "Snake records", description: "Species encountered, outcomes and release data.", table: snakesTable },
      { slug: "volunteers", label: "Volunteers", icon: "heart", kind: "table", title: "Volunteer management", description: "Approve applications and track availability.", table: volunteersTable },
      { slug: "analytics", label: "Analytics", icon: "chart", kind: "analytics", title: "Organization analytics", description: "Demand patterns, response times and outcomes." },
      { slug: "reports", label: "Reports", icon: "scroll", kind: "table", title: "Rescue reports", description: "Filed field reports awaiting review.", table: requestsTable },
    ],
  },
  {
    role: "ORGANIZATION",
    slug: "organization",
    name: "Organization",
    persona: "Partner NGO",
    tagline: "Team, service areas, events and funding for your organization.",
    accent: "primary",
    user: { name: "Terai Snake Rescue", email: "ops@teraisnake.org", initials: "TS" },
    stats: [
      { label: "Team members", value: "28", change: 7.1, period: "vs last quarter", icon: "users" },
      { label: "Service areas", value: "6", change: 0, period: "districts", icon: "map" },
      { label: "Events hosted", value: "14", change: 16.7, period: "this year", icon: "calendar" },
      { label: "Funds raised", value: "NPR 1.2M", change: 22.4, period: "this year", icon: "wallet" },
    ],
    series: monthly(90, 18),
    breakdown: [
      { label: "Field ops", value: 44 },
      { label: "Awareness", value: 26 },
      { label: "Training", value: 18 },
      { label: "Admin", value: 12 },
    ],
    sections: [
      { slug: "profile", label: "Profile", icon: "building", kind: "settings", title: "Organization profile", description: "Public details, service areas and verification." },
      { slug: "team", label: "Team", icon: "users", kind: "table", title: "Team management", description: "Staff roles and permissions.", table: usersTable },
      { slug: "volunteers", label: "Volunteers", icon: "heart", kind: "table", title: "Volunteers", description: "Roster, availability and contribution.", table: volunteersTable },
      { slug: "events", label: "Events", icon: "calendar", kind: "table", title: "Events calendar", description: "Awareness camps, drills and training sessions.", table: eventsTable },
      { slug: "payments", label: "Payments", icon: "wallet", kind: "table", title: "Payment history", description: "Incoming donations and platform fees.", table: paymentsTable },
    ],
  },
  {
    role: "RESCUER",
    slug: "rescuer",
    name: "Rescuer",
    persona: "Certified handler",
    tagline: "Mission dispatch, navigation, identification and field reporting.",
    accent: "accent",
    user: { name: "Bikash Thapa", email: "bikash@fieldunit.org", initials: "BT" },
    stats: [
      { label: "Assigned today", value: "4", change: 33.3, period: "vs yesterday", icon: "siren" },
      { label: "Avg on-site", value: "22 min", change: -6.8, period: "vs last week", icon: "clock" },
      { label: "Safe releases", value: "312", change: 2.9, period: "lifetime", icon: "check" },
      { label: "Rating", value: "4.9", change: 1.1, period: "last 30 days", icon: "star" },
    ],
    series: monthly(24, 6),
    breakdown: [
      { label: "Completed", value: 71 },
      { label: "In progress", value: 12 },
      { label: "Assigned", value: 11 },
      { label: "Cancelled", value: 6 },
    ],
    sections: [
      { slug: "missions", label: "Missions", icon: "siren", kind: "table", title: "Assigned missions", description: "Your active queue, ordered by priority.", table: missionsTable, badge: 4 },
      { slug: "map", label: "Map", icon: "map", kind: "map", title: "Field map", description: "Live positions, call-outs and navigation." },
      { slug: "identify", label: "Identify", icon: "brain", kind: "form", title: "Snake identification", description: "Upload a photo for AI-assisted species identification." },
      { slug: "report", label: "Report", icon: "scroll", kind: "form", title: "Rescue report", description: "File the outcome of a completed mission." },
      { slug: "stats", label: "Stats", icon: "chart", kind: "analytics", title: "Performance", description: "Response time, outcomes and streaks." },
    ],
  },
  {
    role: "VOLUNTEER",
    slug: "volunteer",
    name: "Volunteer",
    persona: "Community responder",
    tagline: "Pick up nearby call-outs, complete training, track your impact.",
    accent: "primary",
    user: { name: "Nisha Karki", email: "nisha@volunteer.org", initials: "NK" },
    stats: [
      { label: "Hours contributed", value: "148", change: 11.4, period: "this year", icon: "clock" },
      { label: "Rescues joined", value: "37", change: 8.8, period: "this year", icon: "siren" },
      { label: "Modules done", value: "4 / 6", change: 25, period: "curriculum", icon: "check" },
      { label: "Nearby open", value: "3", change: 0, period: "within 5 km", icon: "map" },
    ],
    series: monthly(12, 4),
    breakdown: [
      { label: "Field support", value: 48 },
      { label: "Awareness", value: 27 },
      { label: "Transport", value: 15 },
      { label: "Admin", value: 10 },
    ],
    sections: [
      { slug: "available", label: "Available", icon: "siren", kind: "table", title: "Available requests", description: "Unclaimed call-outs near you.", table: requestsTable, badge: 3 },
      { slug: "training", label: "Training", icon: "brain", kind: "table", title: "Training modules", description: "Certification path and progress.", table: trainingTable },
      { slug: "history", label: "History", icon: "scroll", kind: "table", title: "Volunteer history", description: "Every call-out you have supported.", table: myRequestsTable },
      {
        slug: "community",
        label: "Community",
        icon: "heart",
        kind: "cards",
        title: "Community",
        description: "Discussion, sightings and awareness campaigns.",
        cards: [
          { title: "Monsoon call-out surge", meta: "Kathmandu · 14 replies", body: "Cobra sightings up 40% around Kalimati. Coordinating extra evening cover.", tag: "Coordination" },
          { title: "New release protocol", meta: "Field note · 6 replies", body: "Release sites must be 3+ km from settlements and logged with GPS.", tag: "Protocol" },
          { title: "School drill kit", meta: "Chitwan · 9 replies", body: "Printable first-aid posters in Nepali and Tharu are now available.", tag: "Awareness" },
          { title: "Krait night watch", meta: "Dharan · 21 replies", body: "Sleeping on raised beds cut bite reports in the pilot wards.", tag: "Safety" },
        ],
      },
    ],
  },
  {
    role: "CITIZEN",
    slug: "citizen",
    name: "Citizen",
    persona: "Public reporter",
    tagline: "Report a snake, track rescue progress, learn what is safe.",
    accent: "accent",
    user: { name: "Sunita Maharjan", email: "sunita@mail.com", initials: "SM" },
    stats: [
      { label: "My requests", value: "6", change: 0, period: "lifetime", icon: "siren" },
      { label: "Active now", value: "1", change: 0, period: "in progress", icon: "clock" },
      { label: "Nearest team", value: "3.2 km", change: -12, period: "response radius", icon: "map" },
      { label: "Donated", value: "NPR 4,500", change: 15, period: "this year", icon: "wallet" },
    ],
    series: monthly(4, 2),
    breakdown: [
      { label: "Completed", value: 66 },
      { label: "In progress", value: 17 },
      { label: "Pending", value: 17 },
    ],
    sections: [
      { slug: "request", label: "New request", icon: "siren", kind: "form", title: "New rescue request", description: "Tell us where the snake is — stay at a safe distance." },
      { slug: "my-requests", label: "My requests", icon: "scroll", kind: "table", title: "My requests", description: "Track every report you have filed.", table: myRequestsTable },
      {
        slug: "emergency",
        label: "Emergency",
        icon: "phone",
        kind: "cards",
        title: "Emergency contacts",
        description: "Snakebite first aid and 24/7 hotlines.",
        cards: [
          { title: "Rescue hotline 1166", meta: "24/7 · nationwide", body: "Free call. Give your ward number and a landmark, then keep everyone back.", tag: "Call first" },
          { title: "Nearest antivenom", meta: "Bir Hospital · 4.1 km", body: "Polyvalent antivenom in stock. Do not wait for symptoms to travel.", tag: "Hospital" },
          { title: "Do this now", meta: "First aid", body: "Immobilise the limb, remove rings, keep the person calm and lying still.", tag: "First aid" },
          { title: "Never do this", meta: "First aid", body: "No tourniquet, no cutting, no ice, no attempting to catch the snake.", tag: "Warning" },
        ],
      },
      { slug: "snake-info", label: "Snake info", icon: "worm", kind: "table", title: "Snake information", description: "Know which species are dangerous in your district.", table: snakesTable },
      { slug: "donate", label: "Donate", icon: "wallet", kind: "form", title: "Support the network", description: "Fund field kits, antivenom transport and volunteer training." },
      { slug: "profile", label: "Profile", icon: "settings", kind: "settings", title: "Profile", description: "Contact details, address and notification preferences." },
    ],
  },
];

export const roleBySlug = (slug: string) => roles.find((r) => r.slug === slug);

export const activityFeed = [
  { time: "12:41", text: "SR-2418 escalated to EMERGENCY by dispatch", tone: "error" as const },
  { time: "12:36", text: "Bikash Thapa marked en-route to Kalimati", tone: "info" as const },
  { time: "12:20", text: "AI identified Common Krait at 94% confidence", tone: "warning" as const },
  { time: "11:58", text: "SR-2412 completed — rat snake released in buffer zone", tone: "success" as const },
  { time: "11:31", text: "Terai Snake Rescue verified by super admin", tone: "success" as const },
  { time: "11:04", text: "Volunteer application from Rohit Adhikari received", tone: "info" as const },
];
