/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Date without time */
  Date: { input: unknown; output: unknown };
  /** ISO 8601 datetime string (e.g., "2024-08-05T12:30:00Z") */
  DateTime: { input: string; output: string };
  /** Valid email address format */
  Email: { input: string; output: string };
  /**
   * GeoJSON geometry object
   * Can be Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon
   */
  GeoJSON: { input: unknown; output: unknown };
  /** JSON object for flexible data structures */
  JSON: { input: any; output: any };
  /** Latitude coordinate (-90 to 90) */
  Latitude: { input: number; output: number };
  /** Longitude coordinate (-180 to 180) */
  Longitude: { input: number; output: number };
  /** Valid phone number (international format) */
  Phone: { input: string; output: string };
  /** Positive integer */
  PositiveInt: { input: number; output: number };
  /** File upload scalar for multipart/form-data */
  Upload: { input: File; output: File };
};

/** AI-powered snake identification result */
export type AiIdentification = {
  __typename?: 'AIIdentification';
  alternativeMatches: Array<AlternativeMatch>;
  colorDetected: Array<Scalars['String']['output']>;
  confidence: Scalars['Float']['output'];
  correctSpecies?: Maybe<SnakeSpecies>;
  createdAt: Scalars['DateTime']['output'];
  dangerAssessment?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageThumbnail?: Maybe<Scalars['String']['output']>;
  imageUrl: Scalars['String']['output'];
  model: Scalars['String']['output'];
  promptUsed?: Maybe<Scalars['String']['output']>;
  provider: AiProvider;
  rescueRequest?: Maybe<RescueRequest>;
  responseTime?: Maybe<Scalars['Int']['output']>;
  sizeEstimate?: Maybe<Scalars['String']['output']>;
  species?: Maybe<SnakeSpecies>;
  uploadSource: UploadSource;
  user?: Maybe<User>;
  userFeedback?: Maybe<IdentificationFeedback>;
  venomousDetected?: Maybe<Scalars['Boolean']['output']>;
};

