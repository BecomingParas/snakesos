// ===================================================================
// ANALYTICS - MODULE EXPORTS
// ===================================================================



export const analyticsSchema = `# ===================================================================
# ANALYTICS - TYPE DEFINITIONS
# ===================================================================

"""
Dashboard statistics overview
"""
type DashboardStats {
  # Rescue Metrics
  totalRescues: Int!
  activeRescues: Int!
  completedRescues: Int!
  completionRate: Float!
  averageResponseTime: Int!
  
  # Volunteer Metrics
  totalVolunteers: Int!
  activeVolunteers: Int!
  verifiedRescuers: Int!
  
  # Species Metrics
  totalSpecies: Int!
  venomousEncounters: Int!
  
  # Community Metrics
  totalUsers: Int!
  totalDonations: Float!
  totalDonationAmount: Float!
  
  # Recent Activity
  recentRescues: [RescueRequest!]!
  recentDonations: [Donation!]!
  
  # Trends
  rescueTrend: TrendData!
  volunteerTrend: TrendData!
  donationTrend: TrendData!
}

"""
Trend data for time series
"""
type TrendData {
  current: Int!
  previous: Int!
  change: Float!
  direction: TrendDirection!
  data: [TimeSeriesPoint!]!
}

"""
Trend direction
"""
enum TrendDirection {
  UP
  DOWN
  STABLE
}

"""
Time series data point
"""
type TimeSeriesPoint {
  timestamp: DateTime!
  value: Float!
  label: String
}

"""
Rescue analytics
"""
type RescueAnalytics {
  totalRescues: Int!
  byStatus: [RescueByStatus!]!
  byPriority: [RescueByPriority!]!
  byMunicipality: [RescueByMunicipality!]!
  bySpecies: [RescueBySpecies!]!
  byTimeOfDay: [RescueByTimeOfDay!]!
  responseTimeAnalysis: ResponseTimeAnalysis!
  successRate: Float!
  timeSeriesData: [TimeSeriesPoint!]!
}

"""
Rescue count by status
"""
type RescueByStatus {
  status: RescueStatus!
  count: Int!
  percentage: Float!
}

"""
Rescue count by priority
"""
type RescueByPriority {
  priority: RescuePriority!
  count: Int!
  percentage: Float!
}

"""
Rescue count by municipality
"""
type RescueByMunicipality {
  municipality: String!
  count: Int!
  percentage: Float!
}

"""
Rescue count by species
"""
type RescueBySpecies {
  species: SnakeSpecies!
  count: Int!
  percentage: Float!
}

"""
Rescue count by time of day
"""
type RescueByTimeOfDay {
  hour: Int!
  count: Int!
  averageResponseTime: Int!
}

"""
Response time analysis
"""
type ResponseTimeAnalysis {
  average: Int!
  median: Int!
  fastest: Int!
  slowest: Int!
  byPriority: [ResponseTimeByPriority!]!
}

"""
Response time by priority
"""
type ResponseTimeByPriority {
  priority: RescuePriority!
  average: Int!
  median: Int!
}

"""
Volunteer analytics
"""
type VolunteerAnalytics {
  totalVolunteers: Int!
  activeCount: Int!
  byStatus: [VolunteerByStatus!]!
  byExperience: [VolunteerByExperience!]!
  byMunicipality: [VolunteerByMunicipality!]!
  topPerformers: [VolunteerPerformance!]!
  averageRating: Float!
  timeSeriesData: [TimeSeriesPoint!]!
}

"""
Volunteer count by status
"""
type VolunteerByStatus {
  status: VolunteerStatus!
  count: Int!
  percentage: Float!
}

"""
Volunteer count by experience
"""
type VolunteerByExperience {
  experience: ExperienceLevel!
  count: Int!
  percentage: Float!
}

"""
Volunteer count by municipality
"""
type VolunteerByMunicipality {
  municipality: String!
  count: Int!
  percentage: Float!
}

"""
Geographic heatmap data
"""
type GeographicHeatmap {
  municipality: String!
  lat: Latitude!
  lng: Longitude!
  rescueCount: Int!
  intensity: Float!
}

"""
Engagement metrics
"""
type EngagementMetrics {
  totalPageViews: Int!
  uniqueVisitors: Int!
  avgSessionDuration: Int!
  bounceRate: Float!
  topPages: [PageView!]!
  userGrowth: [TimeSeriesPoint!]!
}

"""
Page view statistics
"""
type PageView {
  page: String!
  views: Int!
  uniqueViews: Int!
  avgDuration: Int!
}
`;
export const analyticsInputs = `# ===================================================================
# ANALYTICS - INPUT TYPES
# ===================================================================

"""
Input for analytics date range
"""
input AnalyticsDateRangeInput {
  startDate: DateTime!
  endDate: DateTime!
}

"""
Input for rescue analytics
"""
input RescueAnalyticsInput {
  dateRange: AnalyticsDateRangeInput
  municipality: String
  status: RescueStatus
  priority: RescuePriority
  volunteerId: ID
}

"""
Input for volunteer analytics
"""
input VolunteerAnalyticsInput {
  dateRange: AnalyticsDateRangeInput
  municipality: String
  status: VolunteerStatus
  experience: ExperienceLevel
}

"""
Input for geographic heatmap
"""
input GeographicHeatmapInput {
  dateRange: AnalyticsDateRangeInput
  municipality: String
}

"""
Time period for analytics
"""
enum AnalyticsTimePeriod {
  TODAY
  YESTERDAY
  LAST_7_DAYS
  LAST_30_DAYS
  LAST_90_DAYS
  THIS_MONTH
  LAST_MONTH
  THIS_YEAR
  LAST_YEAR
  CUSTOM
}
`;
export const analyticsQueries = `# ===================================================================
# ANALYTICS - QUERIES
# ===================================================================

extend type Query {
  """
  Get dashboard statistics
  """
  dashboardStats(period: AnalyticsTimePeriod): DashboardStats! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get rescue analytics
  """
  rescueAnalytics(input: RescueAnalyticsInput): RescueAnalytics! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get volunteer analytics
  """
  volunteerAnalytics(input: VolunteerAnalyticsInput): VolunteerAnalytics! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get geographic heatmap data
  """
  geographicHeatmap(input: GeographicHeatmapInput): [GeographicHeatmap!]! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get engagement metrics
  """
  engagementMetrics(dateRange: AnalyticsDateRangeInput): EngagementMetrics! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Export analytics data (CSV/JSON)
  """
  exportAnalytics(
    type: String!
    input: RescueAnalyticsInput
    format: String
  ): String! @auth(requires: [ADMIN, SUPER_ADMIN])
}
`;
export const analyticsMutations = `# ===================================================================
# ANALYTICS - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Track page view
  """
  trackPageView(page: String!, duration: Int): SuccessResponse!
  
  """
  Refresh analytics cache
  """
  refreshAnalyticsCache: SuccessResponse! @auth(requires: [SUPER_ADMIN])
}
`;
export const analyticsSubscriptions = `# ===================================================================
# ANALYTICS - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to real-time dashboard updates
  """
  dashboardUpdated: DashboardStats! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Subscribe to analytics data changes
  """
  analyticsUpdated(type: String!): JSON! @auth(requires: [ADMIN, SUPER_ADMIN])
}
`;
export const analyticsFragments = `# ===================================================================
# ANALYTICS - REUSABLE FRAGMENTS
# ===================================================================

"""
Dashboard stats overview
"""
fragment DashboardStatsOverview on DashboardStats {
  totalRescues
  activeRescues
  completedRescues
  completionRate
  averageResponseTime
  totalVolunteers
  activeVolunteers
  totalUsers
  totalDonations
  totalDonationAmount
}

"""
Trend data fields
"""
fragment TrendDataFields on TrendData {
  current
  previous
  change
  direction
}

"""
Time series data
"""
fragment TimeSeriesData on TimeSeriesPoint {
  timestamp
  value
  label
}
`;

// Combine all analytics type definitions
export const analyticsTypeDefs = [
  analyticsSchema,
  analyticsInputs,
  analyticsQueries,
  analyticsMutations,
  analyticsSubscriptions,
  analyticsFragments,
].join('\n\n');

// Export operations for code generation
export const analyticsOperations = {
  queries: analyticsQueries,
  mutations: analyticsMutations,
  subscriptions: analyticsSubscriptions,
};

// Export fragments for reuse
export const analyticsFragmentDefinitions = analyticsFragments;