/** Connection type for paginated AI identification results */
export type AiIdentificationConnection = {
  __typename?: 'AIIdentificationConnection';
  edges: Array<AiIdentificationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for AI identification connection */
export type AiIdentificationEdge = {
  __typename?: 'AIIdentificationEdge';
  cursor: Scalars['String']['output'];
  node: AiIdentification;
};

/** Filter input for AI identification queries */
export type AiIdentificationFilterInput = {
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  feedback?: InputMaybe<IdentificationFeedback>;
  hasFeedback?: InputMaybe<Scalars['Boolean']['input']>;
  maxConfidence?: InputMaybe<Scalars['Float']['input']>;
  minConfidence?: InputMaybe<Scalars['Float']['input']>;
  provider?: InputMaybe<AiProvider>;
  providers?: InputMaybe<Array<AiProvider>>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  uploadSource?: InputMaybe<UploadSource>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

/** Fields available for sorting AI identifications */
export type AiIdentificationSortField =
  | 'CONFIDENCE'
  | 'CREATED_AT'
  | 'PROVIDER'
  | 'RESPONSE_TIME'
  | '%future added value';

/** Sort input for AI identification queries */
export type AiIdentificationSortInput = {
  field: AiIdentificationSortField;
  order: SortOrder;
};

/** AI identification statistics */
export type AiIdentificationStats = {
  __typename?: 'AIIdentificationStats';
  accuracyRate?: Maybe<Scalars['Float']['output']>;
  averageConfidence: Scalars['Float']['output'];
  averageResponseTime: Scalars['Int']['output'];
  byProvider: Array<IdentificationByProvider>;
  topIdentifiedSpecies: Array<SpeciesIdentificationCount>;
  total: Scalars['Int']['output'];
};

/** AI model configuration */
export type AiModelConfig = {
  __typename?: 'AIModelConfig';
  accuracy?: Maybe<Scalars['Float']['output']>;
  averageResponseTime?: Maybe<Scalars['Int']['output']>;
  enabled: Scalars['Boolean']['output'];
  maxImageSize: Scalars['Int']['output'];
  model: Scalars['String']['output'];
  provider: AiProvider;
  supportedFormats: Array<Scalars['String']['output']>;
};

/** AI provider for snake identification */
export type AiProvider =
  | 'CLAUDE'
  | 'CUSTOM'
  | 'GEMINI'
  | 'LOCAL'
  | 'OPENAI'
  | '%future added value';

/** Input for volunteer accepting a rescue */
export type AcceptRescueInput = {
  currentLat?: InputMaybe<Scalars['Latitude']['input']>;
  currentLng?: InputMaybe<Scalars['Longitude']['input']>;
  estimatedArrival?: InputMaybe<Scalars['Int']['input']>;
  rescueId: Scalars['ID']['input'];
};

/** Activity log entry for audit trail */
export type ActivityLog = {
  __typename?: 'ActivityLog';
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['ID']['output']>;
  user: User;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

/** Paginated connection for activity logs */
export type ActivityLogConnection = {
  __typename?: 'ActivityLogConnection';
  edges: Array<ActivityLog>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Activity pattern */
export type ActivityPattern =
  | 'BOTH'
  | 'CREPUSCULAR'
  | 'DIURNAL'
  | 'NOCTURNAL'
  | '%future added value';

/** Input for adding timeline event */
export type AddTimelineEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['String']['input'];
  lat?: InputMaybe<Scalars['Latitude']['input']>;
  lng?: InputMaybe<Scalars['Longitude']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rescueId: Scalars['ID']['input'];
};

export type AdminSettings = {
  __typename?: 'AdminSettings';
  autoAssignEnabled: Scalars['Boolean']['output'];
  contactEmail: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  defaultRadius: Scalars['Int']['output'];
  emailApiKey: Scalars['String']['output'];
  emailEnabled: Scalars['Boolean']['output'];
  emailProvider: Scalars['String']['output'];
  mapboxToken: Scalars['String']['output'];
  maxAssignmentDistance: Scalars['Int']['output'];
  maxLoginAttempts: Scalars['Int']['output'];
  maxResponseTime: Scalars['Int']['output'];
  passwordMinLength: Scalars['Int']['output'];
  priorityThreshold: Scalars['Int']['output'];
  pushEnabled: Scalars['Boolean']['output'];
  requireTwoFactor: Scalars['Boolean']['output'];
  sessionTimeout: Scalars['Int']['output'];
  smsApiKey: Scalars['String']['output'];
  smsEnabled: Scalars['Boolean']['output'];
  smsProvider: Scalars['String']['output'];
  supportEmail: Scalars['String']['output'];
  systemName: Scalars['String']['output'];
  targetResponseTime: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AdminSettingsInput = {
  autoAssignEnabled: Scalars['Boolean']['input'];
  contactEmail: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  defaultRadius: Scalars['Int']['input'];
  emailApiKey: Scalars['String']['input'];
  emailEnabled: Scalars['Boolean']['input'];
  emailProvider: Scalars['String']['input'];
  mapboxToken: Scalars['String']['input'];
  maxAssignmentDistance: Scalars['Int']['input'];
  maxLoginAttempts: Scalars['Int']['input'];
  maxResponseTime: Scalars['Int']['input'];
  passwordMinLength: Scalars['Int']['input'];
  priorityThreshold: Scalars['Int']['input'];
  pushEnabled: Scalars['Boolean']['input'];
  requireTwoFactor: Scalars['Boolean']['input'];
  sessionTimeout: Scalars['Int']['input'];
  smsApiKey: Scalars['String']['input'];
  smsEnabled: Scalars['Boolean']['input'];
  smsProvider: Scalars['String']['input'];
  supportEmail: Scalars['String']['input'];
  systemName: Scalars['String']['input'];
  targetResponseTime: Scalars['Int']['input'];
};

/** Alternative species match from AI */
export type AlternativeMatch = {
  __typename?: 'AlternativeMatch';
  confidence: Scalars['Float']['output'];
  reasoning?: Maybe<Scalars['String']['output']>;
  species: SnakeSpecies;
};

/** Input for analytics date range */
export type AnalyticsDateRangeInput = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

/** Time period for analytics */
export type AnalyticsTimePeriod =
  | 'CUSTOM'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'LAST_MONTH'
  | 'LAST_YEAR'
  | 'THIS_MONTH'
  | 'THIS_YEAR'
  | 'TODAY'
  | 'YESTERDAY'
  | '%future added value';

export type AntivenomStatus =
  | 'AVAILABLE'
  | 'LOW_STOCK'
  | 'NOT_SUPPORTED'
  | 'OUT_OF_STOCK'
  | 'UNKNOWN'
  | '%future added value';

export type AntivenomStatusUpdate = {
  __typename?: 'AntivenomStatusUpdate';
  hospital: Hospital;
  newStatus: AntivenomStatus;
  previousStatus: AntivenomStatus;
  verifiedAt: Scalars['DateTime']['output'];
  verifiedBy: Scalars['String']['output'];
};

/** Input for volunteer application */
export type ApplyVolunteerInput = {
  address: Scalars['String']['input'];
  assignedZone?: InputMaybe<Scalars['String']['input']>;
  availableDays: Array<Scalars['String']['input']>;
  availableTime: AvailabilityTime;
  bio?: InputMaybe<Scalars['String']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  contact: Scalars['Phone']['input'];
  coverageRadius?: InputMaybe<Scalars['Int']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  emergencyAvailability: Scalars['Boolean']['input'];
  emergencyContact?: InputMaybe<Scalars['String']['input']>;
  emergencyPhone?: InputMaybe<Scalars['Phone']['input']>;
  equipment?: InputMaybe<Array<Scalars['String']['input']>>;
  experience: ExperienceLevel;
  experienceYears?: InputMaybe<Scalars['Int']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  hasEquipment: Scalars['Boolean']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  languages?: InputMaybe<Array<Scalars['String']['input']>>;
  municipality: Scalars['String']['input'];
  name: Scalars['String']['input'];
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  vehicle: VehicleType;
  vehicleDetails?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for assigning a rescue to a volunteer */
export type AssignRescueInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  rescueId: Scalars['ID']['input'];
  volunteerId: Scalars['ID']['input'];
};

/** Authentication payload returned on successful login/register */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Int']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

/** Availability time preference */
export type AvailabilityTime =
  | 'ANYTIME'
  | 'EVENINGS'
  | 'WEEKDAYS'
  | 'WEEKENDS'
  | '%future added value';

/** Available volunteers for dispatch */
export type AvailableVolunteer = {
  __typename?: 'AvailableVolunteer';
  currentlyAssigned: Scalars['Int']['output'];
  distance?: Maybe<Scalars['Float']['output']>;
  estimatedArrival?: Maybe<Scalars['Int']['output']>;
  rankingScore: Scalars['Float']['output'];
  volunteer: Volunteer;
};

/** Blog post */
export type BlogPost = {
  __typename?: 'BlogPost';
  author: User;
  category: PostCategory;
  commentCount: Scalars['Int']['output'];
  commentsEnabled: Scalars['Boolean']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  excerpt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  images: Array<Scalars['String']['output']>;
  likes: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaKeywords: Array<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  shares: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  status: PostStatus;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  videoUrl?: Maybe<Scalars['String']['output']>;
  views: Scalars['Int']['output'];
};

/** Connection type for paginated blog post results */
export type BlogPostConnection = {
  __typename?: 'BlogPostConnection';
  edges: Array<BlogPostEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for blog post connection */
export type BlogPostEdge = {
  __typename?: 'BlogPostEdge';
  cursor: Scalars['String']['output'];
  node: BlogPost;
};

/** Filter input for blog post queries */
export type BlogPostFilterInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<Array<PostCategory>>;
  category?: InputMaybe<PostCategory>;
  publishedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  publishedBefore?: InputMaybe<Scalars['DateTime']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PostStatus>;
  statuses?: InputMaybe<Array<PostStatus>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Fields available for sorting blog posts */
export type BlogPostSortField =
  | 'CREATED_AT'
  | 'LIKES'
  | 'PUBLISHED_AT'
  | 'TITLE'
  | 'UPDATED_AT'
  | 'VIEWS'
  | '%future added value';

/** Sort input for blog post queries */
export type BlogPostSortInput = {
  field: BlogPostSortField;
  order: SortOrder;
};

export type BulkImportError = {
  __typename?: 'BulkImportError';
  error: Scalars['String']['output'];
  hospitalName: Scalars['String']['output'];
  index: Scalars['Int']['output'];
};

export type BulkImportResult = {
  __typename?: 'BulkImportResult';
  errors: Array<BulkImportError>;
  failed: Scalars['Int']['output'];
  imported: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

/** Input for sending bulk notifications */
export type BulkNotificationInput = {
  channels?: InputMaybe<Array<NotificationChannel>>;
  link?: InputMaybe<Scalars['String']['input']>;
  message: Scalars['String']['input'];
  priority?: InputMaybe<NotificationPriority>;
  title: Scalars['String']['input'];
  type: NotificationType;
  userIds: Array<Scalars['ID']['input']>;
};

/** Bulk operation result */
export type BulkOperationResult = {
  __typename?: 'BulkOperationResult';
  /** List of errors for failed items */
  errors: Array<Error>;
  /** Number of failed operations */
  failed: Scalars['Int']['output'];
  /** Number of items processed */
  processed: Scalars['Int']['output'];
  /** Number of successful operations */
  succeeded: Scalars['Int']['output'];
};

/** CMS statistics */
export type CmsStats = {
  __typename?: 'CMSStats';
  draftPosts: Scalars['Int']['output'];
  featuredImages: Array<GalleryImage>;
  popularPosts: Array<BlogPost>;
  publicImages: Scalars['Int']['output'];
  publishedPosts: Scalars['Int']['output'];
  recentPosts: Array<BlogPost>;
  totalImages: Scalars['Int']['output'];
  totalLikes: Scalars['Int']['output'];
  totalPosts: Scalars['Int']['output'];
  totalViews: Scalars['Int']['output'];
};

export type CaseOutcome =
  | 'DECEASED'
  | 'LOST_TO_FOLLOWUP'
  | 'RECOVERED'
  | 'RECOVERED_WITH_COMPLICATIONS'
  | 'UNKNOWN'
  | '%future added value';

/** Input for changing password */
export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangePasswordPayload = {
  __typename?: 'ChangePasswordPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** Input for completing a rescue */
export type CompleteRescueInput = {
  antivenomAdministered?: InputMaybe<Scalars['Boolean']['input']>;
  antivenomType?: InputMaybe<Scalars['String']['input']>;
  hospitalAdmission?: InputMaybe<Scalars['Boolean']['input']>;
  hospitalId?: InputMaybe<Scalars['String']['input']>;
  hospitalNotes?: InputMaybe<Scalars['String']['input']>;
  outcome: RescueOutcome;
  releaseLat?: InputMaybe<Scalars['Latitude']['input']>;
  releaseLng?: InputMaybe<Scalars['Longitude']['input']>;
  releaseLocation?: InputMaybe<Scalars['String']['input']>;
  rescueId: Scalars['ID']['input'];
  rescueImages?: InputMaybe<Array<Scalars['String']['input']>>;
  rescueReport: Scalars['String']['input'];
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  victimWentToHospital?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ConfirmPaymentInput = {
  paymentIntentId?: InputMaybe<Scalars['ID']['input']>;
  providerReference: Scalars['String']['input'];
};

/** Conservation status */
export type ConservationStatus =
  | 'CRITICALLY_ENDANGERED'
  | 'DATA_DEFICIENT'
  | 'ENDANGERED'
  | 'EXTINCT'
  | 'EXTINCT_IN_WILD'
  | 'LEAST_CONCERN'
  | 'NEAR_THREATENED'
  | 'VULNERABLE'
  | '%future added value';

/** Contact message from users */
export type ContactMessage = {
  __typename?: 'ContactMessage';
  assignedTo?: Maybe<User>;
  category: MessageCategory;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['Email']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['Phone']['output']>;
  priority: MessagePriority;
  responded: Scalars['Boolean']['output'];
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  response?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  status: MessageStatus;
  subject: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

/** Connection type for paginated contact message results */
export type ContactMessageConnection = {
  __typename?: 'ContactMessageConnection';
  edges: Array<ContactMessageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for contact message connection */
export type ContactMessageEdge = {
  __typename?: 'ContactMessageEdge';
  cursor: Scalars['String']['output'];
  node: ContactMessage;
};

/** Filter input for contact message queries */
export type ContactMessageFilterInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<Array<MessageCategory>>;
  category?: InputMaybe<MessageCategory>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  priorities?: InputMaybe<Array<MessagePriority>>;
  priority?: InputMaybe<MessagePriority>;
  responded?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MessageStatus>;
  statuses?: InputMaybe<Array<MessageStatus>>;
};

/** Fields available for sorting contact messages */
export type ContactMessageSortField =
  | 'CATEGORY'
  | 'CREATED_AT'
  | 'NAME'
  | 'PRIORITY'
  | 'STATUS'
  | '%future added value';

/** Sort input for contact message queries */
export type ContactMessageSortInput = {
  field: ContactMessageSortField;
  order: SortOrder;
};

/** Contact message statistics */
export type ContactMessageStats = {
  __typename?: 'ContactMessageStats';
  averageResponseTime: Scalars['Int']['output'];
  byCategory: Array<MessageByCategory>;
  byPriority: Array<MessageByPriority>;
  newMessages: Scalars['Int']['output'];
  recentMessages: Array<ContactMessage>;
  respondedMessages: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Coordinate = {
  __typename?: 'Coordinate';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type CoordinateInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CoverageAnalysis = {
  __typename?: 'CoverageAnalysis';
  /** Population coverage percentage */
  coveragePercentage?: Maybe<Scalars['Float']['output']>;
  /** Population covered by 30min travel */
  population30Min?: Maybe<Scalars['Int']['output']>;
  /** Population covered by 60min travel */
  population60Min?: Maybe<Scalars['Int']['output']>;
  /** Underserved areas */
  underservedAreas?: Maybe<Array<Scalars['String']['output']>>;
};

/** Input for creating a blog post */
export type CreateBlogPostInput = {
  category: PostCategory;
  commentsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  content: Scalars['String']['input'];
  excerpt?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaKeywords?: InputMaybe<Array<Scalars['String']['input']>>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug: Scalars['String']['input'];
  status?: InputMaybe<PostStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a donation */
export type CreateDonationInput = {
  amount: Scalars['Float']['input'];
  anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  campaign?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  donorEmail?: InputMaybe<Scalars['Email']['input']>;
  donorName: Scalars['String']['input'];
  donorPhone?: InputMaybe<Scalars['Phone']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  paymentMethod: PaymentMethod;
  purpose?: InputMaybe<DonationPurpose>;
};

export type CreateHospitalInput = {
  address: Scalars['String']['input'];
  ambulanceAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  antivenomStatus?: InputMaybe<AntivenomStatus>;
  bedCapacity?: InputMaybe<Scalars['Int']['input']>;
  bloodBankAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  district: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  emergency24x7?: InputMaybe<Scalars['Boolean']['input']>;
  emergencyAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  emergencyPhone?: InputMaybe<Scalars['String']['input']>;
  hospitalType?: InputMaybe<HospitalType>;
  icuAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  municipality: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  officialTreatmentCenter?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  province: Scalars['String']['input'];
  snakebiteTreatmentAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  sourceUrl?: InputMaybe<Scalars['String']['input']>;
  sourceYear?: InputMaybe<Scalars['String']['input']>;
  specializations?: InputMaybe<Array<Scalars['String']['input']>>;
  treatmentCenterType?: InputMaybe<TreatmentCenterType>;
  ventilatorAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  ward?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateHospitalReportInput = {
  description: Scalars['String']['input'];
  hospitalId: Scalars['ID']['input'];
  reportType: HospitalReportType;
  reporterEmail?: InputMaybe<Scalars['String']['input']>;
  reporterName?: InputMaybe<Scalars['String']['input']>;
  reporterPhone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMediaUploadSignatureInput = {
  fileName: Scalars['String']['input'];
  mediaType: MediaType;
  mimeType: Scalars['String']['input'];
  sizeBytes: Scalars['Int']['input'];
};

/** Input for creating a notification */
export type CreateNotificationInput = {
  actionUrl?: InputMaybe<Scalars['String']['input']>;
  channels?: InputMaybe<Array<NotificationChannel>>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  message: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  priority?: InputMaybe<NotificationPriority>;
  rescueId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
  type: NotificationType;
  userId: Scalars['ID']['input'];
};

export type CreatePaymentIntentInput = {
  amount: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  donationId?: InputMaybe<Scalars['ID']['input']>;
  idempotencyKey: Scalars['String']['input'];
  provider: PaymentProvider;
  rescueChargeId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreatePayoutInput = {
  idempotencyKey: Scalars['String']['input'];
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  settlementId: Scalars['ID']['input'];
};

/** Input for creating a rescue request */
export type CreateRescueRequestInput = {
  address: Scalars['String']['input'];
  biteDetails?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  emergencyDetails?: InputMaybe<Scalars['String']['input']>;
  hasBite?: InputMaybe<Scalars['Boolean']['input']>;
  isEmergency?: InputMaybe<Scalars['Boolean']['input']>;
  landmark?: InputMaybe<Scalars['String']['input']>;
  lat?: InputMaybe<Scalars['Latitude']['input']>;
  lng?: InputMaybe<Scalars['Longitude']['input']>;
  locationAccuracy?: InputMaybe<Scalars['Float']['input']>;
  municipality: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['Phone']['input'];
  snakeColor?: InputMaybe<Scalars['String']['input']>;
  snakeDescription?: InputMaybe<Scalars['String']['input']>;
  snakeImageUrl?: InputMaybe<Scalars['String']['input']>;
  snakeImages?: InputMaybe<Array<Scalars['String']['input']>>;
  snakeSize?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<RescueSource>;
  ward?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for creating snake species */
export type CreateSnakeSpeciesInput = {
  activeTime?: InputMaybe<ActivityPattern>;
  aliases?: InputMaybe<Array<Scalars['String']['input']>>;
  altitudeRange?: InputMaybe<Scalars['String']['input']>;
  averageLength?: InputMaybe<Scalars['String']['input']>;
  behavior?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  conservationStatus?: InputMaybe<ConservationStatus>;
  dangerLevel?: InputMaybe<DangerLevel>;
  diet?: InputMaybe<Scalars['String']['input']>;
  distinctiveFeatures?: InputMaybe<Array<Scalars['String']['input']>>;
  emergencyAdvice?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  firstAidSteps?: InputMaybe<Array<Scalars['String']['input']>>;
  foundInNepal?: InputMaybe<Scalars['Boolean']['input']>;
  genus?: InputMaybe<Scalars['String']['input']>;
  habitat?: InputMaybe<Scalars['String']['input']>;
  identificationGuide?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  localNames?: InputMaybe<Array<Scalars['String']['input']>>;
  maxLength?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  nepaliName: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  protected?: InputMaybe<Scalars['Boolean']['input']>;
  regions?: InputMaybe<Array<Scalars['String']['input']>>;
  safetyTips?: InputMaybe<Scalars['String']['input']>;
  scientificName: Scalars['String']['input'];
  species?: InputMaybe<Scalars['String']['input']>;
  venomType?: InputMaybe<VenomType>;
  venomous: Scalars['Boolean']['input'];
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a training session */
export type CreateTrainingInput = {
  certificate?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration: Scalars['Int']['input'];
  instructor?: InputMaybe<Scalars['String']['input']>;
  location: Scalars['String']['input'];
  materials?: InputMaybe<Array<Scalars['String']['input']>>;
  maxParticipants: Scalars['Int']['input'];
  scheduledAt: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  type: TrainingType;
};

/** Cursor-based pagination input */
export type CursorPaginationInput = {
  /** Cursor to start from */
  after?: InputMaybe<Scalars['String']['input']>;
  /** Cursor to end at */
  before?: InputMaybe<Scalars['String']['input']>;
  /** Number of items (max 100) */
  first?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items from end (max 100) */
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type DailyAvailability = {
  __typename?: 'DailyAvailability';
  day: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type DailyAvailabilityInput = {
  day: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

/** Danger level of snake species */
export type DangerLevel =
  | 'HARMLESS'
  | 'HIGHLY_DANGEROUS'
  | 'MEDICALLY_SIGNIFICANT'
  | 'MILDLY_VENOMOUS'
  | '%future added value';

/** Dashboard statistics overview */
export type DashboardStats = {
  __typename?: 'DashboardStats';
  activeRescues: Scalars['Int']['output'];
  activeVolunteers: Scalars['Int']['output'];
  averageResponseTime: Scalars['Int']['output'];
  completedRescues: Scalars['Int']['output'];
  completionRate: Scalars['Float']['output'];
  donationTrend: TrendData;
  recentDonations: Array<Donation>;
  recentRescues: Array<RescueRequest>;
  rescueTrend: TrendData;
  totalDonationAmount: Scalars['Float']['output'];
  totalDonations: Scalars['Float']['output'];
  totalRescues: Scalars['Int']['output'];
  totalSpecies: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  totalVolunteers: Scalars['Int']['output'];
  venomousEncounters: Scalars['Int']['output'];
  verifiedRescuers: Scalars['Int']['output'];
  volunteerTrend: TrendData;
};

export type DateRangeInput = {
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};

export type DistrictAnalytics = {
  __typename?: 'DistrictAnalytics';
  /** Active rescues right now */
  activeRescues: Scalars['Int']['output'];
  /** Available rescuers */
  availableRescuers: Scalars['Int']['output'];
  /** Average response time */
  avgResponseTimeMinutes?: Maybe<Scalars['Float']['output']>;
  /** Completed rescues */
  completedRescues: Scalars['Int']['output'];
  /** Deaths */
  deaths: Scalars['Int']['output'];
  district: Scalars['String']['output'];
  /** Monthly trend */
  monthlyTrend: Array<MonthlyDataPoint>;
  province: Scalars['String']['output'];
  /** Risk level */
  riskLevel?: Maybe<RiskLevel>;
  /** Snakebite cases (envenomation) */
  snakebiteCases: Scalars['Int']['output'];
  /** Success rate */
  successRate?: Maybe<Scalars['Float']['output']>;
  /** Top snake species */
  topSpecies: Array<SpeciesCount>;
  /** Total incidents (all time) */
  totalIncidents: Scalars['Int']['output'];
  /** Treatment center coverage */
  treatmentCenterCoverage?: Maybe<CoverageAnalysis>;
  /** Treatment centers */
  treatmentCenters: Scalars['Int']['output'];
};

export type DistrictResponseTime = {
  __typename?: 'DistrictResponseTime';
  avgResponseTime: Scalars['Float']['output'];
  district: Scalars['String']['output'];
  incidentCount: Scalars['Int']['output'];
  medianResponseTime: Scalars['Float']['output'];
};

/** Donation transaction */
export type Donation = {
  __typename?: 'Donation';
  amount: Scalars['Float']['output'];
  amountUSD?: Maybe<Scalars['Float']['output']>;
  anonymous: Scalars['Boolean']['output'];
  campaign?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  donor?: Maybe<User>;
  donorEmail?: Maybe<Scalars['Email']['output']>;
  donorName: Scalars['String']['output'];
  donorPhone?: Maybe<Scalars['Phone']['output']>;
  gatewayResponse?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  invoiceUrl?: Maybe<Scalars['String']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  paymentGateway: Scalars['String']['output'];
  paymentMethod: PaymentMethod;
  purpose?: Maybe<DonationPurpose>;
  receiptNumber?: Maybe<Scalars['String']['output']>;
  receiptUrl?: Maybe<Scalars['String']['output']>;
  refundAmount?: Maybe<Scalars['Float']['output']>;
  refundReason?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['DateTime']['output']>;
  source: Scalars['String']['output'];
  status: PaymentStatus;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
  verificationNotes?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<User>;
};

/** Donation count by payment method */
export type DonationByMethod = {
  __typename?: 'DonationByMethod';
  count: Scalars['Int']['output'];
  method: PaymentMethod;
  totalAmount: Scalars['Float']['output'];
};

/** Donation count by purpose */
export type DonationByPurpose = {
  __typename?: 'DonationByPurpose';
  count: Scalars['Int']['output'];
  purpose: DonationPurpose;
  totalAmount: Scalars['Float']['output'];
};

/** Connection type for paginated donation results */
export type DonationConnection = {
  __typename?: 'DonationConnection';
  edges: Array<DonationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for donation connection */
export type DonationEdge = {
  __typename?: 'DonationEdge';
  cursor: Scalars['String']['output'];
  node: Donation;
};

/** Filter input for donation queries */
export type DonationFilterInput = {
  anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  donorId?: InputMaybe<Scalars['ID']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  methods?: InputMaybe<Array<PaymentMethod>>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  purpose?: InputMaybe<DonationPurpose>;
  purposes?: InputMaybe<Array<DonationPurpose>>;
  status?: InputMaybe<PaymentStatus>;
  statuses?: InputMaybe<Array<PaymentStatus>>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Donation purpose */
export type DonationPurpose =
  | 'EDUCATION'
  | 'EMERGENCY_FUND'
  | 'EQUIPMENT'
  | 'GENERAL'
  | 'INFRASTRUCTURE'
  | 'MEDICAL'
  | 'RESEARCH'
  | 'TRAINING'
  | '%future added value';

/** Fields available for sorting donations */
export type DonationSortField =
  | 'AMOUNT'
  | 'CREATED_AT'
  | 'DONOR_NAME'
  | 'PAID_AT'
  | '%future added value';

/** Sort input for donation queries */
export type DonationSortInput = {
  field: DonationSortField;
  order: SortOrder;
};

/** Donation statistics */
export type DonationStats = {
  __typename?: 'DonationStats';
  averageDonation: Scalars['Float']['output'];
  byMethod: Array<DonationByMethod>;
  byPurpose: Array<DonationByPurpose>;
  monthlyTrend: Array<MonthlyDonationData>;
  recentDonations: Array<Donation>;
  topDonors: Array<TopDonor>;
  totalAmount: Scalars['Float']['output'];
  totalAmountUSD: Scalars['Float']['output'];
  totalDonations: Scalars['Int']['output'];
};

/** Input for donation statistics */
export type DonationStatsInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  purpose?: InputMaybe<DonationPurpose>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Donation status change event */
export type DonationStatusChangeEvent = {
  __typename?: 'DonationStatusChangeEvent';
  changedAt: Scalars['DateTime']['output'];
  donation: Donation;
  newStatus: PaymentStatus;
  oldStatus: PaymentStatus;
};

/** Email verification response */
export type EmailVerificationPayload = {
  __typename?: 'EmailVerificationPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type EmergencyContact = {
  __typename?: 'EmergencyContact';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['Phone']['output'];
  relationship: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Engagement metrics */
export type EngagementMetrics = {
  __typename?: 'EngagementMetrics';
  avgSessionDuration: Scalars['Int']['output'];
  bounceRate: Scalars['Float']['output'];
  topPages: Array<PageView>;
  totalPageViews: Scalars['Int']['output'];
  uniqueVisitors: Scalars['Int']['output'];
  userGrowth: Array<TimeSeriesPoint>;
};

/** Structured error with code, message, and metadata */
export type Error = {
  __typename?: 'Error';
  /** Machine-readable error code */
  code: ErrorCode;
  /** Field that caused the error (for validation) */
  field?: Maybe<Scalars['String']['output']>;
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Additional error metadata */
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Error severity */
  severity: ErrorSeverity;
};

/** Error code for programmatic handling */
export type ErrorCode =
  | 'ALREADY_EXISTS'
  | 'BUSINESS_RULE_VIOLATION'
  | 'CONFLICT'
  | 'DUPLICATE_ENTRY'
  | 'FORBIDDEN'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'INTERNAL_SERVER_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'OPERATION_NOT_ALLOWED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'REQUIRED_FIELD_MISSING'
  | 'RESOURCE_NOT_FOUND'
  | 'SERVICE_UNAVAILABLE'
  | 'TIMEOUT'
  | 'TOKEN_EXPIRED'
  | 'TOO_MANY_REQUESTS'
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR'
  | '%future added value';

/** Error severity level */
export type ErrorSeverity =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | '%future added value';

/** Experience level of volunteer */
export type ExperienceLevel =
  | 'BEGINNER'
  | 'EXPERT'
  | 'INTERMEDIATE'
  | '%future added value';

/** Input for finding available volunteers */
export type FindAvailableVolunteersInput = {
  lat: Scalars['Latitude']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  lng: Scalars['Longitude']['input'];
  minExperience?: InputMaybe<ExperienceLevel>;
  radiusKm: Scalars['Float']['input'];
  requireEquipment?: InputMaybe<Scalars['Boolean']['input']>;
  requireVehicle?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Category of gallery image */
export type GalleryCategory =
  | 'EDUCATION'
  | 'EVENT'
  | 'HABITAT'
  | 'RESCUE'
  | 'SPECIES'
  | 'TRAINING'
  | 'VOLUNTEER'
  | '%future added value';

/** Gallery image */
export type GalleryImage = {
  __typename?: 'GalleryImage';
  category?: Maybe<GalleryCategory>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dimensions?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  isFeatured: Scalars['Boolean']['output'];
  isPublic: Scalars['Boolean']['output'];
  likes: Scalars['Int']['output'];
  rescue?: Maybe<RescueRequest>;
  rescueId?: Maybe<Scalars['ID']['output']>;
  species?: Maybe<SnakeSpecies>;
  speciesId?: Maybe<Scalars['ID']['output']>;
  tags: Array<Scalars['String']['output']>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  uploader?: Maybe<User>;
  views: Scalars['Int']['output'];
};

/** Connection type for paginated gallery image results */
export type GalleryImageConnection = {
  __typename?: 'GalleryImageConnection';
  edges: Array<GalleryImageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for gallery image connection */
export type GalleryImageEdge = {
  __typename?: 'GalleryImageEdge';
  cursor: Scalars['String']['output'];
  node: GalleryImage;
};

/** Filter input for gallery image queries */
export type GalleryImageFilterInput = {
  categories?: InputMaybe<Array<GalleryCategory>>;
  category?: InputMaybe<GalleryCategory>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  rescueId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  uploaderId?: InputMaybe<Scalars['ID']['input']>;
};

/** Fields available for sorting gallery images */
export type GalleryImageSortField =
  | 'CREATED_AT'
  | 'LIKES'
  | 'TITLE'
  | 'VIEWS'
  | '%future added value';

/** Sort input for gallery image queries */
export type GalleryImageSortInput = {
  field: GalleryImageSortField;
  order: SortOrder;
};

/** Geographic heatmap data */
export type GeographicHeatmap = {
  __typename?: 'GeographicHeatmap';
  intensity: Scalars['Float']['output'];
  lat: Scalars['Latitude']['output'];
  lng: Scalars['Longitude']['output'];
  municipality: Scalars['String']['output'];
  rescueCount: Scalars['Int']['output'];
};

/** Input for geographic heatmap */
export type GeographicHeatmapInput = {
  dateRange?: InputMaybe<AnalyticsDateRangeInput>;
  municipality?: InputMaybe<Scalars['String']['input']>;
};

export type Hospital = {
  __typename?: 'Hospital';
  address: Scalars['String']['output'];
  ambulanceAvailable: Scalars['Boolean']['output'];
  antivenomLastVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  antivenomStatus: AntivenomStatus;
  antivenomStockPublic: Scalars['Boolean']['output'];
  antivenomStockQuantity?: Maybe<Scalars['Int']['output']>;
  antivenomVerificationFreshness: VerificationFreshness;
  antivenomVerifiedBy?: Maybe<Scalars['String']['output']>;
  bedCapacity?: Maybe<Scalars['Int']['output']>;
  bloodBankAvailable: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  distanceFromUser?: Maybe<Scalars['Float']['output']>;
  district: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  emergency24x7: Scalars['Boolean']['output'];
  emergencyAvailable: Scalars['Boolean']['output'];
  emergencyPhone?: Maybe<Scalars['String']['output']>;
  hospitalType?: Maybe<HospitalType>;
  icuAvailable: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  markerColor: Scalars['String']['output'];
  municipality: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  officialTreatmentCenter: Scalars['Boolean']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  province: Scalars['String']['output'];
  recentVerification?: Maybe<HospitalVerification>;
  recommendationScore?: Maybe<Scalars['Float']['output']>;
  snakebiteTreatmentAvailable: Scalars['Boolean']['output'];
  source?: Maybe<Scalars['String']['output']>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  sourceYear?: Maybe<Scalars['String']['output']>;
  specializations: Array<Scalars['String']['output']>;
  status: HospitalStatus;
  treatmentCenterType?: Maybe<TreatmentCenterType>;
  updatedAt: Scalars['DateTime']['output'];
  ventilatorAvailable: Scalars['Boolean']['output'];
  verificationRecords: Array<HospitalVerification>;
  verificationStatus: VerificationStatus;
  ward?: Maybe<Scalars['Int']['output']>;
};

export type HospitalConnection = {
  __typename?: 'HospitalConnection';
  edges: Array<HospitalEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type HospitalEdge = {
  __typename?: 'HospitalEdge';
  cursor: Scalars['String']['output'];
  node: Hospital;
};

export type HospitalFilterInput = {
  antivenomAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  antivenomStatus?: InputMaybe<AntivenomStatus>;
  districts?: InputMaybe<Array<Scalars['String']['input']>>;
  emergency24x7?: InputMaybe<Scalars['Boolean']['input']>;
  hospitalTypes?: InputMaybe<Array<HospitalType>>;
  municipalities?: InputMaybe<Array<Scalars['String']['input']>>;
  officialOnly?: InputMaybe<Scalars['Boolean']['input']>;
  provinces?: InputMaybe<Array<Scalars['String']['input']>>;
  snakebiteTreatmentOnly?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<HospitalStatus>;
  verificationStatus?: InputMaybe<VerificationStatus>;
};

export type HospitalLocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
};

export type HospitalReport = {
  __typename?: 'HospitalReport';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  hospital: Hospital;
  hospitalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reportType: HospitalReportType;
  reportedBy?: Maybe<Scalars['String']['output']>;
  reporterEmail?: Maybe<Scalars['String']['output']>;
  reporterName?: Maybe<Scalars['String']['output']>;
  reporterPhone?: Maybe<Scalars['String']['output']>;
  resolution?: Maybe<Scalars['String']['output']>;
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  resolvedBy?: Maybe<Scalars['String']['output']>;
  status: HospitalReportStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type HospitalReportStatus =
  | 'DISMISSED'
  | 'NEW'
  | 'RESOLVED'
  | 'UNDER_REVIEW'
  | '%future added value';

export type HospitalReportType =
  | 'ANTIVENOM_STATUS_CHANGE'
  | 'CLOSED'
  | 'INCORRECT_INFO'
  | 'OTHER'
  | 'OUTDATED_STATUS'
  | 'WRONG_LOCATION'
  | '%future added value';

export type HospitalSortField =
  | 'CREATED_AT'
  | 'DISTANCE'
  | 'NAME'
  | 'UPDATED_AT'
  | 'VERIFICATION_DATE'
  | '%future added value';

export type HospitalSortInput = {
  direction: SortDirection;
  field: HospitalSortField;
};

export type HospitalStatistics = {
  __typename?: 'HospitalStatistics';
  byProvince: Array<ProvinceHospitalCount>;
  outOfStock: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  verificationCoverage: Scalars['Float']['output'];
  withSnakebiteTreatment: Scalars['Int']['output'];
  withUnknownAntivenom: Scalars['Int']['output'];
  withVerifiedAntivenom: Scalars['Int']['output'];
};

export type HospitalStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PERMANENTLY_CLOSED'
  | 'TEMPORARILY_CLOSED'
  | '%future added value';

export type HospitalType =
  | 'ARMY'
  | 'COMMUNITY'
  | 'GOVERNMENT'
  | 'NGO'
  | 'POLICE'
  | 'PRIVATE'
  | '%future added value';

export type HospitalVerification = {
  __typename?: 'HospitalVerification';
  antivenomQuantity?: Maybe<Scalars['Int']['output']>;
  antivenomStatus?: Maybe<AntivenomStatus>;
  contactDesignation?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  emergencyStatus?: Maybe<Scalars['Boolean']['output']>;
  evidenceUrls: Array<Scalars['String']['output']>;
  hospital: Hospital;
  hospitalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nextVerificationDue?: Maybe<Scalars['DateTime']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  officialDocumentUrl?: Maybe<Scalars['String']['output']>;
  snakebiteTreatment?: Maybe<Scalars['Boolean']['output']>;
  ventilatorStatus?: Maybe<Scalars['Boolean']['output']>;
  verificationDate: Scalars['DateTime']['output'];
  verificationType: VerificationType;
  verifiedBy: Scalars['String']['output'];
};

export type HotspotMapPoint = {
  __typename?: 'HotspotMapPoint';
  caseCount?: Maybe<Scalars['Int']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  geometry: Scalars['GeoJSON']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  populationAtRisk?: Maybe<Scalars['Int']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  riskLevel: RiskLevel;
  riskScore: Scalars['Float']['output'];
  source: Scalars['String']['output'];
  sourceUrl?: Maybe<Scalars['String']['output']>;
  studyYear?: Maybe<Scalars['Int']['output']>;
};

/** Identification count by provider */
export type IdentificationByProvider = {
  __typename?: 'IdentificationByProvider';
  averageConfidence: Scalars['Float']['output'];
  averageResponseTime: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  provider: AiProvider;
};

/** User feedback on AI identification accuracy */
export type IdentificationFeedback =
  | 'CORRECT'
  | 'INCORRECT'
  | 'PARTIAL'
  | 'UNSURE'
  | '%future added value';

/** Identification feedback event */
export type IdentificationFeedbackEvent = {
  __typename?: 'IdentificationFeedbackEvent';
  correctSpecies?: Maybe<SnakeSpecies>;
  feedback: IdentificationFeedback;
  identification: AiIdentification;
  providedAt: Scalars['DateTime']['output'];
  user: User;
};

/** Input for providing feedback on identification */
export type IdentificationFeedbackInput = {
  correctSpeciesId?: InputMaybe<Scalars['ID']['input']>;
  feedback: IdentificationFeedback;
  identificationId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

/** Input for identifying snake from image */
export type IdentifySnakeInput = {
  imageUrl: Scalars['String']['input'];
  includeAlternatives?: InputMaybe<Scalars['Boolean']['input']>;
  minConfidence?: InputMaybe<Scalars['Float']['input']>;
  uploadSource?: InputMaybe<UploadSource>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type IncidentConnection = {
  __typename?: 'IncidentConnection';
  edges: Array<IncidentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IncidentEdge = {
  __typename?: 'IncidentEdge';
  cursor: Scalars['String']['output'];
  node: IncidentMapPoint;
};

export type IncidentFiltersInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  district?: InputMaybe<Scalars['String']['input']>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  priorities?: InputMaybe<Array<Priority>>;
  province?: InputMaybe<Scalars['String']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  statuses?: InputMaybe<Array<IncidentStatus>>;
  types?: InputMaybe<Array<IncidentType>>;
};

export type IncidentMapPoint = {
  __typename?: 'IncidentMapPoint';
  distanceKm?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  municipality?: Maybe<Scalars['String']['output']>;
  priority: Priority;
  reportedAt: Scalars['DateTime']['output'];
  status: IncidentStatus;
  type?: Maybe<IncidentType>;
};

export type IncidentStatus =
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'CANCELLED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | '%future added value';

export type IncidentType =
  | 'OTHER'
  | 'SNAKE_BITE'
  | 'SNAKE_RESCUE'
  | 'SNAKE_SIGHTING'
  | '%future added value';

export type InitiatePaymentInput = {
  amount: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  donationId?: InputMaybe<Scalars['ID']['input']>;
  idempotencyKey: Scalars['String']['input'];
  provider: PaymentProvider;
  rescueChargeId?: InputMaybe<Scalars['ID']['input']>;
  returnUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for user login */
export type LoginInput = {
  email: Scalars['Email']['input'];
  password: Scalars['String']['input'];
};

export type MapBoundsInput = {
  /** Eastern boundary (max longitude) */
  east: Scalars['Float']['input'];
  /** Northern boundary (max latitude) */
  north: Scalars['Float']['input'];
  /** Southern boundary (min latitude) */
  south: Scalars['Float']['input'];
  /** Western boundary (min longitude) */
  west: Scalars['Float']['input'];
};

export type MapFiltersInput = {
  /** Date range filter */
  dateRange?: InputMaybe<DateRangeInput>;
  /** Filter by district */
  district?: InputMaybe<Scalars['String']['input']>;
  /** Filter by incident statuses */
  incidentStatuses?: InputMaybe<Array<IncidentStatus>>;
  /** Filter by incident types */
  incidentTypes?: InputMaybe<Array<IncidentType>>;
  /** Filter by priorities */
  priorities?: InputMaybe<Array<Priority>>;
  /** Filter by province */
  province?: InputMaybe<Scalars['String']['input']>;
  /** Filter by rescuer statuses */
  rescuerStatuses?: InputMaybe<Array<RescuerStatus>>;
  /** Filter by season */
  season?: InputMaybe<Season>;
  /** Show research-based historical hotspots */
  showHistoricalHotspots?: InputMaybe<Scalars['Boolean']['input']>;
  /** Show risk zones */
  showRiskZones?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MapMetadata = {
  __typename?: 'MapMetadata';
  /** Viewport area (sq km) */
  areaKm2?: Maybe<Scalars['Float']['output']>;
  /** Cache status */
  cached: Scalars['Boolean']['output'];
  /** Data freshness (seconds) */
  freshnessSeconds: Scalars['Int']['output'];
  /** When this data was generated */
  generatedAt: Scalars['DateTime']['output'];
};

export type MapOverview = {
  __typename?: 'MapOverview';
  /** Research-based hotspots in viewport */
  hotspots: Array<HotspotMapPoint>;
  /** Incidents in viewport */
  incidents: Array<IncidentMapPoint>;
  /** Metadata about the data */
  metadata: MapMetadata;
  /** Rescuers in viewport */
  rescuers: Array<RescuerMapPoint>;
  /** Risk zones in viewport */
  riskZones: Array<RiskZoneMapPoint>;
  /** Aggregated statistics for viewport */
  statistics: MapStatistics;
  /** Treatment centers in viewport */
  treatmentCenters: Array<TreatmentCenterMapPoint>;
  /** Rescue vehicles in viewport */
  vehicles: Array<VehicleMapPoint>;
};

export type MapStatistics = {
  __typename?: 'MapStatistics';
  /** Active rescues in progress */
  activeRescues: Scalars['Int']['output'];
  /** Available rescuers */
  availableRescuers: Scalars['Int']['output'];
  /** Average response time in minutes */
  avgResponseTimeMinutes?: Maybe<Scalars['Float']['output']>;
  /** Critical/high priority incidents */
  criticalIncidents: Scalars['Int']['output'];
  /** Median response time in minutes */
  medianResponseTimeMinutes?: Maybe<Scalars['Float']['output']>;
  /** Success rate (percentage) */
  successRate?: Maybe<Scalars['Float']['output']>;
  /** Total incidents in viewport */
  totalIncidents: Scalars['Int']['output'];
  /** Treatment centers */
  treatmentCenters: Scalars['Int']['output'];
};

export type MediaAsset = {
  __typename?: 'MediaAsset';
  createdAt: Scalars['DateTime']['output'];
  format?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mediaType: MediaType;
  mimeType: Scalars['String']['output'];
  originalFileName?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  publicId: Scalars['String']['output'];
  resourceType: Scalars['String']['output'];
  sizeBytes?: Maybe<Scalars['Int']['output']>;
  status: MediaStatus;
  updatedAt: Scalars['DateTime']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type MediaStatus =
  | 'DELETED'
  | 'PENDING'
  | 'REJECTED'
  | 'UPLOADED'
  | 'VERIFIED'
  | '%future added value';

export type MediaType =
  | 'RESCUER_PROFILE_IMAGE'
  | 'RESCUER_VERIFICATION_DOCUMENT'
  | '%future added value';

export type MediaUploadSignature = {
  __typename?: 'MediaUploadSignature';
  apiKey: Scalars['String']['output'];
  cloudName: Scalars['String']['output'];
  folder: Scalars['String']['output'];
  mediaId: Scalars['ID']['output'];
  publicId: Scalars['String']['output'];
  resourceType: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  uploadUrl: Scalars['String']['output'];
};

/** Message count by category */
export type MessageByCategory = {
  __typename?: 'MessageByCategory';
  category: MessageCategory;
  count: Scalars['Int']['output'];
  newCount: Scalars['Int']['output'];
};

/** Message count by priority */
export type MessageByPriority = {
  __typename?: 'MessageByPriority';
  count: Scalars['Int']['output'];
  priority: MessagePriority;
};

/** Category of contact message */
export type MessageCategory =
  | 'COMPLAINT'
  | 'DONATION'
  | 'FEEDBACK'
  | 'GENERAL'
  | 'MEDIA'
  | 'PARTNERSHIP'
  | 'RESCUE'
  | 'TECHNICAL'
  | 'VOLUNTEER'
  | '%future added value';

/** Priority of contact message */
export type MessagePriority =
  | 'HIGH'
  | 'LOW'
  | 'NORMAL'
  | 'URGENT'
  | '%future added value';

/** Status of contact message */
export type MessageStatus =
  | 'ARCHIVED'
  | 'CLOSED'
  | 'NEW'
  | 'READ'
  | 'RESPONDED'
  | '%future added value';

export type MonsoonData = {
  __typename?: 'MonsoonData';
  comparisonToAutumn: Scalars['Float']['output'];
  comparisonToSpring: Scalars['Float']['output'];
  /** Comparison to other seasons */
  comparisonToWinter: Scalars['Float']['output'];
  /** Incidents during monsoon */
  incidents: Scalars['Int']['output'];
  /** Percentage of annual total */
  percentage: Scalars['Float']['output'];
};

export type MonthlyDataPoint = {
  __typename?: 'MonthlyDataPoint';
  count: Scalars['Int']['output'];
  deaths?: Maybe<Scalars['Int']['output']>;
  month: Scalars['Int']['output'];
  snakebiteCases?: Maybe<Scalars['Int']['output']>;
  year: Scalars['Int']['output'];
};

/** Monthly donation trend data */
export type MonthlyDonationData = {
  __typename?: 'MonthlyDonationData';
  amount: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  month: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  /**
   * Volunteer accepts rescue from queue (self-service)
   * ATOMIC - prevents race condition when multiple rescuers try to accept same rescue
   */
  acceptFromQueue: RescueRequest;
  /** Volunteer accepts rescue assignment (pre-assigned by admin) */
  acceptRescue: RescueRequest;
  /** Add timeline event to rescue */
  addRescueTimelineEvent: RescueTimeline;
  /** Apply to become a volunteer */
  applyVolunteer: Volunteer;
  /** Archive a blog post */
  archiveBlogPost: BlogPost;
  /** Archive contact message */
  archiveContactMessage: ContactMessage;
  /** Assign rescue to volunteer (admin/coordinator) */
  assignRescue: RescueRequest;
  /** Bulk approve volunteers */
  bulkApproveVolunteers: BulkOperationResult;
  /** Bulk assign rescues to volunteer */
  bulkAssignRescues: BulkOperationResult;
  /** Bulk delete gallery images */
  bulkDeleteGalleryImages: BulkOperationResult;
  bulkImportHospitals: BulkImportResult;
  /** Bulk import snake species */
  bulkImportSnakeSpecies: BulkOperationResult;
  /** Bulk publish blog posts */
  bulkPublishBlogPosts: BulkOperationResult;
  /** Bulk update message status */
  bulkUpdateMessageStatus: BulkOperationResult;
  /** Bulk update rescue status */
  bulkUpdateRescueStatus: BulkOperationResult;
  /** Cancel rescue request */
  cancelRescue: RescueRequest;
  /** Cancel training session */
  cancelTraining: Training;
  /** Cancel training enrollment */
  cancelTrainingEnrollment: Training;
  /** Change password (requires current password) */
  changePassword: ChangePasswordPayload;
  /** Mark rescue as completed */
  completeRescue: RescueRequest;
  /** Mark training as completed (admin) */
  completeTraining: Training;
  confirmMediaUpload: MediaAsset;
  confirmPayment: PaymentIntent;
  /** Create a blog post */
  createBlogPost: BlogPost;
  /** Create a donation */
  createDonation: Donation;
  createHospital: Hospital;
  createMediaUploadSignature: MediaUploadSignature;
  /** Create a notification (admin only) */
  createNotification: Notification;
  createPaymentIntent: PaymentIntent;
  createPayout: Payout;
  /** Create a new rescue request */
  createRescueRequest: RescueRequest;
  /** Create new snake species (admin only) */
  createSnakeSpecies: SnakeSpecies;
  /** Create a training session */
  createTraining: Training;
  /** Delete AI identification */
  deleteAIIdentification: SuccessResponse;
  /** Delete user account (soft delete) */
  deleteAccount: Scalars['Boolean']['output'];
  /** Delete a blog post (soft delete) */
  deleteBlogPost: SuccessResponse;
  /** Delete contact message (soft delete) */
  deleteContactMessage: SuccessResponse;
  /** Delete gallery image (soft delete) */
  deleteGalleryImage: SuccessResponse;
  deleteHospital: Scalars['Boolean']['output'];
  /** Delete notification */
  deleteNotification: SuccessResponse;
  /** Delete all read notifications */
  deleteReadNotifications: SuccessResponse;
  /** Delete rescue request (soft delete, admin only) */
  deleteRescueRequest: SuccessResponse;
  /** Delete snake species (soft delete, admin only) */
  deleteSnakeSpecies: SuccessResponse;
  /** Delete training session (soft delete) */
  deleteTraining: SuccessResponse;
  /** Soft-delete a user account (super admin only) */
  deleteUser: SuccessResponse;
  /** Delete volunteer profile (soft delete) */
  deleteVolunteer: SuccessResponse;
  /** Enroll in training session */
  enrollInTraining: Training;
  /** Request password reset email */
  forgotPassword: PasswordResetTokenPayload;
  /** Generate donation receipt */
  generateDonationReceipt: Donation;
  /** Identify snake from image using AI */
  identifySnake: AiIdentification;
  /** Increment blog post views */
  incrementBlogPostViews: BlogPost;
  /** Increment gallery image views */
  incrementGalleryImageViews: GalleryImage;
  initiatePayment: PaymentIntentCheckout;
  /** Like a blog post */
  likeBlogPost: BlogPost;
  /** Like a gallery image */
  likeGalleryImage: GalleryImage;
  /** Login with email and password */
  login: AuthPayload;
  /** Logout current user (invalidates refresh token) */
  logout: Scalars['Boolean']['output'];
  /** Mark all notifications as read */
  markAllNotificationsAsRead: SuccessResponse;
  /** Mark message as read */
  markMessageAsRead: ContactMessage;
  /** Mark notification as read */
  markNotificationAsRead: Notification;
  /** Login with OAuth provider (Google) */
  oauthLogin: AuthPayload;
  /** Process payment (callback from gateway) */
  processPayment: Donation;
  /** Provide feedback on AI identification */
  provideIdentificationFeedback: AiIdentification;
  /** Publish a blog post */
  publishBlogPost: BlogPost;
  /** Rate volunteer after rescue completion */
  rateVolunteer: Volunteer;
  /** Reactivate suspended volunteer */
  reactivateVolunteer: Volunteer;
  /** Refresh analytics cache */
  refreshAnalyticsCache: SuccessResponse;
  /** Refresh access token using refresh token cookie */
  refreshToken: AuthPayload;
  /** Refund donation (admin) */
  refundDonation: Donation;
  refundPayment: Refund;
  /** Register a new user account (returns user data only, no auth tokens until email verification + login) */
  register: RegistrationPayload;
  /** Reopen cancelled/closed rescue */
  reopenRescue: RescueRequest;
  reportHospitalInformation: HospitalReport;
  /** Reprocess identification with different model */
  reprocessIdentification: AiIdentification;
  /** Resend email verification */
  resendVerification: Scalars['Boolean']['output'];
  /** Reset password with token */
  resetPassword: Scalars['Boolean']['output'];
  resolveHospitalReport: HospitalReport;
  /** Respond to a contact message */
  respondToMessage: ContactMessage;
  /** Approve or reject volunteer application */
  reviewVolunteerApplication: Volunteer;
  saveEmergencyContact: EmergencyContact;
  /** Send bulk notifications (admin only) */
  sendBulkNotifications: BulkOperationResult;
  startPayment: PaymentIntentCheckout;
  /** Submit a contact message */
  submitContactMessage: ContactMessage;
  /** Suspend volunteer */
  suspendVolunteer: Volunteer;
  /** Test notification delivery */
  testNotificationDelivery: SuccessResponse;
  /** Track page view */
  trackPageView: SuccessResponse;
  transitionPayout: Payout;
  /** Update AI model configuration (admin only) */
  updateAIModelConfig: AiModelConfig;
  updateAdminSettings: AdminSettings;
  updateAntivenomStock: Hospital;
  /** Update a blog post */
  updateBlogPost: BlogPost;
  /** Update gallery image */
  updateGalleryImage: GalleryImage;
  updateHospital: Hospital;
  /** Update message status */
  updateMessageStatus: ContactMessage;
  /** Update notification preferences */
  updateNotificationPreferences: NotificationPreferences;
  /** Update payment gateway configuration */
  updatePaymentGateway: PaymentGatewayConfig;
  /** Update user profile */
  updateProfile: User;
  /** Update rescue progress (volunteer) */
  updateRescueProgress: RescueRequest;
  /** Update a rescue request */
  updateRescueRequest: RescueRequest;
  /** Update snake species (admin only) */
  updateSnakeSpecies: SnakeSpecies;
  /** Update a training session */
  updateTraining: Training;
  /** Update a user's account status (admin only) */
  updateUserStatus: User;
  /** Update volunteer availability status */
  updateVolunteerAvailability: Volunteer;
  /** Update volunteer profile */
  updateVolunteerProfile: Volunteer;
  /** Update volunteer zone assignment */
  updateVolunteerZone: Volunteer;
  /** Upload gallery image */
  uploadGalleryImage: GalleryImage;
  verifyAntivenomStatus: Hospital;
  /** Verify donation (admin) */
  verifyDonation: Donation;
  /** Verify email address with token */
  verifyEmail: EmailVerificationPayload;
  verifyHospitalCapability: Hospital;
  /** Verify completed rescue (admin) */
  verifyRescue: RescueRequest;
  /** Verify snake species (admin only) */
  verifySnakeSpecies: SnakeSpecies;
  /** Verify volunteer (upgrade to verified rescuer) */
  verifyVolunteer: Volunteer;
};

export type MutationAcceptFromQueueArgs = {
  input: AcceptRescueInput;
};

export type MutationAcceptRescueArgs = {
  input: AcceptRescueInput;
};

export type MutationAddRescueTimelineEventArgs = {
  input: AddTimelineEventInput;
};

export type MutationApplyVolunteerArgs = {
  input: ApplyVolunteerInput;
};

export type MutationArchiveBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export type MutationArchiveContactMessageArgs = {
  messageId: Scalars['ID']['input'];
};

export type MutationAssignRescueArgs = {
  input: AssignRescueInput;
};

export type MutationBulkApproveVolunteersArgs = {
  volunteerIds: Array<Scalars['ID']['input']>;
};

export type MutationBulkAssignRescuesArgs = {
  rescueIds: Array<Scalars['ID']['input']>;
  volunteerId: Scalars['ID']['input'];
};

export type MutationBulkDeleteGalleryImagesArgs = {
  ids: Array<Scalars['ID']['input']>;
};

export type MutationBulkImportHospitalsArgs = {
  hospitals: Array<CreateHospitalInput>;
  source: Scalars['String']['input'];
};

export type MutationBulkImportSnakeSpeciesArgs = {
  species: Array<CreateSnakeSpeciesInput>;
};

export type MutationBulkPublishBlogPostsArgs = {
  ids: Array<Scalars['ID']['input']>;
};

export type MutationBulkUpdateMessageStatusArgs = {
  messageIds: Array<Scalars['ID']['input']>;
  status: MessageStatus;
};

export type MutationBulkUpdateRescueStatusArgs = {
  rescueIds: Array<Scalars['ID']['input']>;
  status: RescueStatus;
};

export type MutationCancelRescueArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  rescueId: Scalars['ID']['input'];
};

export type MutationCancelTrainingArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  trainingId: Scalars['ID']['input'];
};

export type MutationCancelTrainingEnrollmentArgs = {
  trainingId: Scalars['ID']['input'];
};

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};

export type MutationCompleteRescueArgs = {
  input: CompleteRescueInput;
};

export type MutationCompleteTrainingArgs = {
  trainingId: Scalars['ID']['input'];
};

export type MutationConfirmMediaUploadArgs = {
  mediaId: Scalars['ID']['input'];
};

export type MutationConfirmPaymentArgs = {
  input: ConfirmPaymentInput;
};

export type MutationCreateBlogPostArgs = {
  input: CreateBlogPostInput;
};

export type MutationCreateDonationArgs = {
  input: CreateDonationInput;
};

export type MutationCreateHospitalArgs = {
  input: CreateHospitalInput;
};

export type MutationCreateMediaUploadSignatureArgs = {
  input: CreateMediaUploadSignatureInput;
};

export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};

export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
};

export type MutationCreatePayoutArgs = {
  input: CreatePayoutInput;
};

export type MutationCreateRescueRequestArgs = {
  input: CreateRescueRequestInput;
};

export type MutationCreateSnakeSpeciesArgs = {
  input: CreateSnakeSpeciesInput;
};

export type MutationCreateTrainingArgs = {
  input: CreateTrainingInput;
};

export type MutationDeleteAiIdentificationArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteAccountArgs = {
  password: Scalars['String']['input'];
};

export type MutationDeleteBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteContactMessageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteGalleryImageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteHospitalArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteNotificationArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteRescueRequestArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteSnakeSpeciesArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteTrainingArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};

export type MutationDeleteVolunteerArgs = {
  volunteerId: Scalars['ID']['input'];
};

export type MutationEnrollInTrainingArgs = {
  trainingId: Scalars['ID']['input'];
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};

export type MutationGenerateDonationReceiptArgs = {
  donationId: Scalars['ID']['input'];
};

export type MutationIdentifySnakeArgs = {
  input: IdentifySnakeInput;
};

export type MutationIncrementBlogPostViewsArgs = {
  id: Scalars['ID']['input'];
};

export type MutationIncrementGalleryImageViewsArgs = {
  id: Scalars['ID']['input'];
};

export type MutationInitiatePaymentArgs = {
  input: InitiatePaymentInput;
};

export type MutationLikeBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export type MutationLikeGalleryImageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationMarkMessageAsReadArgs = {
  messageId: Scalars['ID']['input'];
};

export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};

export type MutationOauthLoginArgs = {
  input: OAuthLoginInput;
};

export type MutationProcessPaymentArgs = {
  input: ProcessPaymentInput;
};

export type MutationProvideIdentificationFeedbackArgs = {
  input: IdentificationFeedbackInput;
};

export type MutationPublishBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export type MutationRateVolunteerArgs = {
  communication?: InputMaybe<Scalars['Int']['input']>;
  feedback?: InputMaybe<Scalars['String']['input']>;
  professionalism?: InputMaybe<Scalars['Int']['input']>;
  rating: Scalars['Int']['input'];
  rescueId: Scalars['ID']['input'];
  responseSpeed?: InputMaybe<Scalars['Int']['input']>;
  safetyHandling?: InputMaybe<Scalars['Int']['input']>;
  volunteerId: Scalars['ID']['input'];
};

export type MutationReactivateVolunteerArgs = {
  volunteerId: Scalars['ID']['input'];
};

export type MutationRefundDonationArgs = {
  input: RefundDonationInput;
};

export type MutationRefundPaymentArgs = {
  input: RefundPaymentInput;
};

export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationReopenRescueArgs = {
  rescueId: Scalars['ID']['input'];
};

export type MutationReportHospitalInformationArgs = {
  input: CreateHospitalReportInput;
};

export type MutationReprocessIdentificationArgs = {
  identificationId: Scalars['ID']['input'];
  provider: AiProvider;
};

export type MutationResendVerificationArgs = {
  input: ResendVerificationInput;
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type MutationResolveHospitalReportArgs = {
  input: ResolveHospitalReportInput;
};

export type MutationRespondToMessageArgs = {
  input: RespondToMessageInput;
};

export type MutationReviewVolunteerApplicationArgs = {
  input: ReviewVolunteerInput;
};

export type MutationSaveEmergencyContactArgs = {
  input: SaveEmergencyContactInput;
};

export type MutationSendBulkNotificationsArgs = {
  input: BulkNotificationInput;
};

export type MutationStartPaymentArgs = {
  input: StartPaymentInput;
};

export type MutationSubmitContactMessageArgs = {
  input: SubmitContactMessageInput;
};

export type MutationSuspendVolunteerArgs = {
  reason: Scalars['String']['input'];
  volunteerId: Scalars['ID']['input'];
};

export type MutationTestNotificationDeliveryArgs = {
  channel: NotificationChannel;
};

export type MutationTrackPageViewArgs = {
  duration?: InputMaybe<Scalars['Int']['input']>;
  page: Scalars['String']['input'];
};

export type MutationTransitionPayoutArgs = {
  input: TransitionPayoutInput;
};

export type MutationUpdateAiModelConfigArgs = {
  input: UpdateAiModelConfigInput;
};

export type MutationUpdateAdminSettingsArgs = {
  input: AdminSettingsInput;
};

export type MutationUpdateAntivenomStockArgs = {
  hospitalId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
};

export type MutationUpdateBlogPostArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBlogPostInput;
};

export type MutationUpdateGalleryImageArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGalleryImageInput;
};

export type MutationUpdateHospitalArgs = {
  id: Scalars['ID']['input'];
  input: UpdateHospitalInput;
};

export type MutationUpdateMessageStatusArgs = {
  input: UpdateMessageStatusInput;
};

export type MutationUpdateNotificationPreferencesArgs = {
  input: UpdateNotificationPreferencesInput;
};

export type MutationUpdatePaymentGatewayArgs = {
  input: UpdatePaymentGatewayInput;
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationUpdateRescueProgressArgs = {
  input: UpdateRescueProgressInput;
};

export type MutationUpdateRescueRequestArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRescueRequestInput;
};

export type MutationUpdateSnakeSpeciesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSnakeSpeciesInput;
};

export type MutationUpdateTrainingArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTrainingInput;
};

export type MutationUpdateUserStatusArgs = {
  status: UserStatus;
  userId: Scalars['ID']['input'];
};

export type MutationUpdateVolunteerAvailabilityArgs = {
  input: UpdateVolunteerAvailabilityInput;
};

export type MutationUpdateVolunteerProfileArgs = {
  input: UpdateVolunteerInput;
};

export type MutationUpdateVolunteerZoneArgs = {
  volunteerId: Scalars['ID']['input'];
  zone: Scalars['String']['input'];
};

export type MutationUploadGalleryImageArgs = {
  input: UploadGalleryImageInput;
};

export type MutationVerifyAntivenomStatusArgs = {
  input: VerifyAntivenomInput;
};

export type MutationVerifyDonationArgs = {
  donationId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

export type MutationVerifyHospitalCapabilityArgs = {
  input: VerifyHospitalCapabilityInput;
};

export type MutationVerifyRescueArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  rescueId: Scalars['ID']['input'];
};

export type MutationVerifySnakeSpeciesArgs = {
  id: Scalars['ID']['input'];
};

export type MutationVerifyVolunteerArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  volunteerId: Scalars['ID']['input'];
};

/** Standard mutation response with errors */
export type MutationResponse = {
  /** List of errors if operation failed */
  errors?: Maybe<Array<Error>>;
  /** Human-readable message */
  message?: Maybe<Scalars['String']['output']>;
  /** Operation succeeded */
  success: Scalars['Boolean']['output'];
};

/** Nearby rescue requests (for duplicate detection) */
export type NearbyRescue = {
  __typename?: 'NearbyRescue';
  distance: Scalars['Float']['output'];
  rescue: RescueRequest;
};

/** Input for searching nearby rescues */
export type NearbyRescuesInput = {
  lat: Scalars['Latitude']['input'];
  lng: Scalars['Longitude']['input'];
  radiusKm: Scalars['Float']['input'];
  status?: InputMaybe<RescueStatus>;
  withinHours?: InputMaybe<Scalars['Int']['input']>;
};

export type NearestFacility = {
  __typename?: 'NearestFacility';
  distance: Scalars['Float']['output'];
  hospital: Hospital;
  recommendationReason?: Maybe<Scalars['String']['output']>;
  travelTimeEstimate: Scalars['String']['output'];
};

/** User notification */
export type Notification = {
  __typename?: 'Notification';
  actionUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  priority: NotificationPriority;
  read: Scalars['Boolean']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  rescue?: Maybe<RescueRequest>;
  sentViaApp: Scalars['Boolean']['output'];
  sentViaEmail: Scalars['Boolean']['output'];
  sentViaSMS: Scalars['Boolean']['output'];
  sentViaTelegram: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: NotificationType;
  user: User;
};

/** Notification count by priority */
export type NotificationByPriority = {
  __typename?: 'NotificationByPriority';
  count: Scalars['Int']['output'];
  priority: NotificationPriority;
};

/** Notification count by type */
export type NotificationByType = {
  __typename?: 'NotificationByType';
  count: Scalars['Int']['output'];
  type: NotificationType;
  unreadCount: Scalars['Int']['output'];
};

/** Delivery channel for notification */
export type NotificationChannel =
  | 'APP'
  | 'EMAIL'
  | 'PUSH'
  | 'SMS'
  | 'TELEGRAM'
  | '%future added value';

/** Connection type for paginated notification results */
export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Notification delivery statistics */
export type NotificationDeliveryStats = {
  __typename?: 'NotificationDeliveryStats';
  app: Scalars['Int']['output'];
  email: Scalars['Int']['output'];
  sms: Scalars['Int']['output'];
  telegram: Scalars['Int']['output'];
  totalDelivered: Scalars['Int']['output'];
  totalFailed: Scalars['Int']['output'];
};

/** Edge type for notification connection */
export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String']['output'];
  node: Notification;
};

/** Filter input for notification queries */
export type NotificationFilterInput = {
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  priorities?: InputMaybe<Array<NotificationPriority>>;
  priority?: InputMaybe<NotificationPriority>;
  read?: InputMaybe<Scalars['Boolean']['input']>;
  rescueId?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<NotificationType>;
  types?: InputMaybe<Array<NotificationType>>;
};

/** Notification preferences */
export type NotificationPreferences = {
  __typename?: 'NotificationPreferences';
  dailySummaryReports: Scalars['Boolean']['output'];
  donationReceipts: Scalars['Boolean']['output'];
  enableApp: Scalars['Boolean']['output'];
  enableEmail: Scalars['Boolean']['output'];
  enableSMS: Scalars['Boolean']['output'];
  enableTelegram: Scalars['Boolean']['output'];
  highPriorityRescueAlerts: Scalars['Boolean']['output'];
  newUserRegistrations: Scalars['Boolean']['output'];
  quietHoursEnd?: Maybe<Scalars['String']['output']>;
  quietHoursStart?: Maybe<Scalars['String']['output']>;
  rescueCompletionNotifications: Scalars['Boolean']['output'];
  rescueUpdates: Scalars['Boolean']['output'];
  systemAlerts: Scalars['Boolean']['output'];
  systemAnnouncements: Scalars['Boolean']['output'];
  timezone: Scalars['String']['output'];
  trainingReminders: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
  volunteerUpdates: Scalars['Boolean']['output'];
};

/** Input for updating notification preferences */
export type NotificationPreferencesInput = {
  emailNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  rescueUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  smsNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  systemAnnouncements?: InputMaybe<Scalars['Boolean']['input']>;
  telegramNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  volunteerUpdates?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Priority level of notification */
export type NotificationPriority =
  | 'HIGH'
  | 'LOW'
  | 'NORMAL'
  | 'URGENT'
  | '%future added value';

/** Notification read event */
export type NotificationReadEvent = {
  __typename?: 'NotificationReadEvent';
  notification: Notification;
  readAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

/** Fields available for sorting notifications */
export type NotificationSortField =
  | 'CREATED_AT'
  | 'PRIORITY'
  | 'READ_AT'
  | 'TYPE'
  | '%future added value';

/** Sort input for notification queries */
export type NotificationSortInput = {
  field: NotificationSortField;
  order: SortOrder;
};

/** Notification statistics */
export type NotificationStats = {
  __typename?: 'NotificationStats';
  byPriority: Array<NotificationByPriority>;
  byType: Array<NotificationByType>;
  deliveryStats: NotificationDeliveryStats;
  total: Scalars['Int']['output'];
  unread: Scalars['Int']['output'];
};

/** Type of notification */
export type NotificationType =
  | 'ANNOUNCEMENT'
  | 'DONATION_RECEIVED'
  | 'RESCUE_ACCEPTED'
  | 'RESCUE_ASSIGNED'
  | 'RESCUE_CANCELLED'
  | 'RESCUE_COMPLETED'
  | 'RESCUE_CREATED'
  | 'SYSTEM_ALERT'
  | 'TRAINING_REMINDER'
  | 'TRAINING_SCHEDULED'
  | 'VOLUNTEER_APPROVED'
  | 'VOLUNTEER_REJECTED'
  | '%future added value';

/** Input for OAuth (Google) login */
export type OAuthLoginInput = {
  email?: InputMaybe<Scalars['Email']['input']>;
  googleId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue */
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** Page view statistics */
export type PageView = {
  __typename?: 'PageView';
  avgDuration: Scalars['Int']['output'];
  page: Scalars['String']['output'];
  uniqueViews: Scalars['Int']['output'];
  views: Scalars['Int']['output'];
};

/** Generic pagination input */
export type PaginationInput = {
  /** Number of items to return (max 100) */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page number (1-indexed) */
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for password reset request */
export type PasswordResetRequestInput = {
  email: Scalars['Email']['input'];
};

/** Password reset token response */
export type PasswordResetTokenPayload = {
  __typename?: 'PasswordResetTokenPayload';
  expiresAt: Scalars['DateTime']['output'];
  message: Scalars['String']['output'];
};

/** Payment gateway configuration */
export type PaymentGatewayConfig = {
  __typename?: 'PaymentGatewayConfig';
  currencies: Array<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  maxAmount?: Maybe<Scalars['Float']['output']>;
  method: PaymentMethod;
  minAmount?: Maybe<Scalars['Float']['output']>;
  testMode: Scalars['Boolean']['output'];
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  amount: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  donationId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  idempotencyKey: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  providerReference?: Maybe<Scalars['String']['output']>;
  rescueChargeId?: Maybe<Scalars['ID']['output']>;
  status: PaymentIntentStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type PaymentIntentCheckout = {
  __typename?: 'PaymentIntentCheckout';
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  paymentIntent: PaymentIntent;
  providerReference: Scalars['String']['output'];
};

export type PaymentIntentStatus =
  | 'AUTHORIZED'
  | 'CANCELLED'
  | 'CREATED'
  | 'FAILED'
  | 'REQUIRES_ACTION'
  | 'SUCCEEDED'
  | '%future added value';

/** Payment method */
export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'ESEWA'
  | 'FONEPAY'
  | 'IME_PAY'
  | 'KHALTI'
  | 'PAYPAL'
  | 'STRIPE'
  | '%future added value';

export type PaymentProvider =
  | 'ESEWA'
  | 'KHALTI'
  | 'STRIPE'
  | '%future added value';

/** Payment status */
export type PaymentStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'REFUNDED'
  | '%future added value';

export type Payout = {
  __typename?: 'Payout';
  amount: Scalars['String']['output'];
  citizenName: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  externalReference?: Maybe<Scalars['String']['output']>;
  failedAt?: Maybe<Scalars['DateTime']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paymentMethod?: Maybe<Scalars['String']['output']>;
  processedAt?: Maybe<Scalars['DateTime']['output']>;
  requestedAt: Scalars['DateTime']['output'];
  rescuerId: Scalars['ID']['output'];
  rescuerName: Scalars['String']['output'];
  settlementId: Scalars['ID']['output'];
  status: PayoutStatus;
};

export type PayoutConnection = {
  __typename?: 'PayoutConnection';
  edges: Array<PayoutEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PayoutEdge = {
  __typename?: 'PayoutEdge';
  cursor: Scalars['String']['output'];
  node: Payout;
};

export type PayoutStatus =
  | 'APPROVED'
  | 'CANCELLED'
  | 'FAILED'
  | 'PAID'
  | 'PENDING'
  | 'PROCESSING'
  | 'REJECTED'
  | '%future added value';

/** Category of blog post */
export type PostCategory =
  | 'ANNOUNCEMENT'
  | 'EDUCATION'
  | 'EVENT'
  | 'GUIDE'
  | 'NEWS'
  | 'RESEARCH'
  | 'SUCCESS_STORY'
  | '%future added value';

/** Status of blog post */
export type PostStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | '%future added value';

export type Priority =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | '%future added value';

/** Input for processing payment */
export type ProcessPaymentInput = {
  donationId: Scalars['ID']['input'];
  gatewayResponse?: InputMaybe<Scalars['JSON']['input']>;
  transactionId: Scalars['String']['input'];
};

export type ProvinceHospitalCount = {
  __typename?: 'ProvinceHospitalCount';
  count: Scalars['Int']['output'];
  province: Scalars['String']['output'];
  withAntivenom: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  /** Get active rescues (in progress) */
  activeRescues: RescueRequestConnection;
  adminSettings: AdminSettings;
  /** Get AI identification by ID */
  aiIdentification?: Maybe<AiIdentification>;
  /** Get AI identification statistics */
  aiIdentificationStats: AiIdentificationStats;
  /** List AI identifications */
  aiIdentifications: AiIdentificationConnection;
  /** Get AI model configuration */
  aiModelConfig?: Maybe<AiModelConfig>;
  /** List all snake species */
  allSnakeSpecies: SnakeSpeciesConnection;
  assignedRescuePaymentIntent?: Maybe<PaymentIntent>;
  /** Get available AI models */
  availableAIModels: Array<AiModelConfig>;
  /** Get available payment gateways */
  availablePaymentGateways: Array<PaymentGatewayConfig>;
  /**
   * Get available rescues for queue (rescuer can self-accept)
   * Shows PENDING unassigned rescues sorted by priority and age
   */
  availableRescues: RescueRequestConnection;
  /** Find available volunteers near location */
  availableVolunteers: Array<AvailableVolunteer>;
  /** Get blog post by ID or slug */
  blogPost?: Maybe<BlogPost>;
  /** List blog posts */
  blogPosts: BlogPostConnection;
  /** Check if email is available for registration */
  checkEmailAvailability: Scalars['Boolean']['output'];
  /** Get CMS statistics */
  cmsStats: CmsStats;
  /** Get contact message by ID */
  contactMessage?: Maybe<ContactMessage>;
  /** Get contact message statistics */
  contactMessageStats: ContactMessageStats;
  /** List contact messages */
  contactMessages: ContactMessageConnection;
  /** Get dashboard statistics */
  dashboardStats: DashboardStats;
  /**
   * Get district-level analytics
   * Comprehensive statistics for a single district
   */
  districtAnalytics: DistrictAnalytics;
  /** Get donation by ID */
  donation?: Maybe<Donation>;
  /** Get donation statistics */
  donationStats: DonationStats;
  /** List donations */
  donations: DonationConnection;
  /** Count of active emergency requests for the current dashboard role */
  emergencyRescuesCount: Scalars['Int']['output'];
  /** Get engagement metrics */
  engagementMetrics: EngagementMetrics;
  /** Export analytics data (CSV/JSON) */
  exportAnalytics: Scalars['String']['output'];
  /** Get featured gallery images (public) */
  featuredGalleryImages: GalleryImageConnection;
  /** Get gallery image by ID */
  galleryImage?: Maybe<GalleryImage>;
  /** List gallery images */
  galleryImages: GalleryImageConnection;
  /** Get geographic heatmap data */
  geographicHeatmap: Array<GeographicHeatmap>;
  /**
   * Get route between two points
   * Uses multi-provider routing (OSRM/ORS)
   */
  getRoute: Route;
  getSecureMediaUrl: Scalars['String']['output'];
  /**
   * Get historical snakebite cases for analysis
   * Research data clearly separated from live SnakeSOS data
   */
  historicalCases: SnakebiteCaseConnection;
  hospital?: Maybe<Hospital>;
  hospitalReports: Array<HospitalReport>;
  hospitalStatistics: HospitalStatistics;
  hospitalStats: HospitalStatistics;
  hospitalVerifications: Array<HospitalVerification>;
  hospitals: HospitalConnection;
  hospitalsByDistrict: HospitalConnection;
  hospitalsByProvince: HospitalConnection;
  hospitalsNeedingVerification: HospitalConnection;
  /**
   * Get incidents within viewport or radius
   * Supports clustering and aggregation
   */
  incidents: IncidentConnection;
  /**
   * Get comprehensive map overview for current viewport
   * Optimized single query for admin intelligence map
   * Returns incidents, rescuers, treatment centers, hotspots within bounds
   */
  mapOverview: MapOverview;
  /** Get current authenticated user */
  me?: Maybe<User>;
  /** Get activity logs for current user */
  myActivityLogs: ActivityLogConnection;
  /** Get assigned rescues (volunteer view) */
  myAssignedRescues: RescueRequestConnection;
  /** Get my donations */
  myDonations: DonationConnection;
  myEmergencyContact?: Maybe<EmergencyContact>;
  /** Get my identification history */
  myIdentificationHistory: AiIdentificationConnection;
  /** Get notification preferences */
  myNotificationPreferences: NotificationPreferences;
  /** Get my notifications */
  myNotifications: NotificationConnection;
  myPayouts: PayoutConnection;
  myRescuePaymentIntent?: Maybe<PaymentIntent>;
  /** Get my rescue requests (citizen view) */
  myRescueRequests: RescueRequestConnection;
  mySettlements: SettlementConnection;
  /** Get my enrolled trainings */
  myTrainings: TrainingConnection;
  /** Get my volunteer profile */
  myVolunteerProfile?: Maybe<Volunteer>;
  nearbyHospitals: Array<NearestFacility>;
  /**
   * Find nearby rescuers within radius
   * Returns available or all rescuers based on filter
   */
  nearbyRescuers: Array<RescuerMapPoint>;
  /** Find nearby rescue requests (for duplicate detection) */
  nearbyRescues: Array<NearbyRescue>;
  /**
   * Find nearby treatment centers ranked by accessibility
   * Considers: distance, travel time, antivenom status, capabilities
   */
  nearbyTreatmentCenters: Array<TreatmentCenterMapPoint>;
  nearestSnakebiteFacilities: Array<NearestFacility>;
  nearestVerifiedAntivenomFacility?: Maybe<NearestFacility>;
  /** Get new contact messages count */
  newContactMessagesCount: Scalars['Int']['output'];
  /** Get notification by ID */
  notification?: Maybe<Notification>;
  /** Get notification statistics */
  notificationStats: NotificationStats;
  /** Get payment gateway configuration */
  paymentGatewayConfig?: Maybe<PaymentGatewayConfig>;
  paymentIntent?: Maybe<PaymentIntent>;
  payout?: Maybe<Payout>;
  payouts: Array<Payout>;
  /** Get pending rescues count */
  pendingRescuesCount: Scalars['Int']['output'];
  /** Get pending volunteer applications */
  pendingVolunteerApplications: VolunteerConnection;
  /** Get published blog posts (public) */
  publishedBlogPosts: BlogPostConnection;
  /**
   * Rank treatment centers by accessibility for emergency
   * Uses routing to calculate real travel time, not just distance
   */
  rankTreatmentCenters: Array<RankedTreatmentCenter>;
  recommendedHospitals: Array<NearestFacility>;
  /** Get rescue analytics */
  rescueAnalytics: RescueAnalytics;
  /** Get rescue request by ID */
  rescueRequest?: Maybe<RescueRequest>;
  /** List rescue requests */
  rescueRequests: RescueRequestConnection;
  /** Get rescue statistics */
  rescueStats: RescueStats;
  /** Get rescue timeline */
  rescueTimeline: Array<RescueTimeline>;
  /**
   * Get response time analytics
   * Performance metrics for rescue operations
   */
  responseAnalytics: ResponseAnalytics;
  /**
   * Get risk zones within bounds
   * Aggregated risk analysis by district/municipality
   */
  riskZones: Array<RiskZone>;
  /** Search blog posts */
  searchBlogPosts: BlogPostConnection;
  searchHospitals: Array<Hospital>;
  /** Search rescue requests */
  searchRescues: RescueRequestConnection;
  /** Search snake species */
  searchSnakeSpecies: SnakeSpeciesConnection;
  /** Search users by name or email */
  searchUsers: UserConnection;
  /** Search volunteers */
  searchVolunteers: VolunteerConnection;
  /**
   * Get seasonal analytics
   * Shows monthly/seasonal patterns
   */
  seasonalAnalytics: SeasonalAnalytics;
  settlement?: Maybe<Settlement>;
  settlements: Array<Settlement>;
  /** Get snake species by ID */
  snakeSpecies?: Maybe<SnakeSpecies>;
  /** Get snake species by region */
  snakeSpeciesByRegion: SnakeSpeciesConnection;
  /**
   * Get snake species distribution map
   * Shows where species have been observed
   */
  snakeSpeciesDistribution: Array<SpeciesMapPoint>;
  /** Get snake species statistics */
  snakeSpeciesStats: SnakeSpeciesStats;
  /**
   * Get research-based snakebite hotspots within bounds
   * Clearly labeled as research data with source citations
   */
  snakebiteHotspots: Array<SnakebiteHotspot>;
  /** Get snake species by danger level */
  snakesByDangerLevel: SnakeSpeciesConnection;
  /**
   * Check Stripe connection status (DEVELOPMENT ONLY)
   * This query is only available in non-production environments
   */
  stripeConnectionStatus: StripeConnectionStatus;
  /** Get training session by ID */
  training?: Maybe<Training>;
  /** Get training statistics */
  trainingStats: TrainingStats;
  /** List training sessions */
  trainings: TrainingConnection;
  /** Get unread notifications count */
  unreadNotificationsCount: Scalars['Int']['output'];
  /** Get upcoming training sessions (public) */
  upcomingTrainings: TrainingConnection;
  /** Get user by ID (admin or self only) */
  user?: Maybe<User>;
  /** Get user profile by ID (public) */
  userProfile?: Maybe<UserProfile>;
  /** List all users (admin only) */
  users: UserConnection;
  /** Get venomous snake species */
  venomousSnakes: SnakeSpeciesConnection;
  /** Get volunteer by ID */
  volunteer?: Maybe<Volunteer>;
  /** Get volunteer analytics */
  volunteerAnalytics: VolunteerAnalytics;
  /** Get volunteer statistics */
  volunteerStats: VolunteerStats;
  /** List all volunteers */
  volunteers: VolunteerConnection;
};

export type QueryActiveRescuesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryAiIdentificationArgs = {
  id: Scalars['ID']['input'];
};

export type QueryAiIdentificationsArgs = {
  filter?: InputMaybe<AiIdentificationFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<AiIdentificationSortInput>;
};

export type QueryAiModelConfigArgs = {
  provider: AiProvider;
};

export type QueryAllSnakeSpeciesArgs = {
  filter?: InputMaybe<SnakeSpeciesFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SnakeSpeciesSortInput>;
};

export type QueryAssignedRescuePaymentIntentArgs = {
  rescueId: Scalars['ID']['input'];
};

export type QueryAvailableRescuesArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryAvailableVolunteersArgs = {
  input: FindAvailableVolunteersInput;
};

export type QueryBlogPostArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type QueryBlogPostsArgs = {
  filter?: InputMaybe<BlogPostFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<BlogPostSortInput>;
};

export type QueryCheckEmailAvailabilityArgs = {
  email: Scalars['Email']['input'];
};

export type QueryContactMessageArgs = {
  id: Scalars['ID']['input'];
};

export type QueryContactMessagesArgs = {
  filter?: InputMaybe<ContactMessageFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<ContactMessageSortInput>;
};

export type QueryDashboardStatsArgs = {
  period?: InputMaybe<AnalyticsTimePeriod>;
};

export type QueryDistrictAnalyticsArgs = {
  district: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryDonationArgs = {
  id: Scalars['ID']['input'];
};

export type QueryDonationStatsArgs = {
  input?: InputMaybe<DonationStatsInput>;
};

export type QueryDonationsArgs = {
  filter?: InputMaybe<DonationFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<DonationSortInput>;
};

export type QueryEngagementMetricsArgs = {
  dateRange?: InputMaybe<AnalyticsDateRangeInput>;
};

export type QueryExportAnalyticsArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<RescueAnalyticsInput>;
  type: Scalars['String']['input'];
};

export type QueryFeaturedGalleryImagesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryGalleryImageArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGalleryImagesArgs = {
  filter?: InputMaybe<GalleryImageFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<GalleryImageSortInput>;
};

export type QueryGeographicHeatmapArgs = {
  input?: InputMaybe<GeographicHeatmapInput>;
};

export type QueryGetRouteArgs = {
  from: CoordinateInput;
  profile?: InputMaybe<RoutingProfile>;
  to: CoordinateInput;
};

export type QueryGetSecureMediaUrlArgs = {
  mediaId: Scalars['ID']['input'];
};

export type QueryHistoricalCasesArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  outcome?: InputMaybe<CaseOutcome>;
  pagination?: InputMaybe<PaginationInput>;
  province?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<Season>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryHospitalArgs = {
  id: Scalars['ID']['input'];
};

export type QueryHospitalReportsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hospitalId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<HospitalReportStatus>;
};

export type QueryHospitalVerificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hospitalId: Scalars['ID']['input'];
};

export type QueryHospitalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<HospitalFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<HospitalLocationInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<HospitalSortInput>;
};

export type QueryHospitalsByDistrictArgs = {
  district: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryHospitalsByProvinceArgs = {
  pagination?: InputMaybe<PaginationInput>;
  province: Scalars['String']['input'];
};

export type QueryHospitalsNeedingVerificationArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  maxDaysSinceVerification?: InputMaybe<Scalars['Int']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
};

export type QueryIncidentsArgs = {
  bounds?: InputMaybe<MapBoundsInput>;
  filters?: InputMaybe<IncidentFiltersInput>;
  pagination?: InputMaybe<PaginationInput>;
  radius?: InputMaybe<RadiusInput>;
};

export type QueryMapOverviewArgs = {
  bounds: MapBoundsInput;
  filters?: InputMaybe<MapFiltersInput>;
};

export type QueryMyActivityLogsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyAssignedRescuesArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyDonationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyIdentificationHistoryArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyNotificationsArgs = {
  filter?: InputMaybe<NotificationFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<NotificationSortInput>;
};

export type QueryMyPayoutsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyRescuePaymentIntentArgs = {
  rescueId: Scalars['ID']['input'];
};

export type QueryMyRescueRequestsArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMySettlementsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyTrainingsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryNearbyHospitalsArgs = {
  antivenomRequired?: InputMaybe<Scalars['Boolean']['input']>;
  latitude: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  longitude: Scalars['Float']['input'];
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryNearbyRescuersArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusKm: Scalars['Float']['input'];
  status?: InputMaybe<Array<RescuerStatus>>;
};

export type QueryNearbyRescuesArgs = {
  input: NearbyRescuesInput;
};

export type QueryNearbyTreatmentCentersArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
  requireAntivenom?: InputMaybe<Scalars['Boolean']['input']>;
  requireEmergency?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryNearestSnakebiteFacilitiesArgs = {
  latitude: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  longitude: Scalars['Float']['input'];
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryNearestVerifiedAntivenomFacilityArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  maxRadiusKm?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryNotificationArgs = {
  id: Scalars['ID']['input'];
};

export type QueryNotificationStatsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryPaymentGatewayConfigArgs = {
  method: PaymentMethod;
};

export type QueryPaymentIntentArgs = {
  id: Scalars['ID']['input'];
};

export type QueryPayoutArgs = {
  id: Scalars['ID']['input'];
};

export type QueryPayoutsArgs = {
  status?: InputMaybe<PayoutStatus>;
};

export type QueryPendingVolunteerApplicationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryPublishedBlogPostsArgs = {
  category?: InputMaybe<PostCategory>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryRankTreatmentCentersArgs = {
  latitude: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  longitude: Scalars['Float']['input'];
  requireAntivenom?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryRecommendedHospitalsArgs = {
  hasBite?: InputMaybe<Scalars['Boolean']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type QueryRescueAnalyticsArgs = {
  input?: InputMaybe<RescueAnalyticsInput>;
};

export type QueryRescueRequestArgs = {
  id: Scalars['ID']['input'];
};

export type QueryRescueRequestsArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<RescueSortInput>;
};

export type QueryRescueStatsArgs = {
  input?: InputMaybe<RescueStatsInput>;
};

export type QueryRescueTimelineArgs = {
  rescueId: Scalars['ID']['input'];
};

export type QueryResponseAnalyticsArgs = {
  dateRange?: InputMaybe<DateRangeInput>;
  district?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRiskZonesArgs = {
  bounds?: InputMaybe<MapBoundsInput>;
  district?: InputMaybe<Scalars['String']['input']>;
  minRiskLevel?: InputMaybe<RiskLevel>;
  province?: InputMaybe<Scalars['String']['input']>;
};

export type QuerySearchBlogPostsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySearchHospitalsArgs = {
  filter?: InputMaybe<HospitalFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

export type QuerySearchRescuesArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySearchSnakeSpeciesArgs = {
  filter?: InputMaybe<SnakeSpeciesFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySearchUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySearchVolunteersArgs = {
  filter?: InputMaybe<VolunteerFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySeasonalAnalyticsArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySettlementArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySettlementsArgs = {
  status?: InputMaybe<SettlementStatus>;
};

export type QuerySnakeSpeciesArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySnakeSpeciesByRegionArgs = {
  pagination?: InputMaybe<PaginationInput>;
  region: Scalars['String']['input'];
};

export type QuerySnakeSpeciesDistributionArgs = {
  bounds?: InputMaybe<MapBoundsInput>;
  includeHistorical?: InputMaybe<Scalars['Boolean']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
};

export type QuerySnakebiteHotspotsArgs = {
  bounds?: InputMaybe<MapBoundsInput>;
  district?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  riskLevel?: InputMaybe<Array<RiskLevel>>;
  season?: InputMaybe<Season>;
};

export type QuerySnakesByDangerLevelArgs = {
  dangerLevel: DangerLevel;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryTrainingArgs = {
  id: Scalars['ID']['input'];
};

export type QueryTrainingsArgs = {
  filter?: InputMaybe<TrainingFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<TrainingSortInput>;
};

export type QueryUpcomingTrainingsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryUserProfileArgs = {
  id: Scalars['ID']['input'];
};

export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<UserSortInput>;
};

export type QueryVenomousSnakesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryVolunteerArgs = {
  id: Scalars['ID']['input'];
};

export type QueryVolunteerAnalyticsArgs = {
  input?: InputMaybe<VolunteerAnalyticsInput>;
};

export type QueryVolunteersArgs = {
  filter?: InputMaybe<VolunteerFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<VolunteerSortInput>;
};

export type RadiusInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusKm: Scalars['Float']['input'];
};

export type RankedTreatmentCenter = {
  __typename?: 'RankedTreatmentCenter';
  /** Distance in kilometers */
  distanceKm: Scalars['Float']['output'];
  /** Estimated travel time in minutes */
  estimatedTravelTimeMinutes: Scalars['Int']['output'];
  /** Rank (1 = best) */
  rank: Scalars['Int']['output'];
  /** Route geometry */
  route?: Maybe<Route>;
  /** Composite score (higher = better) */
  score: Scalars['Float']['output'];
  /** Scoring breakdown */
  scoreDetails: RankingScoreDetails;
  /** Treatment center details */
  treatmentCenter: TreatmentCenter;
};

export type RankingScoreDetails = {
  __typename?: 'RankingScoreDetails';
  /** Accessibility score (travel time) */
  accessibilityScore: Scalars['Float']['output'];
  /** Antivenom score (available = higher) */
  antivenomScore: Scalars['Float']['output'];
  /** Capability score (more capable = higher) */
  capabilityScore: Scalars['Float']['output'];
  /** Distance score (closer = higher) */
  distanceScore: Scalars['Float']['output'];
  /** Verification score (verified = higher) */
  verificationScore: Scalars['Float']['output'];
};

export type Refund = {
  __typename?: 'Refund';
  amount: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  processedAt?: Maybe<Scalars['DateTime']['output']>;
  providerReference?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  transactionId: Scalars['ID']['output'];
};

/** Input for refunding donation */
export type RefundDonationInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  donationId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type RefundPaymentInput = {
  amount: Scalars['String']['input'];
  idempotencyKey: Scalars['String']['input'];
  paymentIntentId: Scalars['ID']['input'];
};

/** Input for user registration */
export type RegisterInput = {
  email: Scalars['Email']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['Phone']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

/** Registration payload returned after successful registration (no auth tokens until email verification + login) */
export type RegistrationPayload = {
  __typename?: 'RegistrationPayload';
  user: User;
};

/** Activity point for rescue timeline charts */
export type RescueActivityPoint = {
  __typename?: 'RescueActivityPoint';
  cancelled: Scalars['Int']['output'];
  completed: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  date: Scalars['DateTime']['output'];
  pending: Scalars['Int']['output'];
};

/** Rescue analytics */
export type RescueAnalytics = {
  __typename?: 'RescueAnalytics';
  byMunicipality: Array<RescueByMunicipality>;
  byPriority: Array<RescueByPriority>;
  bySpecies: Array<RescueBySpecies>;
  byStatus: Array<RescueByStatus>;
  byTimeOfDay: Array<RescueByTimeOfDay>;
  responseTimeAnalysis: ResponseTimeAnalysis;
  successRate: Scalars['Float']['output'];
  timeSeriesData: Array<TimeSeriesPoint>;
  totalRescues: Scalars['Int']['output'];
};

/** Input for rescue analytics */
export type RescueAnalyticsInput = {
  dateRange?: InputMaybe<AnalyticsDateRangeInput>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<RescuePriority>;
  status?: InputMaybe<RescueStatus>;
  volunteerId?: InputMaybe<Scalars['ID']['input']>;
};

/** Rescue assignment event */
export type RescueAssignmentEvent = {
  __typename?: 'RescueAssignmentEvent';
  assignedAt: Scalars['DateTime']['output'];
  assignedBy: User;
  notes?: Maybe<Scalars['String']['output']>;
  rescue: RescueRequest;
  volunteer: Volunteer;
};

/** Rescue count by municipality */
export type RescueByMunicipality = {
  __typename?: 'RescueByMunicipality';
  count: Scalars['Int']['output'];
  municipality: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

/** Rescue count by priority */
export type RescueByPriority = {
  __typename?: 'RescueByPriority';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  priority: RescuePriority;
};

/** Rescue count by species */
export type RescueBySpecies = {
  __typename?: 'RescueBySpecies';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  species: SnakeSpecies;
};

/** Rescue count by status */
export type RescueByStatus = {
  __typename?: 'RescueByStatus';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  status: RescueStatus;
};

/** Rescue count by time of day */
export type RescueByTimeOfDay = {
  __typename?: 'RescueByTimeOfDay';
  averageResponseTime: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  hour: Scalars['Int']['output'];
};

/** Rescue statistics by municipality */
export type RescueMunicipalityStats = {
  __typename?: 'RescueMunicipalityStats';
  count: Scalars['Int']['output'];
  municipality: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

/** Outcome of a completed rescue */
export type RescueOutcome =
  | 'ALREADY_GONE'
  | 'DECEASED'
  | 'FALSE_ALARM'
  | 'NO_SNAKE_FOUND'
  | 'REFUSED_HELP'
  | 'RESCUED_RELOCATED'
  | '%future added value';

/** Priority level of a rescue request */
export type RescuePriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | '%future added value';

/** Rescue statistics by priority */
export type RescuePriorityStats = {
  __typename?: 'RescuePriorityStats';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  priority: RescuePriority;
};

export type RescueRating = {
  __typename?: 'RescueRating';
  communication?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  feedback?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  professionalism?: Maybe<Scalars['Int']['output']>;
  rating: Scalars['Int']['output'];
  rescueId: Scalars['ID']['output'];
  rescuerId: Scalars['ID']['output'];
  responseSpeed?: Maybe<Scalars['Int']['output']>;
  safetyHandling?: Maybe<Scalars['Int']['output']>;
};

/** Snake rescue request */
export type RescueRequest = {
  __typename?: 'RescueRequest';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  address: Scalars['String']['output'];
  aiIdentification?: Maybe<AiIdentification>;
  antivenomAdministered?: Maybe<Scalars['Boolean']['output']>;
  antivenomType?: Maybe<Scalars['String']['output']>;
  arrivedAt?: Maybe<Scalars['DateTime']['output']>;
  assignedAt?: Maybe<Scalars['DateTime']['output']>;
  assignedBy?: Maybe<User>;
  assignedVolunteer?: Maybe<Volunteer>;
  biteDetails?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['Email']['output']>;
  emergencyDetails?: Maybe<Scalars['String']['output']>;
  hasBite: Scalars['Boolean']['output'];
  hospital?: Maybe<Hospital>;
  hospitalAdmission?: Maybe<Scalars['Boolean']['output']>;
  hospitalId?: Maybe<Scalars['String']['output']>;
  hospitalNotes?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internalNotes?: Maybe<Scalars['String']['output']>;
  isEmergency: Scalars['Boolean']['output'];
  landmark?: Maybe<Scalars['String']['output']>;
  lat?: Maybe<Scalars['Latitude']['output']>;
  lng?: Maybe<Scalars['Longitude']['output']>;
  locationAccuracy?: Maybe<Scalars['Float']['output']>;
  municipality: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  notifications: Array<Notification>;
  outcome?: Maybe<RescueOutcome>;
  phone: Scalars['Phone']['output'];
  priority: RescuePriority;
  rating?: Maybe<RescueRating>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  rescueDuration?: Maybe<Scalars['Int']['output']>;
  rescueImages: Array<Scalars['String']['output']>;
  rescueReport?: Maybe<Scalars['String']['output']>;
  snakeColor?: Maybe<Scalars['String']['output']>;
  snakeDescription?: Maybe<Scalars['String']['output']>;
  snakeImageUrl?: Maybe<Scalars['String']['output']>;
  snakeImages: Array<Scalars['String']['output']>;
  snakeSize?: Maybe<Scalars['String']['output']>;
  source: RescueSource;
  species?: Maybe<SnakeSpecies>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: RescueStatus;
  stillPresent: Scalars['Boolean']['output'];
  timeline: Array<RescueTimeline>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<User>;
  victimWentToHospital?: Maybe<Scalars['Boolean']['output']>;
  ward?: Maybe<Scalars['Int']['output']>;
};

/** Connection type for paginated rescue results */
export type RescueRequestConnection = {
  __typename?: 'RescueRequestConnection';
  edges: Array<RescueRequestEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for rescue connection */
export type RescueRequestEdge = {
  __typename?: 'RescueRequestEdge';
  cursor: Scalars['String']['output'];
  node: RescueRequest;
};

/** Filter input for rescue queries */
export type RescueRequestFilterInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  completedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  completedBefore?: InputMaybe<Scalars['DateTime']['input']>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  hasBite?: InputMaybe<Scalars['Boolean']['input']>;
  isEmergency?: InputMaybe<Scalars['Boolean']['input']>;
  municipalities?: InputMaybe<Array<Scalars['String']['input']>>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  priorities?: InputMaybe<Array<RescuePriority>>;
  priority?: InputMaybe<RescuePriority>;
  search?: InputMaybe<Scalars['String']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<RescueStatus>;
  statuses?: InputMaybe<Array<RescueStatus>>;
};

/** Fields available for sorting rescues */
export type RescueSortField =
  | 'ASSIGNED_AT'
  | 'COMPLETED_AT'
  | 'CREATED_AT'
  | 'MUNICIPALITY'
  | 'PRIORITY'
  | 'STATUS'
  | 'UPDATED_AT'
  | '%future added value';

/** Sort input for rescue queries */
export type RescueSortInput = {
  field: RescueSortField;
  order: SortOrder;
};

/** Source of rescue request */
export type RescueSource =
  | 'APP'
  | 'PHONE'
  | 'TELEGRAM'
  | 'WEB'
  | '%future added value';

/** Rescue statistics by species */
export type RescueSpeciesStats = {
  __typename?: 'RescueSpeciesStats';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  species: SnakeSpecies;
};

/** Statistics for rescue operations */
export type RescueStats = {
  __typename?: 'RescueStats';
  averageRescueTime?: Maybe<Scalars['Float']['output']>;
  averageResponseTime?: Maybe<Scalars['Float']['output']>;
  byMunicipality: Array<RescueMunicipalityStats>;
  byPriority: Array<RescuePriorityStats>;
  bySpecies: Array<RescueSpeciesStats>;
  cancelled: Scalars['Int']['output'];
  completed: Scalars['Int']['output'];
  inProgress: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  recentActivity: Array<RescueActivityPoint>;
  successRate?: Maybe<Scalars['Float']['output']>;
  total: Scalars['Int']['output'];
};

/** Input for rescue statistics */
export type RescueStatsInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  volunteerId?: InputMaybe<Scalars['ID']['input']>;
};

/** Status of a rescue request */
export type RescueStatus =
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'CANCELLED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | '%future added value';

/** Timeline event for a rescue request */
export type RescueTimeline = {
  __typename?: 'RescueTimeline';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  event: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Latitude']['output']>;
  lng?: Maybe<Scalars['Longitude']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  rescue: RescueRequest;
  user?: Maybe<User>;
};

export type RescuerMapPoint = {
  __typename?: 'RescuerMapPoint';
  distanceKm?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isAvailable: Scalars['Boolean']['output'];
  lastLocationUpdate?: Maybe<Scalars['DateTime']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  status: RescuerStatus;
  vehicleType?: Maybe<VehicleType>;
};

export type RescuerStatus =
  | 'AVAILABLE'
  | 'BUSY'
  | 'EN_ROUTE'
  | 'OFFLINE'
  | 'ON_SITE'
  | 'SUSPENDED'
  | '%future added value';

/** Input for resending verification email */
export type ResendVerificationInput = {
  email: Scalars['Email']['input'];
};

/** Input for password reset with OTP code */
export type ResetPasswordInput = {
  code: Scalars['String']['input'];
  email: Scalars['Email']['input'];
  newPassword: Scalars['String']['input'];
};

export type ResolveHospitalReportInput = {
  reportId: Scalars['ID']['input'];
  resolution: Scalars['String']['input'];
};

/** Input for responding to a contact message */
export type RespondToMessageInput = {
  messageId: Scalars['ID']['input'];
  response: Scalars['String']['input'];
  sendEmail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ResponseAnalytics = {
  __typename?: 'ResponseAnalytics';
  /** Average response time (minutes) */
  avgResponseTime: Scalars['Float']['output'];
  /** Average travel distance (km) */
  avgTravelDistance: Scalars['Float']['output'];
  /** Response time by district */
  byDistrict: Array<DistrictResponseTime>;
  /** Rescue completion rate */
  completionRate: Scalars['Float']['output'];
  /** Median response time (minutes) */
  medianResponseTime: Scalars['Float']['output'];
  /** 90th percentile response time */
  p90ResponseTime: Scalars['Float']['output'];
  /** Success rate (percentage) */
  successRate: Scalars['Float']['output'];
  /** Response time trend */
  trend: Array<ResponseTimeTrend>;
};

/** Response time analysis */
export type ResponseTimeAnalysis = {
  __typename?: 'ResponseTimeAnalysis';
  average: Scalars['Int']['output'];
  byPriority: Array<ResponseTimeByPriority>;
  fastest: Scalars['Int']['output'];
  median: Scalars['Int']['output'];
  slowest: Scalars['Int']['output'];
};

/** Response time by priority */
export type ResponseTimeByPriority = {
  __typename?: 'ResponseTimeByPriority';
  average: Scalars['Int']['output'];
  median: Scalars['Int']['output'];
  priority: RescuePriority;
};

export type ResponseTimeTrend = {
  __typename?: 'ResponseTimeTrend';
  avgResponseTime: Scalars['Float']['output'];
  date: Scalars['Date']['output'];
  incidentCount: Scalars['Int']['output'];
};

/** Input for approving/rejecting volunteer */
export type ReviewVolunteerInput = {
  approved: Scalars['Boolean']['input'];
  assignedZone?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  volunteerId: Scalars['ID']['input'];
};

export type RiskLevel =
  | 'EXTREME'
  | 'HIGH'
  | 'LOW'
  | 'MODERATE'
  | 'VERY_HIGH'
  | '%future added value';

export type RiskZone = {
  __typename?: 'RiskZone';
  avgResponseTime?: Maybe<Scalars['Float']['output']>;
  district: Scalars['String']['output'];
  geometry?: Maybe<Scalars['GeoJSON']['output']>;
  incidenceRate?: Maybe<Scalars['Float']['output']>;
  populationAtRisk?: Maybe<Scalars['Int']['output']>;
  province: Scalars['String']['output'];
  riskLevel: RiskLevel;
  snakebiteCases: Scalars['Int']['output'];
  totalIncidents: Scalars['Int']['output'];
  treatmentCenters: Scalars['Int']['output'];
};

export type RiskZoneMapPoint = {
  __typename?: 'RiskZoneMapPoint';
  district: Scalars['String']['output'];
  geometry?: Maybe<Scalars['GeoJSON']['output']>;
  id: Scalars['ID']['output'];
  incidenceRate?: Maybe<Scalars['Float']['output']>;
  populationAtRisk?: Maybe<Scalars['Int']['output']>;
  province: Scalars['String']['output'];
  riskLevel: RiskLevel;
  treatmentCenterCount?: Maybe<Scalars['Int']['output']>;
};

export type Route = {
  __typename?: 'Route';
  /** Total distance in kilometers */
  distance: Scalars['Float']['output'];
  /** Total duration in minutes */
  duration: Scalars['Int']['output'];
  /** Route geometry (LineString) */
  geometry: Scalars['GeoJSON']['output'];
  /** Turn-by-turn instructions */
  instructions: Array<RouteInstruction>;
  /** Waypoints along route */
  waypoints: Array<Coordinate>;
};

export type RouteInstruction = {
  __typename?: 'RouteInstruction';
  /** Distance for this step (meters) */
  distance: Scalars['Float']['output'];
  /** Duration for this step (seconds) */
  duration: Scalars['Int']['output'];
  /** Road name */
  roadName?: Maybe<Scalars['String']['output']>;
  /** Instruction text */
  text: Scalars['String']['output'];
  /** Direction type */
  type: Scalars['String']['output'];
};

export type RoutingProfile =
  | 'CYCLING'
  | 'DRIVING'
  | 'DRIVING_FAST'
  | 'EMERGENCY'
  | 'WALKING'
  | '%future added value';

export type SaveEmergencyContactInput = {
  name: Scalars['String']['input'];
  phone: Scalars['Phone']['input'];
  relationship: Scalars['String']['input'];
};

export type Season =
  | 'AUTUMN'
  | 'MONSOON'
  | 'SPRING'
  | 'WINTER'
  | '%future added value';

export type SeasonalAnalytics = {
  __typename?: 'SeasonalAnalytics';
  /** Data by month */
  byMonth: Array<MonthlyDataPoint>;
  /** Data by season */
  bySeason: Array<SeasonalDataPoint>;
  /** Monsoon emphasis (June-Sept) */
  monsoonData: MonsoonData;
  /** Peak month */
  peakMonth: Scalars['Int']['output'];
  /** Peak season */
  peakSeason: Season;
};

export type SeasonalDataPoint = {
  __typename?: 'SeasonalDataPoint';
  count: Scalars['Int']['output'];
  deaths?: Maybe<Scalars['Int']['output']>;
  percentage: Scalars['Float']['output'];
  season: Season;
  snakebiteCases?: Maybe<Scalars['Int']['output']>;
};

export type Settlement = {
  __typename?: 'Settlement';
  amount: Scalars['String']['output'];
  citizenName: Scalars['String']['output'];
  commissionAmount: Scalars['String']['output'];
  commissionRate: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  eligibleAt?: Maybe<Scalars['DateTime']['output']>;
  grossAmount: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rescueChargeId?: Maybe<Scalars['ID']['output']>;
  rescuer?: Maybe<Volunteer>;
  rescuerAmount: Scalars['String']['output'];
  rescuerId: Scalars['ID']['output'];
  rescuerName: Scalars['String']['output'];
  settledAt?: Maybe<Scalars['DateTime']['output']>;
  status: SettlementStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type SettlementConnection = {
  __typename?: 'SettlementConnection';
  edges: Array<SettlementEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SettlementEdge = {
  __typename?: 'SettlementEdge';
  cursor: Scalars['String']['output'];
  node: Settlement;
};

export type SettlementStatus =
  | 'CANCELLED'
  | 'ELIGIBLE'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SETTLED'
  | '%future added value';

/** Snake size categories */
export type SnakeSize = 'LARGE' | 'MEDIUM' | 'SMALL' | '%future added value';

/** Snake species information */
export type SnakeSpecies = {
  __typename?: 'SnakeSpecies';
  activeTime?: Maybe<ActivityPattern>;
  aiIdentifications: AiIdentificationConnection;
  aliases: Array<Scalars['String']['output']>;
  altitudeRange?: Maybe<Scalars['String']['output']>;
  averageLength?: Maybe<Scalars['String']['output']>;
  behavior?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  conservationStatus?: Maybe<ConservationStatus>;
  createdAt: Scalars['DateTime']['output'];
  dangerLevel?: Maybe<DangerLevel>;
  diet?: Maybe<Scalars['String']['output']>;
  distinctiveFeatures: Array<Scalars['String']['output']>;
  emergencyAdvice?: Maybe<Scalars['String']['output']>;
  family?: Maybe<Scalars['String']['output']>;
  firstAidSteps: Array<Scalars['String']['output']>;
  foundInNepal: Scalars['Boolean']['output'];
  genus?: Maybe<Scalars['String']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identificationCount: Scalars['Int']['output'];
  identificationGuide?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  images: Array<Scalars['String']['output']>;
  localNames: Array<Scalars['String']['output']>;
  maxLength?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nepaliName: Scalars['String']['output'];
  pattern?: Maybe<Scalars['String']['output']>;
  protected: Scalars['Boolean']['output'];
  regions: Array<Scalars['String']['output']>;
  rescueCount: Scalars['Int']['output'];
  rescueRequests: RescueRequestConnection;
  safetyTips?: Maybe<Scalars['String']['output']>;
  scientificName: Scalars['String']['output'];
  species?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  venomType?: Maybe<VenomType>;
  venomous: Scalars['Boolean']['output'];
  verified: Scalars['Boolean']['output'];
  verifiedBy?: Maybe<User>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

/** Snake species information */
export type SnakeSpeciesAiIdentificationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** Snake species information */
export type SnakeSpeciesRescueRequestsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** Connection type for paginated snake species results */
export type SnakeSpeciesConnection = {
  __typename?: 'SnakeSpeciesConnection';
  edges: Array<SnakeSpeciesEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for snake species connection */
export type SnakeSpeciesEdge = {
  __typename?: 'SnakeSpeciesEdge';
  cursor: Scalars['String']['output'];
  node: SnakeSpecies;
};

/** Filter input for snake species queries */
export type SnakeSpeciesFilterInput = {
  dangerLevel?: InputMaybe<DangerLevel>;
  dangerLevels?: InputMaybe<Array<DangerLevel>>;
  family?: InputMaybe<Scalars['String']['input']>;
  foundInNepal?: InputMaybe<Scalars['Boolean']['input']>;
  protected?: InputMaybe<Scalars['Boolean']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  venomous?: InputMaybe<Scalars['Boolean']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Fields available for sorting snake species */
export type SnakeSpeciesSortField =
  | 'CREATED_AT'
  | 'DANGER_LEVEL'
  | 'IDENTIFICATION_COUNT'
  | 'NAME'
  | 'RESCUE_COUNT'
  | 'SCIENTIFIC_NAME'
  | '%future added value';

/** Sort input for snake species queries */
export type SnakeSpeciesSortInput = {
  field: SnakeSpeciesSortField;
  order: SortOrder;
};

/** Snake species statistics */
export type SnakeSpeciesStats = {
  __typename?: 'SnakeSpeciesStats';
  byDangerLevel: Array<SpeciesByDangerLevel>;
  byFamily: Array<SpeciesByFamily>;
  harmlessCount: Scalars['Int']['output'];
  mostEncountered: Array<SnakeSpecies>;
  totalSpecies: Scalars['Int']['output'];
  venomousCount: Scalars['Int']['output'];
};

export type SnakebiteCase = {
  __typename?: 'SnakebiteCase';
  ageGroup?: Maybe<Scalars['String']['output']>;
  antivenomGiven?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dataQuality?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  envenomation?: Maybe<Scalars['Boolean']['output']>;
  hospitalStayDays?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  municipality?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  outcome: CaseOutcome;
  province?: Maybe<Scalars['String']['output']>;
  season?: Maybe<Season>;
  sex?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  sourceUrl?: Maybe<Scalars['String']['output']>;
  species?: Maybe<SnakeSpecies>;
  speciesCommon?: Maybe<Scalars['String']['output']>;
  studyId?: Maybe<Scalars['String']['output']>;
  symptoms?: Maybe<Array<Scalars['String']['output']>>;
  treatmentCenter?: Maybe<TreatmentCenter>;
  treatmentDelayMinutes?: Maybe<Scalars['Int']['output']>;
  ward?: Maybe<Scalars['Int']['output']>;
  year: Scalars['Int']['output'];
};

export type SnakebiteCaseConnection = {
  __typename?: 'SnakebiteCaseConnection';
  edges: Array<SnakebiteCaseEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SnakebiteCaseEdge = {
  __typename?: 'SnakebiteCaseEdge';
  cursor: Scalars['String']['output'];
  node: SnakebiteCase;
};

export type SnakebiteHotspot = {
  __typename?: 'SnakebiteHotspot';
  active: Scalars['Boolean']['output'];
  caseCount?: Maybe<Scalars['Int']['output']>;
  confidence?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  geometry?: Maybe<Scalars['GeoJSON']['output']>;
  id: Scalars['ID']['output'];
  incidenceRate?: Maybe<Scalars['Float']['output']>;
  methodology?: Maybe<Scalars['String']['output']>;
  monthlyPattern?: Maybe<Array<Scalars['Float']['output']>>;
  mortalityRate?: Maybe<Scalars['Float']['output']>;
  municipality?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  populationAtRisk?: Maybe<Scalars['Int']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  riskLevel: RiskLevel;
  riskScore: Scalars['Float']['output'];
  season?: Maybe<Season>;
  seasonalityScore?: Maybe<Scalars['Float']['output']>;
  source: Scalars['String']['output'];
  sourceUrl?: Maybe<Scalars['String']['output']>;
  studyYear?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  ward?: Maybe<Scalars['Int']['output']>;
};

export type SortDirection = 'ASC' | 'DESC' | '%future added value';

/** Sort order */
export type SortOrder = 'ASC' | 'DESC' | '%future added value';

/** Species count by danger level */
export type SpeciesByDangerLevel = {
  __typename?: 'SpeciesByDangerLevel';
  count: Scalars['Int']['output'];
  dangerLevel: DangerLevel;
};

/** Species count by family */
export type SpeciesByFamily = {
  __typename?: 'SpeciesByFamily';
  count: Scalars['Int']['output'];
  family: Scalars['String']['output'];
  venomousCount: Scalars['Int']['output'];
};

export type SpeciesCount = {
  __typename?: 'SpeciesCount';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  speciesId: Scalars['ID']['output'];
  speciesName: Scalars['String']['output'];
  venomous: Scalars['Boolean']['output'];
};

/** Species identification count */
export type SpeciesIdentificationCount = {
  __typename?: 'SpeciesIdentificationCount';
  averageConfidence: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  species: SnakeSpecies;
};

export type SpeciesMapPoint = {
  __typename?: 'SpeciesMapPoint';
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  observedAt: Scalars['DateTime']['output'];
  source?: Maybe<Scalars['String']['output']>;
  speciesId: Scalars['ID']['output'];
  speciesName: Scalars['String']['output'];
  venomous: Scalars['Boolean']['output'];
};

export type StartPaymentInput = {
  amount?: InputMaybe<Scalars['String']['input']>;
  paymentIntentId: Scalars['ID']['input'];
  returnUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Stripe connection status for development testing */
export type StripeConnectionStatus = {
  __typename?: 'StripeConnectionStatus';
  /** Stripe account ID (if connected) */
  accountId?: Maybe<Scalars['String']['output']>;
  /** Whether Stripe is successfully connected */
  connected: Scalars['Boolean']['output'];
  /** Whether Stripe is in live mode */
  livemode: Scalars['Boolean']['output'];
  /** Human-readable status message */
  message: Scalars['String']['output'];
  /** Stripe mode: test, live, or unknown */
  mode: Scalars['String']['output'];
};

/** Input for submitting a contact message */
export type SubmitContactMessageInput = {
  category?: InputMaybe<MessageCategory>;
  email: Scalars['Email']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['Phone']['input']>;
  subject: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']['output']>;
  /** Subscribe to new AI identifications */
  aiIdentificationCompleted: AiIdentification;
  /** Subscribe to analytics data changes */
  analyticsUpdated: Scalars['JSON']['output'];
  antivenomStatusChanged: AntivenomStatusUpdate;
  /** Subscribe to new blog post publications */
  blogPostPublished: BlogPost;
  /** Subscribe to blog post updates */
  blogPostUpdated: BlogPost;
  /** Subscribe to new contact messages */
  contactMessageReceived: ContactMessage;
  /** Subscribe to contact message updates */
  contactMessageUpdated: ContactMessage;
  /** Subscribe to real-time dashboard updates */
  dashboardUpdated: DashboardStats;
  /** Subscribe to new donations */
  donationReceived: Donation;
  /** Subscribe to donation status changes */
  donationStatusChanged: DonationStatusChangeEvent;
  /** Subscribe to emergency rescues (high priority) */
  emergencyRescueCreated: RescueRequest;
  /** Subscribe to new gallery image uploads */
  galleryImageUploaded: GalleryImage;
  hospitalReportCreated: HospitalReport;
  hospitalUpdated: Hospital;
  /** Subscribe to identification feedback events */
  identificationFeedbackReceived: IdentificationFeedbackEvent;
  /** Subscribe to nearby rescues (for volunteers) */
  nearbyRescuesUpdated: RescueRequest;
  /** Subscribe to notification read events */
  notificationRead: NotificationReadEvent;
  /** Subscribe to new notifications */
  notificationReceived: Notification;
  /** Subscribe to rescue assignments (volunteer) */
  rescueAssigned: RescueAssignmentEvent;
  /** Subscribe to new rescue requests */
  rescueCreated: RescueRequest;
  /** Subscribe to rescue timeline updates */
  rescueTimelineUpdated: RescueTimeline;
  /** Subscribe to rescue status changes */
  rescueUpdated: RescueRequest;
  /** Subscribe to new snake species additions */
  snakeSpeciesAdded: SnakeSpecies;
  /** Subscribe to snake species updates */
  snakeSpeciesUpdated: SnakeSpecies;
  /** Subscribe to new training sessions */
  trainingCreated: Training;
  /** Subscribe to training enrollments */
  trainingEnrollmentReceived: TrainingEnrollmentEvent;
  /** Subscribe to training updates */
  trainingUpdated: Training;
  /** Subscribe to unread count changes */
  unreadCountChanged: UnreadCountEvent;
  /** Subscribe to user status changes (admin only) */
  userStatusChanged: UserStatusChangeEvent;
  /** Subscribe to user profile updates */
  userUpdated: User;
  /** Subscribe to volunteer application submissions */
  volunteerApplicationReceived: Volunteer;
  /** Subscribe to volunteer availability changes */
  volunteerAvailabilityChanged: VolunteerAvailabilityEvent;
  /** Subscribe to volunteer status changes */
  volunteerStatusChanged: VolunteerStatusChangeEvent;
};

export type SubscriptionAiIdentificationCompletedArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionAnalyticsUpdatedArgs = {
  type: Scalars['String']['input'];
};

export type SubscriptionAntivenomStatusChangedArgs = {
  hospitalId?: InputMaybe<Scalars['ID']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionBlogPostUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionContactMessageUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionDonationStatusChangedArgs = {
  donationId?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionHospitalUpdatedArgs = {
  hospitalId?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionNearbyRescuesUpdatedArgs = {
  lat: Scalars['Latitude']['input'];
  lng: Scalars['Longitude']['input'];
  radiusKm: Scalars['Float']['input'];
};

export type SubscriptionNotificationReadArgs = {
  userId: Scalars['ID']['input'];
};

export type SubscriptionNotificationReceivedArgs = {
  userId: Scalars['ID']['input'];
};

export type SubscriptionRescueAssignedArgs = {
  volunteerId: Scalars['ID']['input'];
};

export type SubscriptionRescueCreatedArgs = {
  municipality?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionRescueTimelineUpdatedArgs = {
  rescueId: Scalars['ID']['input'];
};

export type SubscriptionRescueUpdatedArgs = {
  rescueId?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionSnakeSpeciesUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionTrainingEnrollmentReceivedArgs = {
  trainingId: Scalars['ID']['input'];
};

export type SubscriptionTrainingUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionUnreadCountChangedArgs = {
  userId: Scalars['ID']['input'];
};

export type SubscriptionUserUpdatedArgs = {
  userId: Scalars['ID']['input'];
};

export type SubscriptionVolunteerAvailabilityChangedArgs = {
  municipality?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionVolunteerStatusChangedArgs = {
  volunteerId?: InputMaybe<Scalars['ID']['input']>;
};

/** Standard success response */
export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  /** Success message */
  message?: Maybe<Scalars['String']['output']>;
  /** Additional metadata */
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Operation succeeded */
  success: Scalars['Boolean']['output'];
};

/** Time series data point */
export type TimeSeriesPoint = {
  __typename?: 'TimeSeriesPoint';
  label?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  value: Scalars['Float']['output'];
};

/** Top donor information */
export type TopDonor = {
  __typename?: 'TopDonor';
  anonymous: Scalars['Boolean']['output'];
  donor?: Maybe<User>;
  donorName: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  totalDonations: Scalars['Int']['output'];
};

/** Training session */
export type Training = {
  __typename?: 'Training';
  availableSeats: Scalars['Int']['output'];
  certificate?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  instructor?: Maybe<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  materials: Array<Scalars['String']['output']>;
  maxParticipants: Scalars['Int']['output'];
  participants: Array<User>;
  registeredCount: Scalars['Int']['output'];
  scheduledAt: Scalars['DateTime']['output'];
  status: TrainingStatus;
  title: Scalars['String']['output'];
  type: TrainingType;
  updatedAt: Scalars['DateTime']['output'];
  volunteers: Array<Volunteer>;
};

/** Training count by type */
export type TrainingByType = {
  __typename?: 'TrainingByType';
  count: Scalars['Int']['output'];
  totalParticipants: Scalars['Int']['output'];
  type: TrainingType;
};

/** Connection type for paginated training results */
export type TrainingConnection = {
  __typename?: 'TrainingConnection';
  edges: Array<TrainingEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for training connection */
export type TrainingEdge = {
  __typename?: 'TrainingEdge';
  cursor: Scalars['String']['output'];
  node: Training;
};

/** Training enrollment event */
export type TrainingEnrollmentEvent = {
  __typename?: 'TrainingEnrollmentEvent';
  availableSeats: Scalars['Int']['output'];
  enrolledAt: Scalars['DateTime']['output'];
  training: Training;
  user: User;
};

/** Filter input for training queries */
export type TrainingFilterInput = {
  hasAvailableSeats?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  scheduledAfter?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledBefore?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<TrainingStatus>;
  statuses?: InputMaybe<Array<TrainingStatus>>;
  type?: InputMaybe<TrainingType>;
  types?: InputMaybe<Array<TrainingType>>;
};

/** Fields available for sorting training sessions */
export type TrainingSortField =
  | 'CREATED_AT'
  | 'REGISTERED_COUNT'
  | 'SCHEDULED_AT'
  | 'TITLE'
  | '%future added value';

/** Sort input for training queries */
export type TrainingSortInput = {
  field: TrainingSortField;
  order: SortOrder;
};

/** Training statistics */
export type TrainingStats = {
  __typename?: 'TrainingStats';
  averageAttendance: Scalars['Float']['output'];
  byType: Array<TrainingByType>;
  completedSessions: Scalars['Int']['output'];
  recentSessions: Array<Training>;
  totalParticipants: Scalars['Int']['output'];
  totalSessions: Scalars['Int']['output'];
  upcomingSession: Scalars['Int']['output'];
};

/** Status of training session */
export type TrainingStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'ONGOING'
  | 'POSTPONED'
  | 'SCHEDULED'
  | '%future added value';

/** Type of training */
export type TrainingType =
  | 'ADVANCED'
  | 'BASIC'
  | 'DOCUMENTATION'
  | 'EQUIPMENT_HANDLING'
  | 'FIRST_AID'
  | 'REFRESHER'
  | 'SAFETY_PROTOCOLS'
  | 'SPECIES_IDENTIFICATION'
  | '%future added value';

export type TransitionPayoutInput = {
  externalReference?: InputMaybe<Scalars['String']['input']>;
  failureReason?: InputMaybe<Scalars['String']['input']>;
  payoutId: Scalars['ID']['input'];
  status: PayoutStatus;
};

export type TreatmentCenter = {
  __typename?: 'TreatmentCenter';
  address: Scalars['String']['output'];
  antivenomStatus: AntivenomStatus;
  district: Scalars['String']['output'];
  emergency24x7: Scalars['Boolean']['output'];
  emergencyPhone?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  municipality: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  province: Scalars['String']['output'];
  snakebiteTreatmentAvailable: Scalars['Boolean']['output'];
  verified: Scalars['Boolean']['output'];
};

export type TreatmentCenterMapPoint = {
  __typename?: 'TreatmentCenterMapPoint';
  address?: Maybe<Scalars['String']['output']>;
  antivenomStatus: AntivenomStatus;
  distanceKm?: Maybe<Scalars['Float']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  emergency24x7: Scalars['Boolean']['output'];
  estimatedTravelTimeMinutes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  snakebiteTreatmentAvailable: Scalars['Boolean']['output'];
  verified: Scalars['Boolean']['output'];
};

export type TreatmentCenterType =
  | 'DISTRICT'
  | 'PRIMARY'
  | 'PRIVATE'
  | 'PROVINCIAL'
  | 'REFERRAL'
  | 'SPECIALIZED'
  | '%future added value';

/** Trend data for time series */
export type TrendData = {
  __typename?: 'TrendData';
  change: Scalars['Float']['output'];
  current: Scalars['Int']['output'];
  data: Array<TimeSeriesPoint>;
  direction: TrendDirection;
  previous: Scalars['Int']['output'];
};

/** Trend direction */
export type TrendDirection = 'DOWN' | 'STABLE' | 'UP' | '%future added value';

/** Unread count change event */
export type UnreadCountEvent = {
  __typename?: 'UnreadCountEvent';
  changedAt: Scalars['DateTime']['output'];
  unreadCount: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

/** Input for AI model configuration */
export type UpdateAiModelConfigInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  maxImageSize?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  provider: AiProvider;
  supportedFormats?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Input for updating a blog post */
export type UpdateBlogPostInput = {
  category?: InputMaybe<PostCategory>;
  commentsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaKeywords?: InputMaybe<Array<Scalars['String']['input']>>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PostStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating gallery image */
export type UpdateGalleryImageInput = {
  category?: InputMaybe<GalleryCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateHospitalInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  ambulanceAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  bedCapacity?: InputMaybe<Scalars['Int']['input']>;
  bloodBankAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emergency24x7?: InputMaybe<Scalars['Boolean']['input']>;
  emergencyAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  emergencyPhone?: InputMaybe<Scalars['String']['input']>;
  hospitalType?: InputMaybe<HospitalType>;
  icuAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  snakebiteTreatmentAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  specializations?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<HospitalStatus>;
  treatmentCenterType?: InputMaybe<TreatmentCenterType>;
  ventilatorAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  ward?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for updating message status */
export type UpdateMessageStatusInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  messageId: Scalars['ID']['input'];
  status: MessageStatus;
};

/** Input for updating notification preferences */
export type UpdateNotificationPreferencesInput = {
  dailySummaryReports?: InputMaybe<Scalars['Boolean']['input']>;
  donationReceipts?: InputMaybe<Scalars['Boolean']['input']>;
  enableApp?: InputMaybe<Scalars['Boolean']['input']>;
  enableEmail?: InputMaybe<Scalars['Boolean']['input']>;
  enableSMS?: InputMaybe<Scalars['Boolean']['input']>;
  enableTelegram?: InputMaybe<Scalars['Boolean']['input']>;
  highPriorityRescueAlerts?: InputMaybe<Scalars['Boolean']['input']>;
  newUserRegistrations?: InputMaybe<Scalars['Boolean']['input']>;
  quietHoursEnd?: InputMaybe<Scalars['String']['input']>;
  quietHoursStart?: InputMaybe<Scalars['String']['input']>;
  rescueCompletionNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  rescueUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  systemAlerts?: InputMaybe<Scalars['Boolean']['input']>;
  systemAnnouncements?: InputMaybe<Scalars['Boolean']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  trainingReminders?: InputMaybe<Scalars['Boolean']['input']>;
  volunteerUpdates?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Input for updating payment gateway config */
export type UpdatePaymentGatewayInput = {
  currencies?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  method: PaymentMethod;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  testMode?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Input for profile update */
export type UpdateProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['Phone']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating rescue progress */
export type UpdateRescueProgressInput = {
  lat?: InputMaybe<Scalars['Latitude']['input']>;
  lng?: InputMaybe<Scalars['Longitude']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  rescueId: Scalars['ID']['input'];
  status: RescueStatus;
};

/** Input for updating a rescue request */
export type UpdateRescueRequestInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  biteDetails?: InputMaybe<Scalars['String']['input']>;
  emergencyDetails?: InputMaybe<Scalars['String']['input']>;
  hasBite?: InputMaybe<Scalars['Boolean']['input']>;
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  isEmergency?: InputMaybe<Scalars['Boolean']['input']>;
  landmark?: InputMaybe<Scalars['String']['input']>;
  lat?: InputMaybe<Scalars['Latitude']['input']>;
  lng?: InputMaybe<Scalars['Longitude']['input']>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<RescuePriority>;
  snakeColor?: InputMaybe<Scalars['String']['input']>;
  snakeDescription?: InputMaybe<Scalars['String']['input']>;
  snakeImageUrl?: InputMaybe<Scalars['String']['input']>;
  snakeImages?: InputMaybe<Array<Scalars['String']['input']>>;
  snakeSize?: InputMaybe<Scalars['String']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<RescueStatus>;
  stillPresent?: InputMaybe<Scalars['Boolean']['input']>;
  ward?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for updating snake species */
export type UpdateSnakeSpeciesInput = {
  activeTime?: InputMaybe<ActivityPattern>;
  aliases?: InputMaybe<Array<Scalars['String']['input']>>;
  altitudeRange?: InputMaybe<Scalars['String']['input']>;
  averageLength?: InputMaybe<Scalars['String']['input']>;
  behavior?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  conservationStatus?: InputMaybe<ConservationStatus>;
  dangerLevel?: InputMaybe<DangerLevel>;
  diet?: InputMaybe<Scalars['String']['input']>;
  distinctiveFeatures?: InputMaybe<Array<Scalars['String']['input']>>;
  emergencyAdvice?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  firstAidSteps?: InputMaybe<Array<Scalars['String']['input']>>;
  foundInNepal?: InputMaybe<Scalars['Boolean']['input']>;
  genus?: InputMaybe<Scalars['String']['input']>;
  habitat?: InputMaybe<Scalars['String']['input']>;
  identificationGuide?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  localNames?: InputMaybe<Array<Scalars['String']['input']>>;
  maxLength?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nepaliName?: InputMaybe<Scalars['String']['input']>;
  pattern?: InputMaybe<Scalars['String']['input']>;
  protected?: InputMaybe<Scalars['Boolean']['input']>;
  regions?: InputMaybe<Array<Scalars['String']['input']>>;
  safetyTips?: InputMaybe<Scalars['String']['input']>;
  scientificName?: InputMaybe<Scalars['String']['input']>;
  species?: InputMaybe<Scalars['String']['input']>;
  venomType?: InputMaybe<VenomType>;
  venomous?: InputMaybe<Scalars['Boolean']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a training session */
export type UpdateTrainingInput = {
  certificate?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  instructor?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  materials?: InputMaybe<Array<Scalars['String']['input']>>;
  maxParticipants?: InputMaybe<Scalars['Int']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<TrainingStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TrainingType>;
};

/** Input for updating user profile */
export type UpdateUserProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationPreferences?: InputMaybe<Scalars['JSON']['input']>;
  phone?: InputMaybe<Scalars['Phone']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating volunteer availability */
export type UpdateVolunteerAvailabilityInput = {
  currentLat?: InputMaybe<Scalars['Latitude']['input']>;
  currentLng?: InputMaybe<Scalars['Longitude']['input']>;
  isAvailableNow: Scalars['Boolean']['input'];
};

/** Input for updating volunteer profile */
export type UpdateVolunteerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  assignedZone?: InputMaybe<Scalars['String']['input']>;
  availabilitySchedule?: InputMaybe<Array<DailyAvailabilityInput>>;
  availableDays?: InputMaybe<Array<Scalars['String']['input']>>;
  availableTime?: InputMaybe<AvailabilityTime>;
  bio?: InputMaybe<Scalars['String']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  contact?: InputMaybe<Scalars['Phone']['input']>;
  coverageRadius?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  emergencyAvailability?: InputMaybe<Scalars['Boolean']['input']>;
  emergencyContact?: InputMaybe<Scalars['String']['input']>;
  emergencyPhone?: InputMaybe<Scalars['Phone']['input']>;
  equipment?: InputMaybe<Array<Scalars['String']['input']>>;
  experience?: InputMaybe<Scalars['String']['input']>;
  experienceYears?: InputMaybe<Scalars['Int']['input']>;
  hasEquipment?: InputMaybe<Scalars['Boolean']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isAvailableNow?: InputMaybe<Scalars['Boolean']['input']>;
  languages?: InputMaybe<Array<Scalars['String']['input']>>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  vehicle?: InputMaybe<VehicleType>;
  vehicleDetails?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for uploading gallery image */
export type UploadGalleryImageInput = {
  category?: InputMaybe<GalleryCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl: Scalars['String']['input'];
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  rescueId?: InputMaybe<Scalars['ID']['input']>;
  speciesId?: InputMaybe<Scalars['ID']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Upload source for identification */
export type UploadSource =
  | 'API'
  | 'APP'
  | 'TELEGRAM'
  | 'WEB'
  | '%future added value';

/** User account with authentication and profile information */
export type User = {
  __typename?: 'User';
  activityLogs?: Maybe<ActivityLogConnection>;
  aiIdentifications?: Maybe<AiIdentificationConnection>;
  avatar?: Maybe<Scalars['String']['output']>;
  blogPosts?: Maybe<BlogPostConnection>;
  createdAt: Scalars['DateTime']['output'];
  donations?: Maybe<DonationConnection>;
  email: Scalars['Email']['output'];
  emailVerified: Scalars['Boolean']['output'];
  galleryImages?: Maybe<GalleryImageConnection>;
  googleEmail?: Maybe<Scalars['Email']['output']>;
  googleId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastLoginIp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notificationPreferences?: Maybe<Scalars['JSON']['output']>;
  notifications?: Maybe<NotificationConnection>;
  phone?: Maybe<Scalars['Phone']['output']>;
  rescueRequests?: Maybe<RescueRequestConnection>;
  role: UserRole;
  status: UserStatus;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  volunteerProfile?: Maybe<Volunteer>;
};

/** User account with authentication and profile information */
export type UserActivityLogsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** User account with authentication and profile information */
export type UserAiIdentificationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** User account with authentication and profile information */
export type UserBlogPostsArgs = {
  filter?: InputMaybe<BlogPostFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

/** User account with authentication and profile information */
export type UserDonationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** User account with authentication and profile information */
export type UserGalleryImagesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** User account with authentication and profile information */
export type UserNotificationsArgs = {
  filter?: InputMaybe<NotificationFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

/** User account with authentication and profile information */
export type UserRescueRequestsArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

/** Paginated connection for users */
export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<User>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Filter input for user queries */
export type UserFilterInput = {
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<UserRole>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<UserStatus>;
};

/** User profile for public display */
export type UserProfile = {
  __typename?: 'UserProfile';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  totalRescues: Scalars['Int']['output'];
  volunteerProfile?: Maybe<Volunteer>;
};

/** User role for role-based access control */
export type UserRole =
  /** Administrator with full system access */
  | 'ADMIN'
  /** Regular citizen who can submit rescue requests */
  | 'CITIZEN'
  /** District-level coordinator managing volunteers */
  | 'DISTRICT_COORDINATOR'
  /** Super administrator with system configuration access */
  | 'SUPER_ADMIN'
  /** Verified snake rescuer with full rescue capabilities */
  | 'VERIFIED_RESCUER'
  /** Approved volunteer (not yet verified) */
  | 'VOLUNTEER'
  | '%future added value';

/** Fields available for sorting users */
export type UserSortField =
  | 'CREATED_AT'
  | 'EMAIL'
  | 'LAST_LOGIN_AT'
  | 'NAME'
  | 'UPDATED_AT'
  | '%future added value';

/** Sort input for user queries */
export type UserSortInput = {
  field: UserSortField;
  order: SortOrder;
};

/** User account status */
export type UserStatus =
  /** Active and can use the system */
  | 'ACTIVE'
  /** Permanently banned */
  | 'BANNED'
  /** Inactive (voluntarily disabled) */
  | 'INACTIVE'
  /** Pending email verification */
  | 'PENDING_VERIFICATION'
  /** Suspended by admin */
  | 'SUSPENDED'
  | '%future added value';

/** User status change event */
export type UserStatusChangeEvent = {
  __typename?: 'UserStatusChangeEvent';
  changedAt: Scalars['DateTime']['output'];
  changedBy?: Maybe<User>;
  newStatus: UserStatus;
  oldStatus: UserStatus;
  user: User;
  userId: Scalars['ID']['output'];
};

/** Validation error for specific field */
export type ValidationError = {
  __typename?: 'ValidationError';
  /** Error code */
  code: Scalars['String']['output'];
  /** Field name that failed validation */
  field: Scalars['String']['output'];
  /** Validation error message */
  message: Scalars['String']['output'];
};

export type VehicleMapPoint = {
  __typename?: 'VehicleMapPoint';
  id: Scalars['ID']['output'];
  lastLocationUpdate?: Maybe<Scalars['DateTime']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  status: VehicleStatus;
  vehicleNumber: Scalars['String']['output'];
  vehicleType: VehicleType;
};

export type VehicleStatus =
  | 'ASSIGNED'
  | 'AVAILABLE'
  | 'EN_ROUTE'
  | 'MAINTENANCE'
  | 'OFFLINE'
  | 'ON_SITE'
  | '%future added value';

/** Vehicle availability */
export type VehicleType =
  | 'AMBULANCE'
  | 'BICYCLE'
  | 'BIKE'
  | 'BOTH'
  | 'CAR'
  | 'MOTORBIKE'
  | 'NONE'
  | 'OTHER'
  | 'RESCUE_VAN'
  | 'TRUCK'
  | '%future added value';

/** Venom type */
export type VenomType =
  | 'CYTOTOXIC'
  | 'HEMOTOXIC'
  | 'MIXED'
  | 'NEUROTOXIC'
  | '%future added value';

export type VerificationFreshness =
  | 'FRESH'
  | 'NEVER'
  | 'STALE'
  | 'VERY_OLD'
  | '%future added value';

export type VerificationStatus =
  | 'HISTORICAL'
  | 'STALE'
  | 'UNVERIFIED'
  | 'VERIFIED'
  | '%future added value';

export type VerificationType =
  | 'EDCD_RECORD'
  | 'HOSPITAL_REPORT'
  | 'OFFICIAL_DOCUMENT'
  | 'PHONE_CALL'
  | 'PROVINCIAL_HEALTH'
  | 'SITE_VISIT'
  | '%future added value';

export type VerifyAntivenomInput = {
  antivenomQuantity?: InputMaybe<Scalars['Int']['input']>;
  antivenomStatus: AntivenomStatus;
  contactDesignation?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  evidenceUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  hospitalId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  verificationType: VerificationType;
};

/** Input for email verification using OTP code only */
export type VerifyEmailInput = {
  code: Scalars['String']['input'];
  email: Scalars['Email']['input'];
};

export type VerifyHospitalCapabilityInput = {
  antivenomQuantity?: InputMaybe<Scalars['Int']['input']>;
  antivenomStatus?: InputMaybe<AntivenomStatus>;
  contactDesignation?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  emergencyStatus?: InputMaybe<Scalars['Boolean']['input']>;
  evidenceUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  hospitalId: Scalars['ID']['input'];
  nextVerificationDue?: InputMaybe<Scalars['DateTime']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  officialDocumentUrl?: InputMaybe<Scalars['String']['input']>;
  snakebiteTreatment?: InputMaybe<Scalars['Boolean']['input']>;
  ventilatorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  verificationType: VerificationType;
};

/** Volunteer profile and information */
export type Volunteer = {
  __typename?: 'Volunteer';
  address: Scalars['String']['output'];
  assignedZone?: Maybe<Scalars['String']['output']>;
  availabilitySchedule: Array<DailyAvailability>;
  availableDays: Array<Scalars['String']['output']>;
  availableTime: AvailabilityTime;
  averageRescueTime?: Maybe<Scalars['Int']['output']>;
  averageResponseTime?: Maybe<Scalars['Int']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  cancelledRescues: Scalars['Int']['output'];
  certificationExpiry?: Maybe<Scalars['DateTime']['output']>;
  certifications: Array<Scalars['String']['output']>;
  completedRescues: Scalars['Int']['output'];
  contact: Scalars['Phone']['output'];
  coverageRadius: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentLat?: Maybe<Scalars['Latitude']['output']>;
  currentLng?: Maybe<Scalars['Longitude']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['Email']['output']>;
  emergencyAvailability: Scalars['Boolean']['output'];
  emergencyContact?: Maybe<Scalars['String']['output']>;
  emergencyPhone?: Maybe<Scalars['Phone']['output']>;
  equipment: Array<Scalars['String']['output']>;
  experience: ExperienceLevel;
  experienceYears?: Maybe<Scalars['Int']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  hasEquipment: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isAvailableNow: Scalars['Boolean']['output'];
  languages: Array<Scalars['String']['output']>;
  lastLocationUpdate?: Maybe<Scalars['DateTime']['output']>;
  municipality: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  ratings: Array<RescueRating>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  rejectedBy?: Maybe<User>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  rescueAssignments: RescueRequestConnection;
  skills: Array<Scalars['String']['output']>;
  status: VolunteerStatus;
  successRate?: Maybe<Scalars['Float']['output']>;
  totalRatings: Scalars['Int']['output'];
  totalRescues: Scalars['Int']['output'];
  trainingCompleted: Scalars['Boolean']['output'];
  trainingDate?: Maybe<Scalars['DateTime']['output']>;
  trainings: TrainingConnection;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  vehicle: VehicleType;
  vehicleDetails?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<User>;
  ward?: Maybe<Scalars['Int']['output']>;
};

/** Volunteer profile and information */
export type VolunteerRescueAssignmentsArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

/** Volunteer profile and information */
export type VolunteerTrainingsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** Volunteer analytics */
export type VolunteerAnalytics = {
  __typename?: 'VolunteerAnalytics';
  activeCount: Scalars['Int']['output'];
  averageRating: Scalars['Float']['output'];
  byExperience: Array<VolunteerByExperience>;
  byMunicipality: Array<VolunteerByMunicipality>;
  byStatus: Array<VolunteerByStatus>;
  timeSeriesData: Array<TimeSeriesPoint>;
  topPerformers: Array<VolunteerPerformance>;
  totalVolunteers: Scalars['Int']['output'];
};

/** Input for volunteer analytics */
export type VolunteerAnalyticsInput = {
  dateRange?: InputMaybe<AnalyticsDateRangeInput>;
  experience?: InputMaybe<ExperienceLevel>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<VolunteerStatus>;
};

/** Volunteer availability change event */
export type VolunteerAvailabilityEvent = {
  __typename?: 'VolunteerAvailabilityEvent';
  changedAt: Scalars['DateTime']['output'];
  currentLat?: Maybe<Scalars['Latitude']['output']>;
  currentLng?: Maybe<Scalars['Longitude']['output']>;
  isAvailableNow: Scalars['Boolean']['output'];
  volunteer: Volunteer;
};

/** Volunteer count by experience */
export type VolunteerByExperience = {
  __typename?: 'VolunteerByExperience';
  count: Scalars['Int']['output'];
  experience: ExperienceLevel;
  percentage: Scalars['Float']['output'];
};

/** Volunteer count by municipality */
export type VolunteerByMunicipality = {
  __typename?: 'VolunteerByMunicipality';
  count: Scalars['Int']['output'];
  municipality: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

/** Volunteer count by status */
export type VolunteerByStatus = {
  __typename?: 'VolunteerByStatus';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  status: VolunteerStatus;
};

/** Connection type for paginated volunteer results */
export type VolunteerConnection = {
  __typename?: 'VolunteerConnection';
  edges: Array<VolunteerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for volunteer connection */
export type VolunteerEdge = {
  __typename?: 'VolunteerEdge';
  cursor: Scalars['String']['output'];
  node: Volunteer;
};

/** Volunteer statistics by experience */
export type VolunteerExperienceStats = {
  __typename?: 'VolunteerExperienceStats';
  count: Scalars['Int']['output'];
  experience: ExperienceLevel;
};

/** Filter input for volunteer queries */
export type VolunteerFilterInput = {
  emergencyAvailability?: InputMaybe<Scalars['Boolean']['input']>;
  experience?: InputMaybe<ExperienceLevel>;
  hasEquipment?: InputMaybe<Scalars['Boolean']['input']>;
  hasVehicle?: InputMaybe<Scalars['Boolean']['input']>;
  isAvailableNow?: InputMaybe<Scalars['Boolean']['input']>;
  minRating?: InputMaybe<Scalars['Float']['input']>;
  minSuccessRate?: InputMaybe<Scalars['Float']['input']>;
  municipalities?: InputMaybe<Array<Scalars['String']['input']>>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<VolunteerStatus>;
  statuses?: InputMaybe<Array<VolunteerStatus>>;
};

/** Volunteer statistics by municipality */
export type VolunteerMunicipalityStats = {
  __typename?: 'VolunteerMunicipalityStats';
  activeCount: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  municipality: Scalars['String']['output'];
};

/** Volunteer performance metrics */
export type VolunteerPerformance = {
  __typename?: 'VolunteerPerformance';
  averageResponseTime: Scalars['Int']['output'];
  rating: Scalars['Float']['output'];
  rescuesCompleted: Scalars['Int']['output'];
  successRate: Scalars['Float']['output'];
  volunteer: Volunteer;
};

/** Fields available for sorting volunteers */
export type VolunteerSortField =
  | 'BAYESIAN_RATING'
  | 'CREATED_AT'
  | 'MUNICIPALITY'
  | 'NAME'
  | 'RATING'
  | 'SUCCESS_RATE'
  | 'TOTAL_RESCUES'
  | '%future added value';

/** Sort input for volunteer queries */
export type VolunteerSortInput = {
  field: VolunteerSortField;
  order: SortOrder;
};

/** Volunteer statistics */
export type VolunteerStats = {
  __typename?: 'VolunteerStats';
  active: Scalars['Int']['output'];
  byExperience: Array<VolunteerExperienceStats>;
  byMunicipality: Array<VolunteerMunicipalityStats>;
  pending: Scalars['Int']['output'];
  suspended: Scalars['Int']['output'];
  topPerformers: Array<VolunteerPerformance>;
  total: Scalars['Int']['output'];
  verified: Scalars['Int']['output'];
};

/** Status of volunteer application/account */
export type VolunteerStatus =
  | 'APPROVED'
  | 'INACTIVE'
  | 'PENDING'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'VERIFIED'
  | '%future added value';

/** Volunteer status change event */
export type VolunteerStatusChangeEvent = {
  __typename?: 'VolunteerStatusChangeEvent';
  changedAt: Scalars['DateTime']['output'];
  changedBy?: Maybe<User>;
  newStatus: VolunteerStatus;
  oldStatus: VolunteerStatus;
  reason?: Maybe<Scalars['String']['output']>;
  volunteer: Volunteer;
  volunteerId: Scalars['ID']['output'];
};

/** AI provider for snake identification */
export type AiProvider =
  | 'CLAUDE'
  | 'CUSTOM'
  | 'GEMINI'
  | 'LOCAL'
  | 'OPENAI'
  | '%future added value';

/** Input for volunteer accepting a rescue */
export type AcceptRescueInput = {
  currentLat?: number | null | undefined;
  currentLng?: number | null | undefined;
  estimatedArrival?: number | null | undefined;
  rescueId: string | number;
};

/** Activity pattern */
export type ActivityPattern =
  | 'BOTH'
  | 'CREPUSCULAR'
  | 'DIURNAL'
  | 'NOCTURNAL'
  | '%future added value';

export type AntivenomStatus =
  | 'AVAILABLE'
  | 'LOW_STOCK'
  | 'NOT_SUPPORTED'
  | 'OUT_OF_STOCK'
  | 'UNKNOWN'
  | '%future added value';

/** Input for assigning a rescue to a volunteer */
export type AssignRescueInput = {
  notes?: string | null | undefined;
  rescueId: string | number;
  volunteerId: string | number;
};

/** Availability time preference */
export type AvailabilityTime =
  | 'ANYTIME'
  | 'EVENINGS'
  | 'WEEKDAYS'
  | 'WEEKENDS'
  | '%future added value';

/** Input for changing password */
export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

/** Input for completing a rescue */
export type CompleteRescueInput = {
  antivenomAdministered?: boolean | null | undefined;
  antivenomType?: string | null | undefined;
  hospitalAdmission?: boolean | null | undefined;
  hospitalId?: string | null | undefined;
  hospitalNotes?: string | null | undefined;
  outcome: RescueOutcome;
  releaseLat?: number | null | undefined;
  releaseLng?: number | null | undefined;
  releaseLocation?: string | null | undefined;
  rescueId: string | number;
  rescueImages?: Array<string> | null | undefined;
  rescueReport: string;
  speciesId?: string | number | null | undefined;
  victimWentToHospital?: boolean | null | undefined;
};

/** Conservation status */
export type ConservationStatus =
  | 'CRITICALLY_ENDANGERED'
  | 'DATA_DEFICIENT'
  | 'ENDANGERED'
  | 'EXTINCT'
  | 'EXTINCT_IN_WILD'
  | 'LEAST_CONCERN'
  | 'NEAR_THREATENED'
  | 'VULNERABLE'
  | '%future added value';

/** Input for creating a rescue request */
export type CreateRescueRequestInput = {
  address: string;
  biteDetails?: string | null | undefined;
  email?: string | null | undefined;
  emergencyDetails?: string | null | undefined;
  hasBite?: boolean | null | undefined;
  isEmergency?: boolean | null | undefined;
  landmark?: string | null | undefined;
  lat?: number | null | undefined;
  lng?: number | null | undefined;
  locationAccuracy?: number | null | undefined;
  municipality: string;
  name: string;
  notes?: string | null | undefined;
  phone: string;
  snakeColor?: string | null | undefined;
  snakeDescription?: string | null | undefined;
  snakeImageUrl?: string | null | undefined;
  snakeImages?: Array<string> | null | undefined;
  snakeSize?: string | null | undefined;
  source?: RescueSource | null | undefined;
  ward?: number | null | undefined;
};

/** Danger level of snake species */
export type DangerLevel =
  | 'HARMLESS'
  | 'HIGHLY_DANGEROUS'
  | 'MEDICALLY_SIGNIFICANT'
  | 'MILDLY_VENOMOUS'
  | '%future added value';

export type DateRangeInput = {
  from: string;
  to: string;
};

/** Donation purpose */
export type DonationPurpose =
  | 'EDUCATION'
  | 'EMERGENCY_FUND'
  | 'EQUIPMENT'
  | 'GENERAL'
  | 'INFRASTRUCTURE'
  | 'MEDICAL'
  | 'RESEARCH'
  | 'TRAINING'
  | '%future added value';

/** Experience level of volunteer */
export type ExperienceLevel =
  | 'BEGINNER'
  | 'EXPERT'
  | 'INTERMEDIATE'
  | '%future added value';

/** Category of gallery image */
export type GalleryCategory =
  | 'EDUCATION'
  | 'EVENT'
  | 'HABITAT'
  | 'RESCUE'
  | 'SPECIES'
  | 'TRAINING'
  | 'VOLUNTEER'
  | '%future added value';

export type HospitalStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PERMANENTLY_CLOSED'
  | 'TEMPORARILY_CLOSED'
  | '%future added value';

export type HospitalType =
  | 'ARMY'
  | 'COMMUNITY'
  | 'GOVERNMENT'
  | 'NGO'
  | 'POLICE'
  | 'PRIVATE'
  | '%future added value';

/** User feedback on AI identification accuracy */
export type IdentificationFeedback =
  | 'CORRECT'
  | 'INCORRECT'
  | 'PARTIAL'
  | 'UNSURE'
  | '%future added value';

export type IncidentStatus =
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'CANCELLED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | '%future added value';

export type IncidentType =
  | 'OTHER'
  | 'SNAKE_BITE'
  | 'SNAKE_RESCUE'
  | 'SNAKE_SIGHTING'
  | '%future added value';

/** Input for user login */
export type LoginInput = {
  email: string;
  password: string;
};

export type MapBoundsInput = {
  /** Eastern boundary (max longitude) */
  east: number;
  /** Northern boundary (max latitude) */
  north: number;
  /** Southern boundary (min latitude) */
  south: number;
  /** Western boundary (min longitude) */
  west: number;
};

export type MapFiltersInput = {
  /** Date range filter */
  dateRange?: DateRangeInput | null | undefined;
  /** Filter by district */
  district?: string | null | undefined;
  /** Filter by incident statuses */
  incidentStatuses?: Array<IncidentStatus> | null | undefined;
  /** Filter by incident types */
  incidentTypes?: Array<IncidentType> | null | undefined;
  /** Filter by priorities */
  priorities?: Array<Priority> | null | undefined;
  /** Filter by province */
  province?: string | null | undefined;
  /** Filter by rescuer statuses */
  rescuerStatuses?: Array<RescuerStatus> | null | undefined;
  /** Filter by season */
  season?: Season | null | undefined;
  /** Show research-based historical hotspots */
  showHistoricalHotspots?: boolean | null | undefined;
  /** Show risk zones */
  showRiskZones?: boolean | null | undefined;
};

/** Category of contact message */
export type MessageCategory =
  | 'COMPLAINT'
  | 'DONATION'
  | 'FEEDBACK'
  | 'GENERAL'
  | 'MEDIA'
  | 'PARTNERSHIP'
  | 'RESCUE'
  | 'TECHNICAL'
  | 'VOLUNTEER'
  | '%future added value';

/** Priority of contact message */
export type MessagePriority =
  | 'HIGH'
  | 'LOW'
  | 'NORMAL'
  | 'URGENT'
  | '%future added value';

/** Status of contact message */
export type MessageStatus =
  | 'ARCHIVED'
  | 'CLOSED'
  | 'NEW'
  | 'READ'
  | 'RESPONDED'
  | '%future added value';

/** Priority level of notification */
export type NotificationPriority =
  | 'HIGH'
  | 'LOW'
  | 'NORMAL'
  | 'URGENT'
  | '%future added value';

/** Type of notification */
export type NotificationType =
  | 'ANNOUNCEMENT'
  | 'DONATION_RECEIVED'
  | 'RESCUE_ACCEPTED'
  | 'RESCUE_ASSIGNED'
  | 'RESCUE_CANCELLED'
  | 'RESCUE_COMPLETED'
  | 'RESCUE_CREATED'
  | 'SYSTEM_ALERT'
  | 'TRAINING_REMINDER'
  | 'TRAINING_SCHEDULED'
  | 'VOLUNTEER_APPROVED'
  | 'VOLUNTEER_REJECTED'
  | '%future added value';

/** Generic pagination input */
export type PaginationInput = {
  /** Number of items to return (max 100) */
  limit?: number | null | undefined;
  /** Page number (1-indexed) */
  page?: number | null | undefined;
};

/** Payment method */
export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'ESEWA'
  | 'FONEPAY'
  | 'IME_PAY'
  | 'KHALTI'
  | 'PAYPAL'
  | 'STRIPE'
  | '%future added value';

/** Payment status */
export type PaymentStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'REFUNDED'
  | '%future added value';

/** Category of blog post */
export type PostCategory =
  | 'ANNOUNCEMENT'
  | 'EDUCATION'
  | 'EVENT'
  | 'GUIDE'
  | 'NEWS'
  | 'RESEARCH'
  | 'SUCCESS_STORY'
  | '%future added value';

/** Status of blog post */
export type PostStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | '%future added value';

export type Priority =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | '%future added value';

/** Input for user registration */
export type RegisterInput = {
  email: string;
  language?: string | null | undefined;
  name: string;
  password: string;
  phone?: string | null | undefined;
  timezone?: string | null | undefined;
};

/** Outcome of a completed rescue */
export type RescueOutcome =
  | 'ALREADY_GONE'
  | 'DECEASED'
  | 'FALSE_ALARM'
  | 'NO_SNAKE_FOUND'
  | 'REFUSED_HELP'
  | 'RESCUED_RELOCATED'
  | '%future added value';

/** Priority level of a rescue request */
export type RescuePriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | '%future added value';

/** Filter input for rescue queries */
export type RescueRequestFilterInput = {
  assignedTo?: string | number | null | undefined;
  completedAfter?: string | null | undefined;
  completedBefore?: string | null | undefined;
  createdAfter?: string | null | undefined;
  createdBefore?: string | null | undefined;
  hasBite?: boolean | null | undefined;
  isEmergency?: boolean | null | undefined;
  municipalities?: Array<string> | null | undefined;
  municipality?: string | null | undefined;
  priorities?: Array<RescuePriority> | null | undefined;
  priority?: RescuePriority | null | undefined;
  search?: string | null | undefined;
  speciesId?: string | number | null | undefined;
  status?: RescueStatus | null | undefined;
  statuses?: Array<RescueStatus> | null | undefined;
};

/** Source of rescue request */
export type RescueSource =
  | 'APP'
  | 'PHONE'
  | 'TELEGRAM'
  | 'WEB'
  | '%future added value';

/** Status of a rescue request */
export type RescueStatus =
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'CANCELLED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | '%future added value';

export type RescuerStatus =
  | 'AVAILABLE'
  | 'BUSY'
  | 'EN_ROUTE'
  | 'OFFLINE'
  | 'ON_SITE'
  | 'SUSPENDED'
  | '%future added value';

/** Input for resending verification email */
export type ResendVerificationInput = {
  email: string;
};

/** Input for password reset with OTP code */
export type ResetPasswordInput = {
  code: string;
  email: string;
  newPassword: string;
};

export type RiskLevel =
  | 'EXTREME'
  | 'HIGH'
  | 'LOW'
  | 'MODERATE'
  | 'VERY_HIGH'
  | '%future added value';

export type Season =
  | 'AUTUMN'
  | 'MONSOON'
  | 'SPRING'
  | 'WINTER'
  | '%future added value';

/** Status of training session */
export type TrainingStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'ONGOING'
  | 'POSTPONED'
  | 'SCHEDULED'
  | '%future added value';

/** Type of training */
export type TrainingType =
  | 'ADVANCED'
  | 'BASIC'
  | 'DOCUMENTATION'
  | 'EQUIPMENT_HANDLING'
  | 'FIRST_AID'
  | 'REFRESHER'
  | 'SAFETY_PROTOCOLS'
  | 'SPECIES_IDENTIFICATION'
  | '%future added value';

export type TreatmentCenterType =
  | 'DISTRICT'
  | 'PRIMARY'
  | 'PRIVATE'
  | 'PROVINCIAL'
  | 'REFERRAL'
  | 'SPECIALIZED'
  | '%future added value';

/** Trend direction */
export type TrendDirection = 'DOWN' | 'STABLE' | 'UP' | '%future added value';

/** Input for profile update */
export type UpdateProfileInput = {
  avatar?: string | null | undefined;
  language?: string | null | undefined;
  name?: string | null | undefined;
  phone?: string | null | undefined;
  timezone?: string | null | undefined;
};

/** Input for updating rescue progress */
export type UpdateRescueProgressInput = {
  lat?: number | null | undefined;
  lng?: number | null | undefined;
  notes?: string | null | undefined;
  rescueId: string | number;
  status: RescueStatus;
};

/** Input for updating a rescue request */
export type UpdateRescueRequestInput = {
  address?: string | null | undefined;
  biteDetails?: string | null | undefined;
  emergencyDetails?: string | null | undefined;
  hasBite?: boolean | null | undefined;
  internalNotes?: string | null | undefined;
  isEmergency?: boolean | null | undefined;
  landmark?: string | null | undefined;
  lat?: number | null | undefined;
  lng?: number | null | undefined;
  municipality?: string | null | undefined;
  notes?: string | null | undefined;
  priority?: RescuePriority | null | undefined;
  snakeColor?: string | null | undefined;
  snakeDescription?: string | null | undefined;
  snakeImageUrl?: string | null | undefined;
  snakeImages?: Array<string> | null | undefined;
  snakeSize?: string | null | undefined;
  speciesId?: string | number | null | undefined;
  status?: RescueStatus | null | undefined;
  stillPresent?: boolean | null | undefined;
  ward?: number | null | undefined;
};

/** Upload source for identification */
export type UploadSource =
  | 'API'
  | 'APP'
  | 'TELEGRAM'
  | 'WEB'
  | '%future added value';

/** User role for role-based access control */
export type UserRole =
  /** Administrator with full system access */
  | 'ADMIN'
  /** Regular citizen who can submit rescue requests */
  | 'CITIZEN'
  /** District-level coordinator managing volunteers */
  | 'DISTRICT_COORDINATOR'
  /** Super administrator with system configuration access */
  | 'SUPER_ADMIN'
  /** Verified snake rescuer with full rescue capabilities */
  | 'VERIFIED_RESCUER'
  /** Approved volunteer (not yet verified) */
  | 'VOLUNTEER'
  | '%future added value';

/** Vehicle availability */
export type VehicleType =
  | 'AMBULANCE'
  | 'BICYCLE'
  | 'BIKE'
  | 'BOTH'
  | 'CAR'
  | 'MOTORBIKE'
  | 'NONE'
  | 'OTHER'
  | 'RESCUE_VAN'
  | 'TRUCK'
  | '%future added value';

/** Venom type */
export type VenomType =
  | 'CYTOTOXIC'
  | 'HEMOTOXIC'
  | 'MIXED'
  | 'NEUROTOXIC'
  | '%future added value';

export type VerificationFreshness =
  | 'FRESH'
  | 'NEVER'
  | 'STALE'
  | 'VERY_OLD'
  | '%future added value';

export type VerificationStatus =
  | 'HISTORICAL'
  | 'STALE'
  | 'UNVERIFIED'
  | 'VERIFIED'
  | '%future added value';

export type VerificationType =
  | 'EDCD_RECORD'
  | 'HOSPITAL_REPORT'
  | 'OFFICIAL_DOCUMENT'
  | 'PHONE_CALL'
  | 'PROVINCIAL_HEALTH'
  | 'SITE_VISIT'
  | '%future added value';

/** Input for email verification using OTP code only */
export type VerifyEmailInput = {
  code: string;
  email: string;
};

/** Status of volunteer application/account */
export type VolunteerStatus =
  | 'APPROVED'
  | 'INACTIVE'
  | 'PENDING'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'VERIFIED'
  | '%future added value';

export type CreateRescueRequestMutationVariables = Exact<{
  input: CreateRescueRequestInput;
}>;

export type CreateRescueRequestMutation = {
  createRescueRequest: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    priority: RescuePriority;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImages: Array<string>;
    isEmergency: boolean;
    hasBite: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type AssignRescueMutationVariables = Exact<{
  input: AssignRescueInput;
}>;

export type AssignRescueMutation = {
  assignRescue: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    assignedAt: string | null;
    updatedAt: string;
    assignedBy: { id: string; name: string } | null;
    assignedVolunteer: { id: string; name: string } | null;
  };
};

export type UpdateRescueRequestMutationVariables = Exact<{
  id: string | number;
  input: UpdateRescueRequestInput;
}>;

export type UpdateRescueRequestMutation = {
  updateRescueRequest: {
    id: string;
    priority: RescuePriority;
    updatedAt: string;
  };
};

export type AcceptRescueMutationVariables = Exact<{
  input: AcceptRescueInput;
}>;

export type AcceptRescueMutation = {
  acceptRescue: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    acceptedAt: string | null;
    updatedAt: string;
  };
};

export type UpdateRescueProgressMutationVariables = Exact<{
  input: UpdateRescueProgressInput;
}>;

export type UpdateRescueProgressMutation = {
  updateRescueProgress: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    startedAt: string | null;
    arrivedAt: string | null;
    updatedAt: string;
  };
};

export type CompleteRescueMutationVariables = Exact<{
  input: CompleteRescueInput;
}>;

export type CompleteRescueMutation = {
  completeRescue: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    completedAt: string | null;
    outcome: RescueOutcome | null;
    rescueReport: string | null;
    rescueImages: Array<string>;
    updatedAt: string;
    species: { id: string; name: string } | null;
  };
};

export type CancelRescueMutationVariables = Exact<{
  rescueId: string | number;
  reason?: string | null | undefined;
}>;

export type CancelRescueMutation = {
  cancelRescue: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    updatedAt: string;
  };
};

export type RescueRequestQueryVariables = Exact<{
  id: string | number;
}>;

export type RescueRequestQuery = {
  rescueRequest: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
    priority: RescuePriority;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImages: Array<string>;
    isEmergency: boolean;
    hasBite: boolean;
    assignedAt: string | null;
    acceptedAt: string | null;
    startedAt: string | null;
    arrivedAt: string | null;
    completedAt: string | null;
    outcome: RescueOutcome | null;
    rescueReport: string | null;
    rescueImages: Array<string>;
    rescueDuration: number | null;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      experience: ExperienceLevel;
      experienceYears: number | null;
      totalRescues: number;
      rating: number | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
    } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      lat: number | null;
      lng: number | null;
      createdAt: string;
      user: { id: string; name: string } | null;
    }>;
  } | null;
};

export type MyRescueRequestsQueryVariables = Exact<{
  pagination?: PaginationInput | null | undefined;
  filter?: RescueRequestFilterInput | null | undefined;
}>;

export type MyRescueRequestsQuery = {
  myRescueRequests: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        referenceNumber: string | null;
        status: RescueStatus;
        priority: RescuePriority;
        municipality: string;
        address: string;
        snakeDescription: string | null;
        isEmergency: boolean;
        createdAt: string;
        assignedVolunteer: { id: string; name: string } | null;
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type MyAssignedRescuesQueryVariables = Exact<{
  pagination?: PaginationInput | null | undefined;
  filter?: RescueRequestFilterInput | null | undefined;
}>;

export type MyAssignedRescuesQuery = {
  myAssignedRescues: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        referenceNumber: string | null;
        status: RescueStatus;
        priority: RescuePriority;
        municipality: string;
        ward: number | null;
        address: string;
        landmark: string | null;
        lat: number | null;
        lng: number | null;
        snakeDescription: string | null;
        snakeSize: string | null;
        snakeColor: string | null;
        isEmergency: boolean;
        assignedAt: string | null;
        acceptedAt: string | null;
        user: { id: string; name: string; phone: string | null } | null;
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type ActiveRescuesQueryVariables = Exact<{
  pagination?: PaginationInput | null | undefined;
}>;

export type ActiveRescuesQuery = {
  activeRescues: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        referenceNumber: string | null;
        status: RescueStatus;
        priority: RescuePriority;
        municipality: string;
        ward: number | null;
        address: string;
        lat: number | null;
        lng: number | null;
        snakeDescription: string | null;
        isEmergency: boolean;
        createdAt: string;
        assignedAt: string | null;
        acceptedAt: string | null;
        user: { id: string; name: string; phone: string | null } | null;
        assignedVolunteer: { id: string; name: string } | null;
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
};

export type AiIdentificationCoreFragment = {
  id: string;
  imageUrl: string;
  imageThumbnail: string | null;
  confidence: number;
  provider: AiProvider;
  model: string;
  createdAt: string;
};

export type AiIdentificationWithSpeciesFragment = {
  venomousDetected: boolean | null;
  dangerAssessment: string | null;
  id: string;
  imageUrl: string;
  imageThumbnail: string | null;
  confidence: number;
  provider: AiProvider;
  model: string;
  createdAt: string;
  species: {
    id: string;
    name: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    imageUrl: string | null;
  } | null;
};

export type AiIdentificationWithAlternativesFragment = {
  venomousDetected: boolean | null;
  dangerAssessment: string | null;
  id: string;
  imageUrl: string;
  imageThumbnail: string | null;
  confidence: number;
  provider: AiProvider;
  model: string;
  createdAt: string;
  alternativeMatches: Array<{
    confidence: number;
    reasoning: string | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    };
  }>;
  species: {
    id: string;
    name: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    imageUrl: string | null;
  } | null;
};

export type AiIdentificationFullFragment = {
  uploadSource: UploadSource;
  promptUsed: string | null;
  responseTime: number | null;
  colorDetected: Array<string>;
  sizeEstimate: string | null;
  userFeedback: IdentificationFeedback | null;
  venomousDetected: boolean | null;
  dangerAssessment: string | null;
  id: string;
  imageUrl: string;
  imageThumbnail: string | null;
  confidence: number;
  provider: AiProvider;
  model: string;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  correctSpecies: { id: string; name: string; scientificName: string } | null;
  alternativeMatches: Array<{
    confidence: number;
    reasoning: string | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    };
  }>;
  species: {
    id: string;
    name: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    imageUrl: string | null;
  } | null;
};

export type AiIdentificationListItemFragment = {
  userFeedback: IdentificationFeedback | null;
  id: string;
  imageUrl: string;
  imageThumbnail: string | null;
  confidence: number;
  provider: AiProvider;
  model: string;
  createdAt: string;
  species: { id: string; name: string; venomous: boolean } | null;
};

export type DashboardStatsOverviewFragment = {
  totalRescues: number;
  activeRescues: number;
  completedRescues: number;
  completionRate: number;
  averageResponseTime: number;
  totalVolunteers: number;
  activeVolunteers: number;
  totalUsers: number;
  totalDonations: number;
  totalDonationAmount: number;
};

export type TrendDataFieldsFragment = {
  current: number;
  previous: number;
  change: number;
  direction: TrendDirection;
};

export type TimeSeriesDataFragment = {
  timestamp: string;
  value: number;
  label: string | null;
};

export type UserFieldsFragment = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayloadFieldsFragment = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  login: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      phone: string | null;
      emailVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;

export type RegisterMutation = {
  register: {
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string | null;
      role: UserRole;
    };
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { logout: boolean };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never }>;

export type RefreshTokenMutation = {
  refreshToken: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      phone: string | null;
      emailVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type ForgotPasswordMutationVariables = Exact<{
  email: string;
}>;

export type ForgotPasswordMutation = {
  forgotPassword: { message: string; expiresAt: string };
};

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;

export type ResetPasswordMutation = { resetPassword: boolean };

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput;
}>;

export type VerifyEmailMutation = {
  verifyEmail: {
    success: boolean;
    message: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      phone: string | null;
      emailVerified: boolean;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
};

export type ResendVerificationMutationVariables = Exact<{
  input: ResendVerificationInput;
}>;

export type ResendVerificationMutation = { resendVerification: boolean };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;

export type ChangePasswordMutation = {
  changePassword: { success: boolean; message: string };
};

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;

export type UpdateProfileMutation = {
  updateProfile: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type BlogPostCoreFragment = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: PostCategory;
  status: PostStatus;
  imageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type BlogPostWithAuthorFragment = {
  tags: Array<string>;
  views: number;
  likes: number;
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: PostCategory;
  status: PostStatus;
  imageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null };
};

export type BlogPostFullFragment = {
  content: string;
  images: Array<string>;
  videoUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: Array<string>;
  scheduledAt: string | null;
  commentsEnabled: boolean;
  commentCount: number;
  shares: number;
  updatedAt: string;
  tags: Array<string>;
  views: number;
  likes: number;
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: PostCategory;
  status: PostStatus;
  imageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null };
};

export type BlogPostListItemFragment = {
  tags: Array<string>;
  views: number;
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: PostCategory;
  status: PostStatus;
  imageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; name: string };
};

export type GalleryImageCoreFragment = {
  id: string;
  title: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: GalleryCategory | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export type GalleryImageWithContextFragment = {
  description: string | null;
  tags: Array<string>;
  id: string;
  title: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: GalleryCategory | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  rescue: { id: string; referenceNumber: string | null } | null;
  species: { id: string; name: string; scientificName: string } | null;
};

export type GalleryImageFullFragment = {
  views: number;
  likes: number;
  fileSize: number | null;
  dimensions: string | null;
  format: string | null;
  updatedAt: string;
  description: string | null;
  tags: Array<string>;
  id: string;
  title: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: GalleryCategory | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  uploader: { id: string; name: string; avatar: string | null } | null;
  rescue: { id: string; referenceNumber: string | null } | null;
  species: { id: string; name: string; scientificName: string } | null;
};

export type GalleryImageListItemFragment = {
  views: number;
  likes: number;
  id: string;
  title: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: GalleryCategory | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export type ContactMessageCoreFragment = {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: MessageCategory;
  status: MessageStatus;
  priority: MessagePriority;
  createdAt: string;
};

export type ContactMessageWithDetailsFragment = {
  phone: string | null;
  message: string;
  responded: boolean;
  respondedAt: string | null;
  id: string;
  name: string;
  email: string;
  subject: string;
  category: MessageCategory;
  status: MessageStatus;
  priority: MessagePriority;
  createdAt: string;
};

export type ContactMessageFullFragment = {
  response: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  source: string;
  updatedAt: string;
  phone: string | null;
  message: string;
  responded: boolean;
  respondedAt: string | null;
  id: string;
  name: string;
  email: string;
  subject: string;
  category: MessageCategory;
  status: MessageStatus;
  priority: MessagePriority;
  createdAt: string;
  assignedTo: { id: string; name: string; email: string } | null;
};

export type ContactMessageListItemFragment = {
  responded: boolean;
  id: string;
  name: string;
  email: string;
  subject: string;
  category: MessageCategory;
  status: MessageStatus;
  priority: MessagePriority;
  createdAt: string;
};

export type HospitalBasicFragment = {
  id: string;
  name: string;
  address: string;
  municipality: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  emergencyPhone: string | null;
};

export type HospitalCapabilityFragment = {
  emergencyAvailable: boolean;
  emergency24x7: boolean;
  snakebiteTreatmentAvailable: boolean;
  treatmentCenterType: TreatmentCenterType | null;
  antivenomStatus: AntivenomStatus;
  antivenomLastVerifiedAt: string | null;
  antivenomVerificationFreshness: VerificationFreshness;
  ventilatorAvailable: boolean;
  icuAvailable: boolean;
  ambulanceAvailable: boolean;
};

export type HospitalFullFragment = {
  email: string | null;
  ward: number | null;
  antivenomStockQuantity: number | null;
  antivenomStockPublic: boolean;
  bloodBankAvailable: boolean;
  source: string | null;
  sourceYear: string | null;
  sourceUrl: string | null;
  verificationStatus: VerificationStatus;
  officialTreatmentCenter: boolean;
  status: HospitalStatus;
  hospitalType: HospitalType | null;
  bedCapacity: number | null;
  specializations: Array<string>;
  notes: string | null;
  markerColor: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  address: string;
  municipality: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  emergencyPhone: string | null;
  emergencyAvailable: boolean;
  emergency24x7: boolean;
  snakebiteTreatmentAvailable: boolean;
  treatmentCenterType: TreatmentCenterType | null;
  antivenomStatus: AntivenomStatus;
  antivenomLastVerifiedAt: string | null;
  antivenomVerificationFreshness: VerificationFreshness;
  ventilatorAvailable: boolean;
  icuAvailable: boolean;
  ambulanceAvailable: boolean;
};

export type HospitalMapMarkerFragment = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  snakebiteTreatmentAvailable: boolean;
  antivenomStatus: AntivenomStatus;
  antivenomVerificationFreshness: VerificationFreshness;
  markerColor: string;
  distanceFromUser: number | null;
};

export type HospitalVerificationBasicFragment = {
  id: string;
  hospitalId: string;
  verifiedBy: string;
  verificationType: VerificationType;
  snakebiteTreatment: boolean | null;
  antivenomStatus: AntivenomStatus | null;
  antivenomQuantity: number | null;
  emergencyStatus: boolean | null;
  ventilatorStatus: boolean | null;
  verificationDate: string;
  nextVerificationDue: string | null;
};

export type HospitalVerificationFullFragment = {
  notes: string | null;
  evidenceUrls: Array<string>;
  officialDocumentUrl: string | null;
  contactPerson: string | null;
  contactDesignation: string | null;
  contactPhone: string | null;
  createdAt: string;
  id: string;
  hospitalId: string;
  verifiedBy: string;
  verificationType: VerificationType;
  snakebiteTreatment: boolean | null;
  antivenomStatus: AntivenomStatus | null;
  antivenomQuantity: number | null;
  emergencyStatus: boolean | null;
  ventilatorStatus: boolean | null;
  verificationDate: string;
  nextVerificationDue: string | null;
};

export type NearestFacilityInfoFragment = {
  distance: number;
  travelTimeEstimate: string;
  recommendationReason: string | null;
  hospital: {
    email: string | null;
    ward: number | null;
    antivenomStockQuantity: number | null;
    antivenomStockPublic: boolean;
    bloodBankAvailable: boolean;
    source: string | null;
    sourceYear: string | null;
    sourceUrl: string | null;
    verificationStatus: VerificationStatus;
    officialTreatmentCenter: boolean;
    status: HospitalStatus;
    hospitalType: HospitalType | null;
    bedCapacity: number | null;
    specializations: Array<string>;
    notes: string | null;
    markerColor: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    address: string;
    municipality: string;
    district: string;
    province: string;
    latitude: number;
    longitude: number;
    phone: string | null;
    emergencyPhone: string | null;
    emergencyAvailable: boolean;
    emergency24x7: boolean;
    snakebiteTreatmentAvailable: boolean;
    treatmentCenterType: TreatmentCenterType | null;
    antivenomStatus: AntivenomStatus;
    antivenomLastVerifiedAt: string | null;
    antivenomVerificationFreshness: VerificationFreshness;
    ventilatorAvailable: boolean;
    icuAvailable: boolean;
    ambulanceAvailable: boolean;
  };
};

export type MapOverviewQueryVariables = Exact<{
  bounds: MapBoundsInput;
  filters?: MapFiltersInput | null | undefined;
}>;

export type MapOverviewQuery = {
  mapOverview: {
    incidents: Array<{
      id: string;
      latitude: number;
      longitude: number;
      status: IncidentStatus;
      priority: Priority;
      reportedAt: string;
      municipality: string | null;
    }>;
    rescuers: Array<{
      id: string;
      latitude: number;
      longitude: number;
      name: string;
      isAvailable: boolean;
      lastLocationUpdate: string | null;
    }>;
    treatmentCenters: Array<{
      id: string;
      latitude: number;
      longitude: number;
      name: string;
      antivenomStatus: AntivenomStatus;
      snakebiteTreatmentAvailable: boolean;
      emergency24x7: boolean;
      district: string | null;
      phone: string | null;
    }>;
    hotspots: Array<{
      id: string;
      name: string;
      riskLevel: RiskLevel;
      riskScore: number;
      district: string | null;
      province: string | null;
      source: string;
      sourceUrl: string | null;
      studyYear: number | null;
      geometry: unknown;
    }>;
    statistics: {
      totalIncidents: number;
      activeRescues: number;
      availableRescuers: number;
      treatmentCenters: number;
      criticalIncidents: number;
      avgResponseTimeMinutes: number | null;
      successRate: number | null;
    };
    metadata: {
      generatedAt: string;
      cached: boolean;
      freshnessSeconds: number;
    };
  };
};

export type SnakebiteHotspotsQueryVariables = Exact<{
  province?: string | null | undefined;
  district?: string | null | undefined;
}>;

export type SnakebiteHotspotsQuery = {
  snakebiteHotspots: Array<{
    id: string;
    name: string;
    description: string | null;
    geometry: unknown;
    district: string | null;
    province: string | null;
    riskScore: number;
    riskLevel: RiskLevel;
    populationAtRisk: number | null;
    source: string;
    sourceUrl: string | null;
    studyYear: number | null;
    methodology: string | null;
    confidence: number | null;
    season: Season | null;
    active: boolean;
  }>;
};

export type NotificationCoreFragment = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: NotificationPriority;
  createdAt: string;
};

export type NotificationWithLinkFragment = {
  link: string | null;
  actionUrl: string | null;
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: NotificationPriority;
  createdAt: string;
};

export type NotificationWithContextFragment = {
  metadata: any;
  link: string | null;
  actionUrl: string | null;
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: NotificationPriority;
  createdAt: string;
  rescue: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
  } | null;
};

export type NotificationFullFragment = {
  sentViaApp: boolean;
  sentViaEmail: boolean;
  sentViaSMS: boolean;
  sentViaTelegram: boolean;
  readAt: string | null;
  expiresAt: string | null;
  metadata: any;
  link: string | null;
  actionUrl: string | null;
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: NotificationPriority;
  createdAt: string;
  user: { id: string; name: string; email: string };
  rescue: {
    id: string;
    referenceNumber: string | null;
    status: RescueStatus;
  } | null;
};

export type NotificationListItemFragment = {
  link: string | null;
  readAt: string | null;
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: NotificationPriority;
  createdAt: string;
};

export type NotificationPreferencesFieldsFragment = {
  userId: string;
  enableApp: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  enableTelegram: boolean;
  rescueUpdates: boolean;
  volunteerUpdates: boolean;
  trainingReminders: boolean;
  donationReceipts: boolean;
  systemAnnouncements: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  timezone: string;
  updatedAt: string;
};

export type DonationCoreFragment = {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  anonymous: boolean;
  createdAt: string;
};

export type DonationWithPaymentFragment = {
  transactionId: string | null;
  paymentGateway: string;
  paidAt: string | null;
  receiptNumber: string | null;
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  anonymous: boolean;
  createdAt: string;
};

export type DonationFullFragment = {
  donorEmail: string | null;
  donorPhone: string | null;
  amountUSD: number | null;
  gatewayResponse: any;
  purpose: DonationPurpose | null;
  campaign: string | null;
  message: string | null;
  receiptUrl: string | null;
  invoiceUrl: string | null;
  verifiedAt: string | null;
  verificationNotes: string | null;
  refundedAt: string | null;
  refundReason: string | null;
  refundAmount: number | null;
  source: string;
  updatedAt: string;
  transactionId: string | null;
  paymentGateway: string;
  paidAt: string | null;
  receiptNumber: string | null;
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  anonymous: boolean;
  createdAt: string;
  donor: { id: string; name: string; email: string } | null;
  verifiedBy: { id: string; name: string } | null;
};

export type DonationListItemFragment = {
  purpose: DonationPurpose | null;
  paidAt: string | null;
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  anonymous: boolean;
  createdAt: string;
};

export type PaymentGatewayConfigFieldsFragment = {
  method: PaymentMethod;
  enabled: boolean;
  displayName: string;
  description: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  currencies: Array<string>;
  testMode: boolean;
};

export type RescueCoreFragment = {
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  status: RescueStatus;
  priority: RescuePriority;
  isEmergency: boolean;
  createdAt: string;
};

export type RescueWithLocationFragment = {
  ward: number | null;
  landmark: string | null;
  lat: number | null;
  lng: number | null;
  locationAccuracy: number | null;
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  status: RescueStatus;
  priority: RescuePriority;
  isEmergency: boolean;
  createdAt: string;
};

export type RescueWithSnakeInfoFragment = {
  snakeDescription: string | null;
  snakeSize: string | null;
  snakeColor: string | null;
  snakeImageUrl: string | null;
  snakeImages: Array<string>;
  ward: number | null;
  landmark: string | null;
  lat: number | null;
  lng: number | null;
  locationAccuracy: number | null;
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  status: RescueStatus;
  priority: RescuePriority;
  isEmergency: boolean;
  createdAt: string;
  species: {
    id: string;
    name: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
  } | null;
};

export type RescueWithAssignmentFragment = {
  assignedAt: string | null;
  acceptedAt: string | null;
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  status: RescueStatus;
  priority: RescuePriority;
  isEmergency: boolean;
  createdAt: string;
  assignedVolunteer: {
    id: string;
    name: string;
    contact: string;
    currentLat: number | null;
    currentLng: number | null;
  } | null;
};

export type RescueFullFragment = {
  email: string | null;
  stillPresent: boolean;
  notes: string | null;
  internalNotes: string | null;
  assignedAt: string | null;
  acceptedAt: string | null;
  arrivedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  outcome: RescueOutcome | null;
  rescueReport: string | null;
  rescueImages: Array<string>;
  rescueDuration: number | null;
  verifiedAt: string | null;
  emergencyDetails: string | null;
  hasBite: boolean;
  biteDetails: string | null;
  source: RescueSource;
  referenceNumber: string | null;
  updatedAt: string;
  snakeDescription: string | null;
  snakeSize: string | null;
  snakeColor: string | null;
  snakeImageUrl: string | null;
  snakeImages: Array<string>;
  ward: number | null;
  landmark: string | null;
  lat: number | null;
  lng: number | null;
  locationAccuracy: number | null;
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  status: RescueStatus;
  priority: RescuePriority;
  isEmergency: boolean;
  createdAt: string;
  assignedVolunteer: {
    id: string;
    name: string;
    contact: string;
    vehicle: VehicleType;
  } | null;
  species: {
    id: string;
    name: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
  } | null;
};

export type TimelineEventFragment = {
  id: string;
  event: string;
  description: string | null;
  metadata: any;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  user: { id: string; name: string } | null;
};

export type RescueListItemFragment = {
  ward: number | null;
  lat: number | null;
  lng: number | null;
  snakeImageUrl: string | null;
  referenceNumber: string | null;
  updatedAt: string;
  id: string;
  name: string;
  phone: string;
  municipality: string;
  address: string;
  status: RescueStatus;
  priority: RescuePriority;
  isEmergency: boolean;
  createdAt: string;
  species: { id: string; name: string; venomous: boolean } | null;
  assignedVolunteer: { id: string; name: string } | null;
};

export type SnakeSpeciesCoreFragment = {
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  imageUrl: string | null;
};

export type SnakeSpeciesIdentificationFragment = {
  color: string | null;
  pattern: string | null;
  distinctiveFeatures: Array<string>;
  identificationGuide: string | null;
  averageLength: string | null;
  maxLength: string | null;
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  imageUrl: string | null;
};

export type SnakeSpeciesSafetyFragment = {
  venomType: VenomType | null;
  safetyTips: string | null;
  emergencyAdvice: string | null;
  firstAidSteps: Array<string>;
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  imageUrl: string | null;
};

export type SnakeSpeciesFullFragment = {
  localNames: Array<string>;
  aliases: Array<string>;
  family: string | null;
  genus: string | null;
  species: string | null;
  venomType: VenomType | null;
  behavior: string | null;
  habitat: string | null;
  activeTime: ActivityPattern | null;
  diet: string | null;
  safetyTips: string | null;
  emergencyAdvice: string | null;
  firstAidSteps: Array<string>;
  foundInNepal: boolean;
  regions: Array<string>;
  altitudeRange: string | null;
  conservationStatus: ConservationStatus | null;
  protected: boolean;
  images: Array<string>;
  videoUrl: string | null;
  rescueCount: number;
  identificationCount: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  color: string | null;
  pattern: string | null;
  distinctiveFeatures: Array<string>;
  identificationGuide: string | null;
  averageLength: string | null;
  maxLength: string | null;
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  imageUrl: string | null;
};

export type SnakeSpeciesListItemFragment = {
  family: string | null;
  regions: Array<string>;
  rescueCount: number;
  verified: boolean;
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  imageUrl: string | null;
};

export type TrainingCoreFragment = {
  id: string;
  title: string;
  type: TrainingType;
  scheduledAt: string;
  duration: number;
  location: string;
  status: TrainingStatus;
  maxParticipants: number;
  registeredCount: number;
  availableSeats: number;
};

export type TrainingWithDetailsFragment = {
  description: string | null;
  instructor: string | null;
  materials: Array<string>;
  certificate: string | null;
  createdAt: string;
  id: string;
  title: string;
  type: TrainingType;
  scheduledAt: string;
  duration: number;
  location: string;
  status: TrainingStatus;
  maxParticipants: number;
  registeredCount: number;
  availableSeats: number;
};

export type TrainingFullFragment = {
  updatedAt: string;
  description: string | null;
  instructor: string | null;
  materials: Array<string>;
  certificate: string | null;
  createdAt: string;
  id: string;
  title: string;
  type: TrainingType;
  scheduledAt: string;
  duration: number;
  location: string;
  status: TrainingStatus;
  maxParticipants: number;
  registeredCount: number;
  availableSeats: number;
  participants: Array<{ id: string; name: string; email: string }>;
  volunteers: Array<{ id: string; name: string; contact: string }>;
};

export type TrainingListItemFragment = {
  instructor: string | null;
  id: string;
  title: string;
  type: TrainingType;
  scheduledAt: string;
  duration: number;
  location: string;
  status: TrainingStatus;
  maxParticipants: number;
  registeredCount: number;
  availableSeats: number;
};

export type VolunteerCoreFragment = {
  id: string;
  name: string;
  contact: string;
  municipality: string;
  status: VolunteerStatus;
  experience: ExperienceLevel;
  isAvailableNow: boolean;
  totalRescues: number;
  rating: number | null;
};

export type VolunteerWithLocationFragment = {
  address: string;
  ward: number | null;
  currentLat: number | null;
  currentLng: number | null;
  assignedZone: string | null;
  coverageRadius: number;
  id: string;
  name: string;
  contact: string;
  municipality: string;
  status: VolunteerStatus;
  experience: ExperienceLevel;
  isAvailableNow: boolean;
  totalRescues: number;
  rating: number | null;
};

export type VolunteerWithPerformanceFragment = {
  completedRescues: number;
  cancelledRescues: number;
  successRate: number | null;
  averageResponseTime: number | null;
  averageRescueTime: number | null;
  totalRatings: number;
  id: string;
  name: string;
  contact: string;
  municipality: string;
  status: VolunteerStatus;
  experience: ExperienceLevel;
  isAvailableNow: boolean;
  totalRescues: number;
  rating: number | null;
};

export type VolunteerFullFragment = {
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  experienceYears: number | null;
  vehicle: VehicleType;
  vehicleDetails: string | null;
  skills: Array<string>;
  certifications: Array<string>;
  languages: Array<string>;
  availableTime: AvailabilityTime;
  availableDays: Array<string>;
  emergencyAvailability: boolean;
  lastLocationUpdate: string | null;
  imageUrl: string | null;
  bio: string | null;
  verifiedAt: string | null;
  trainingCompleted: boolean;
  trainingDate: string | null;
  certificationExpiry: string | null;
  hasEquipment: boolean;
  equipment: Array<string>;
  completedRescues: number;
  successRate: number | null;
  averageResponseTime: number | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  address: string;
  ward: number | null;
  currentLat: number | null;
  currentLng: number | null;
  assignedZone: string | null;
  coverageRadius: number;
  id: string;
  name: string;
  contact: string;
  municipality: string;
  status: VolunteerStatus;
  experience: ExperienceLevel;
  isAvailableNow: boolean;
  totalRescues: number;
};

export type VolunteerForDispatchFragment = {
  vehicle: VehicleType;
  hasEquipment: boolean;
  equipment: Array<string>;
  isAvailableNow: boolean;
  emergencyAvailability: boolean;
  experienceYears: number | null;
  rating: number | null;
  successRate: number | null;
  address: string;
  ward: number | null;
  currentLat: number | null;
  currentLng: number | null;
  assignedZone: string | null;
  coverageRadius: number;
  id: string;
  name: string;
  contact: string;
  municipality: string;
  status: VolunteerStatus;
  experience: ExperienceLevel;
  totalRescues: number;
};

export type VolunteerListItemFragment = {
  email: string | null;
  vehicle: VehicleType;
  verifiedAt: string | null;
  createdAt: string;
  id: string;
  name: string;
  contact: string;
  municipality: string;
  status: VolunteerStatus;
  experience: ExperienceLevel;
  isAvailableNow: boolean;
  totalRescues: number;
  rating: number | null;
};
