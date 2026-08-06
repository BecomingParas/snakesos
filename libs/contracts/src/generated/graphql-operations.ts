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
  /** ISO 8601 datetime string (e.g., "2024-08-05T12:30:00Z") */
  DateTime: { input: string; output: string };
  /** Valid email address format */
  Email: { input: string; output: string };
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
  expiresIn: Scalars['Int']['output'];
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
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

/** Input for changing password */
export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

/** Input for completing a rescue */
export type CompleteRescueInput = {
  outcome: RescueOutcome;
  releaseLat?: InputMaybe<Scalars['Latitude']['input']>;
  releaseLng?: InputMaybe<Scalars['Longitude']['input']>;
  releaseLocation?: InputMaybe<Scalars['String']['input']>;
  rescueId: Scalars['ID']['input'];
  rescueImages?: InputMaybe<Array<Scalars['String']['input']>>;
  rescueReport: Scalars['String']['input'];
  speciesId?: InputMaybe<Scalars['ID']['input']>;
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

/** Input for user login */
export type LoginInput = {
  email: Scalars['Email']['input'];
  password: Scalars['String']['input'];
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
  /** Volunteer accepts rescue assignment */
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
  /** Mark rescue as completed */
  completeRescue: RescueRequest;
  /** Mark training as completed (admin) */
  completeTraining: Training;
  /** Create a blog post */
  createBlogPost: BlogPost;
  /** Create a donation */
  createDonation: Donation;
  /** Create a notification (admin only) */
  createNotification: Notification;
  /** Create a new rescue request */
  createRescueRequest: RescueRequest;
  /** Create new snake species (admin only) */
  createSnakeSpecies: SnakeSpecies;
  /** Create a training session */
  createTraining: Training;
  /** Delete AI identification */
  deleteAIIdentification: SuccessResponse;
  /** Delete a blog post (soft delete) */
  deleteBlogPost: SuccessResponse;
  /** Delete contact message (soft delete) */
  deleteContactMessage: SuccessResponse;
  /** Delete gallery image (soft delete) */
  deleteGalleryImage: SuccessResponse;
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
  /** Delete volunteer profile (soft delete) */
  deleteVolunteer: SuccessResponse;
  /** Enroll in training session */
  enrollInTraining: Training;
  /** Generate donation receipt */
  generateDonationReceipt: Donation;
  /** Identify snake from image using AI */
  identifySnake: AiIdentification;
  /** Increment blog post views */
  incrementBlogPostViews: BlogPost;
  /** Increment gallery image views */
  incrementGalleryImageViews: GalleryImage;
  /** Like a blog post */
  likeBlogPost: BlogPost;
  /** Like a gallery image */
  likeGalleryImage: GalleryImage;
  /** Mark all notifications as read */
  markAllNotificationsAsRead: SuccessResponse;
  /** Mark message as read */
  markMessageAsRead: ContactMessage;
  /** Mark notification as read */
  markNotificationAsRead: Notification;
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
  /** Refund donation (admin) */
  refundDonation: Donation;
  /** Reopen cancelled/closed rescue */
  reopenRescue: RescueRequest;
  /** Reprocess identification with different model */
  reprocessIdentification: AiIdentification;
  /** Respond to a contact message */
  respondToMessage: ContactMessage;
  /** Approve or reject volunteer application */
  reviewVolunteerApplication: Volunteer;
  /** Send bulk notifications (admin only) */
  sendBulkNotifications: BulkOperationResult;
  /** Submit a contact message */
  submitContactMessage: ContactMessage;
  /** Suspend volunteer */
  suspendVolunteer: Volunteer;
  /** Test notification delivery */
  testNotificationDelivery: SuccessResponse;
  /** Track page view */
  trackPageView: SuccessResponse;
  /** Update AI model configuration (admin only) */
  updateAIModelConfig: AiModelConfig;
  /** Update a blog post */
  updateBlogPost: BlogPost;
  /** Update gallery image */
  updateGalleryImage: GalleryImage;
  /** Update message status */
  updateMessageStatus: ContactMessage;
  /** Update notification preferences */
  updateNotificationPreferences: NotificationPreferences;
  /** Update payment gateway configuration */
  updatePaymentGateway: PaymentGatewayConfig;
  /** Update rescue progress (volunteer) */
  updateRescueProgress: RescueRequest;
  /** Update a rescue request */
  updateRescueRequest: RescueRequest;
  /** Update snake species (admin only) */
  updateSnakeSpecies: SnakeSpecies;
  /** Update a training session */
  updateTraining: Training;
  /** Update volunteer availability status */
  updateVolunteerAvailability: Volunteer;
  /** Update volunteer profile */
  updateVolunteerProfile: Volunteer;
  /** Update volunteer zone assignment */
  updateVolunteerZone: Volunteer;
  /** Upload gallery image */
  uploadGalleryImage: GalleryImage;
  /** Verify donation (admin) */
  verifyDonation: Donation;
  /** Verify completed rescue (admin) */
  verifyRescue: RescueRequest;
  /** Verify snake species (admin only) */
  verifySnakeSpecies: SnakeSpecies;
  /** Verify volunteer (upgrade to verified rescuer) */
  verifyVolunteer: Volunteer;
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

export type MutationCompleteRescueArgs = {
  input: CompleteRescueInput;
};

export type MutationCompleteTrainingArgs = {
  trainingId: Scalars['ID']['input'];
};

export type MutationCreateBlogPostArgs = {
  input: CreateBlogPostInput;
};

export type MutationCreateDonationArgs = {
  input: CreateDonationInput;
};

export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
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

export type MutationDeleteBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteContactMessageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteGalleryImageArgs = {
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

export type MutationDeleteVolunteerArgs = {
  volunteerId: Scalars['ID']['input'];
};

export type MutationEnrollInTrainingArgs = {
  trainingId: Scalars['ID']['input'];
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

export type MutationLikeBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export type MutationLikeGalleryImageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMarkMessageAsReadArgs = {
  messageId: Scalars['ID']['input'];
};

export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
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
  feedback?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
  rescueId: Scalars['ID']['input'];
  volunteerId: Scalars['ID']['input'];
};

export type MutationReactivateVolunteerArgs = {
  volunteerId: Scalars['ID']['input'];
};

export type MutationRefundDonationArgs = {
  input: RefundDonationInput;
};

export type MutationReopenRescueArgs = {
  rescueId: Scalars['ID']['input'];
};

export type MutationReprocessIdentificationArgs = {
  identificationId: Scalars['ID']['input'];
  provider: AiProvider;
};

export type MutationRespondToMessageArgs = {
  input: RespondToMessageInput;
};

export type MutationReviewVolunteerApplicationArgs = {
  input: ReviewVolunteerInput;
};

export type MutationSendBulkNotificationsArgs = {
  input: BulkNotificationInput;
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

export type MutationUpdateAiModelConfigArgs = {
  input: UpdateAiModelConfigInput;
};

export type MutationUpdateBlogPostArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBlogPostInput;
};

export type MutationUpdateGalleryImageArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGalleryImageInput;
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

export type MutationVerifyDonationArgs = {
  donationId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
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
  donationReceipts: Scalars['Boolean']['output'];
  enableApp: Scalars['Boolean']['output'];
  enableEmail: Scalars['Boolean']['output'];
  enableSMS: Scalars['Boolean']['output'];
  enableTelegram: Scalars['Boolean']['output'];
  quietHoursEnd?: Maybe<Scalars['String']['output']>;
  quietHoursStart?: Maybe<Scalars['String']['output']>;
  rescueUpdates: Scalars['Boolean']['output'];
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

/** Input for password reset confirmation */
export type PasswordResetConfirmInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
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

/** Input for processing payment */
export type ProcessPaymentInput = {
  donationId: Scalars['ID']['input'];
  gatewayResponse?: InputMaybe<Scalars['JSON']['input']>;
  transactionId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  /** Get active rescues (in progress) */
  activeRescues: RescueRequestConnection;
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
  /** Get available AI models */
  availableAIModels: Array<AiModelConfig>;
  /** Get available payment gateways */
  availablePaymentGateways: Array<PaymentGatewayConfig>;
  /** Find available volunteers near location */
  availableVolunteers: Array<AvailableVolunteer>;
  /** Get blog post by ID or slug */
  blogPost?: Maybe<BlogPost>;
  /** List blog posts */
  blogPosts: BlogPostConnection;
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
  /** Get donation by ID */
  donation?: Maybe<Donation>;
  /** Get donation statistics */
  donationStats: DonationStats;
  /** List donations */
  donations: DonationConnection;
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
  /** Get assigned rescues (volunteer view) */
  myAssignedRescues: RescueRequestConnection;
  /** Get my donations */
  myDonations: DonationConnection;
  /** Get my identification history */
  myIdentificationHistory: AiIdentificationConnection;
  /** Get notification preferences */
  myNotificationPreferences: NotificationPreferences;
  /** Get my notifications */
  myNotifications: NotificationConnection;
  /** Get my rescue requests (citizen view) */
  myRescueRequests: RescueRequestConnection;
  /** Get my enrolled trainings */
  myTrainings: TrainingConnection;
  /** Get my volunteer profile */
  myVolunteerProfile?: Maybe<Volunteer>;
  /** Find nearby rescue requests (for duplicate detection) */
  nearbyRescues: Array<NearbyRescue>;
  /** Get new contact messages count */
  newContactMessagesCount: Scalars['Int']['output'];
  /** Get notification by ID */
  notification?: Maybe<Notification>;
  /** Get notification statistics */
  notificationStats: NotificationStats;
  /** Get payment gateway configuration */
  paymentGatewayConfig?: Maybe<PaymentGatewayConfig>;
  /** Get pending rescues count */
  pendingRescuesCount: Scalars['Int']['output'];
  /** Get pending volunteer applications */
  pendingVolunteerApplications: VolunteerConnection;
  /** Get published blog posts (public) */
  publishedBlogPosts: BlogPostConnection;
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
  /** Search blog posts */
  searchBlogPosts: BlogPostConnection;
  /** Search rescue requests */
  searchRescues: RescueRequestConnection;
  /** Search snake species */
  searchSnakeSpecies: SnakeSpeciesConnection;
  /** Search volunteers */
  searchVolunteers: VolunteerConnection;
  /** Get snake species by ID */
  snakeSpecies?: Maybe<SnakeSpecies>;
  /** Get snake species by region */
  snakeSpeciesByRegion: SnakeSpeciesConnection;
  /** Get snake species statistics */
  snakeSpeciesStats: SnakeSpeciesStats;
  /** Get snake species by danger level */
  snakesByDangerLevel: SnakeSpeciesConnection;
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

export type QueryMyRescueRequestsArgs = {
  filter?: InputMaybe<RescueRequestFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryMyTrainingsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryNearbyRescuesArgs = {
  input: NearbyRescuesInput;
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

export type QueryPendingVolunteerApplicationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryPublishedBlogPostsArgs = {
  category?: InputMaybe<PostCategory>;
  pagination?: InputMaybe<PaginationInput>;
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

export type QuerySearchBlogPostsArgs = {
  pagination?: InputMaybe<PaginationInput>;
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

export type QuerySearchVolunteersArgs = {
  filter?: InputMaybe<VolunteerFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySnakeSpeciesArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySnakeSpeciesByRegionArgs = {
  pagination?: InputMaybe<PaginationInput>;
  region: Scalars['String']['input'];
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

/** Input for refunding donation */
export type RefundDonationInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  donationId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
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

/** Snake rescue request */
export type RescueRequest = {
  __typename?: 'RescueRequest';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  address: Scalars['String']['output'];
  aiIdentification?: Maybe<AiIdentification>;
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

/** Input for resending verification email */
export type ResendVerificationInput = {
  email: Scalars['Email']['input'];
};

/** Input for responding to a contact message */
export type RespondToMessageInput = {
  messageId: Scalars['ID']['input'];
  response: Scalars['String']['input'];
  sendEmail?: InputMaybe<Scalars['Boolean']['input']>;
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

/** Input for approving/rejecting volunteer */
export type ReviewVolunteerInput = {
  approved: Scalars['Boolean']['input'];
  assignedZone?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  volunteerId: Scalars['ID']['input'];
};

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

/** Species identification count */
export type SpeciesIdentificationCount = {
  __typename?: 'SpeciesIdentificationCount';
  averageConfidence: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  species: SnakeSpecies;
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

export type SubscriptionBlogPostUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionContactMessageUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type SubscriptionDonationStatusChangedArgs = {
  donationId?: InputMaybe<Scalars['ID']['input']>;
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

/** Input for updating message status */
export type UpdateMessageStatusInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  messageId: Scalars['ID']['input'];
  status: MessageStatus;
};

/** Input for updating notification preferences */
export type UpdateNotificationPreferencesInput = {
  donationReceipts?: InputMaybe<Scalars['Boolean']['input']>;
  enableApp?: InputMaybe<Scalars['Boolean']['input']>;
  enableEmail?: InputMaybe<Scalars['Boolean']['input']>;
  enableSMS?: InputMaybe<Scalars['Boolean']['input']>;
  enableTelegram?: InputMaybe<Scalars['Boolean']['input']>;
  quietHoursEnd?: InputMaybe<Scalars['String']['input']>;
  quietHoursStart?: InputMaybe<Scalars['String']['input']>;
  rescueUpdates?: InputMaybe<Scalars['Boolean']['input']>;
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
  hasEquipment?: InputMaybe<Scalars['Boolean']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
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

/** Vehicle availability */
export type VehicleType =
  | 'BIKE'
  | 'BOTH'
  | 'CAR'
  | 'NONE'
  | '%future added value';

/** Venom type */
export type VenomType =
  | 'CYTOTOXIC'
  | 'HEMOTOXIC'
  | 'MIXED'
  | 'NEUROTOXIC'
  | '%future added value';

/** Input for email verification */
export type VerifyEmailInput = {
  token: Scalars['String']['input'];
};

/** Volunteer profile and information */
export type Volunteer = {
  __typename?: 'Volunteer';
  address: Scalars['String']['output'];
  assignedZone?: Maybe<Scalars['String']['output']>;
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

/** Input for assigning a rescue to a volunteer */
export type AssignRescueInput = {
  notes?: string | null | undefined;
  rescueId: string | number;
  volunteerId: string | number;
};

/** Input for completing a rescue */
export type CompleteRescueInput = {
  outcome: RescueOutcome;
  releaseLat?: number | null | undefined;
  releaseLng?: number | null | undefined;
  releaseLocation?: string | null | undefined;
  rescueId: string | number;
  rescueImages?: Array<string> | null | undefined;
  rescueReport: string;
  speciesId?: string | number | null | undefined;
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

/** Input for creating snake species */
export type CreateSnakeSpeciesInput = {
  activeTime?: ActivityPattern | null | undefined;
  aliases?: Array<string> | null | undefined;
  altitudeRange?: string | null | undefined;
  averageLength?: string | null | undefined;
  behavior?: string | null | undefined;
  color?: string | null | undefined;
  conservationStatus?: ConservationStatus | null | undefined;
  dangerLevel?: DangerLevel | null | undefined;
  diet?: string | null | undefined;
  distinctiveFeatures?: Array<string> | null | undefined;
  emergencyAdvice?: string | null | undefined;
  family?: string | null | undefined;
  firstAidSteps?: Array<string> | null | undefined;
  foundInNepal?: boolean | null | undefined;
  genus?: string | null | undefined;
  habitat?: string | null | undefined;
  identificationGuide?: string | null | undefined;
  imageUrl?: string | null | undefined;
  images?: Array<string> | null | undefined;
  localNames?: Array<string> | null | undefined;
  maxLength?: string | null | undefined;
  name: string;
  nepaliName: string;
  pattern?: string | null | undefined;
  protected?: boolean | null | undefined;
  regions?: Array<string> | null | undefined;
  safetyTips?: string | null | undefined;
  scientificName: string;
  species?: string | null | undefined;
  venomType?: VenomType | null | undefined;
  venomous: boolean;
  videoUrl?: string | null | undefined;
};

/** Danger level of snake species */
export type DangerLevel =
  | 'HARMLESS'
  | 'HIGHLY_DANGEROUS'
  | 'MEDICALLY_SIGNIFICANT'
  | 'MILDLY_VENOMOUS'
  | '%future added value';

/** Input for searching nearby rescues */
export type NearbyRescuesInput = {
  lat: number;
  lng: number;
  radiusKm: number;
  status?: RescueStatus | null | undefined;
  withinHours?: number | null | undefined;
};

/** Generic pagination input */
export type PaginationInput = {
  /** Number of items to return (max 100) */
  limit?: number | null | undefined;
  /** Page number (1-indexed) */
  page?: number | null | undefined;
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

/** Input for rescue statistics */
export type RescueStatsInput = {
  endDate?: string | null | undefined;
  municipality?: string | null | undefined;
  speciesId?: string | number | null | undefined;
  startDate?: string | null | undefined;
  volunteerId?: string | number | null | undefined;
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

/** Filter input for snake species queries */
export type SnakeSpeciesFilterInput = {
  dangerLevel?: DangerLevel | null | undefined;
  dangerLevels?: Array<DangerLevel> | null | undefined;
  family?: string | null | undefined;
  foundInNepal?: boolean | null | undefined;
  protected?: boolean | null | undefined;
  region?: string | null | undefined;
  search?: string | null | undefined;
  venomous?: boolean | null | undefined;
  verified?: boolean | null | undefined;
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

/** Sort order */
export type SortOrder = 'ASC' | 'DESC' | '%future added value';

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

/** Input for updating snake species */
export type UpdateSnakeSpeciesInput = {
  activeTime?: ActivityPattern | null | undefined;
  aliases?: Array<string> | null | undefined;
  altitudeRange?: string | null | undefined;
  averageLength?: string | null | undefined;
  behavior?: string | null | undefined;
  color?: string | null | undefined;
  conservationStatus?: ConservationStatus | null | undefined;
  dangerLevel?: DangerLevel | null | undefined;
  diet?: string | null | undefined;
  distinctiveFeatures?: Array<string> | null | undefined;
  emergencyAdvice?: string | null | undefined;
  family?: string | null | undefined;
  firstAidSteps?: Array<string> | null | undefined;
  foundInNepal?: boolean | null | undefined;
  genus?: string | null | undefined;
  habitat?: string | null | undefined;
  identificationGuide?: string | null | undefined;
  imageUrl?: string | null | undefined;
  images?: Array<string> | null | undefined;
  localNames?: Array<string> | null | undefined;
  maxLength?: string | null | undefined;
  name?: string | null | undefined;
  nepaliName?: string | null | undefined;
  pattern?: string | null | undefined;
  protected?: boolean | null | undefined;
  regions?: Array<string> | null | undefined;
  safetyTips?: string | null | undefined;
  scientificName?: string | null | undefined;
  species?: string | null | undefined;
  venomType?: VenomType | null | undefined;
  venomous?: boolean | null | undefined;
  videoUrl?: string | null | undefined;
};

/** Venom type */
export type VenomType =
  | 'CYTOTOXIC'
  | 'HEMOTOXIC'
  | 'MIXED'
  | 'NEUROTOXIC'
  | '%future added value';

export type RescueBasicFieldsFragment = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  municipality: string;
  ward: number | null;
  address: string;
  landmark: string | null;
  lat: number | null;
  lng: number | null;
  locationAccuracy: number | null;
  snakeDescription: string | null;
  snakeSize: string | null;
  snakeColor: string | null;
  snakeImageUrl: string | null;
  snakeImages: Array<string>;
  status: RescueStatus;
  priority: RescuePriority;
  stillPresent: boolean;
  isEmergency: boolean;
  hasBite: boolean;
  notes: string | null;
  referenceNumber: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RescueDetailFieldsFragment = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  municipality: string;
  ward: number | null;
  address: string;
  landmark: string | null;
  lat: number | null;
  lng: number | null;
  locationAccuracy: number | null;
  snakeDescription: string | null;
  snakeSize: string | null;
  snakeColor: string | null;
  snakeImageUrl: string | null;
  snakeImages: Array<string>;
  status: RescueStatus;
  priority: RescuePriority;
  stillPresent: boolean;
  isEmergency: boolean;
  hasBite: boolean;
  notes: string | null;
  referenceNumber: string | null;
  createdAt: string;
  updatedAt: string;
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
  biteDetails: string | null;
  source: RescueSource;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  species: {
    id: string;
    name: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
  } | null;
  aiIdentification: {
    id: string;
    confidence: number;
    provider: AiProvider;
  } | null;
  assignedVolunteer: { id: string; name: string; email: string | null } | null;
  assignedBy: { id: string; name: string } | null;
  verifiedBy: { id: string; name: string } | null;
  timeline: Array<{
    id: string;
    event: string;
    description: string | null;
    createdAt: string;
  }>;
};

export type RescueRequestsQueryVariables = Exact<{
  pagination?: PaginationInput | null | undefined;
  filter?: RescueRequestFilterInput | null | undefined;
  sort?: RescueSortInput | null | undefined;
}>;

export type RescueRequestsQuery = {
  rescueRequests: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        municipality: string;
        ward: number | null;
        address: string;
        landmark: string | null;
        lat: number | null;
        lng: number | null;
        locationAccuracy: number | null;
        snakeDescription: string | null;
        snakeSize: string | null;
        snakeColor: string | null;
        snakeImageUrl: string | null;
        snakeImages: Array<string>;
        status: RescueStatus;
        priority: RescuePriority;
        stillPresent: boolean;
        isEmergency: boolean;
        hasBite: boolean;
        notes: string | null;
        referenceNumber: string | null;
        createdAt: string;
        updatedAt: string;
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

export type RescueRequestQueryVariables = Exact<{
  id: string | number;
}>;

export type RescueRequestQuery = {
  rescueRequest: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
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
        name: string;
        phone: string;
        email: string | null;
        municipality: string;
        ward: number | null;
        address: string;
        landmark: string | null;
        lat: number | null;
        lng: number | null;
        locationAccuracy: number | null;
        snakeDescription: string | null;
        snakeSize: string | null;
        snakeColor: string | null;
        snakeImageUrl: string | null;
        snakeImages: Array<string>;
        status: RescueStatus;
        priority: RescuePriority;
        stillPresent: boolean;
        isEmergency: boolean;
        hasBite: boolean;
        notes: string | null;
        referenceNumber: string | null;
        createdAt: string;
        updatedAt: string;
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
        biteDetails: string | null;
        source: RescueSource;
        user: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
        } | null;
        species: {
          id: string;
          name: string;
          scientificName: string;
          venomous: boolean;
          dangerLevel: DangerLevel | null;
        } | null;
        aiIdentification: {
          id: string;
          confidence: number;
          provider: AiProvider;
        } | null;
        assignedVolunteer: {
          id: string;
          name: string;
          email: string | null;
        } | null;
        assignedBy: { id: string; name: string } | null;
        verifiedBy: { id: string; name: string } | null;
        timeline: Array<{
          id: string;
          event: string;
          description: string | null;
          createdAt: string;
        }>;
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
        name: string;
        phone: string;
        email: string | null;
        municipality: string;
        ward: number | null;
        address: string;
        landmark: string | null;
        lat: number | null;
        lng: number | null;
        locationAccuracy: number | null;
        snakeDescription: string | null;
        snakeSize: string | null;
        snakeColor: string | null;
        snakeImageUrl: string | null;
        snakeImages: Array<string>;
        status: RescueStatus;
        priority: RescuePriority;
        stillPresent: boolean;
        isEmergency: boolean;
        hasBite: boolean;
        notes: string | null;
        referenceNumber: string | null;
        createdAt: string;
        updatedAt: string;
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
        biteDetails: string | null;
        source: RescueSource;
        user: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
        } | null;
        species: {
          id: string;
          name: string;
          scientificName: string;
          venomous: boolean;
          dangerLevel: DangerLevel | null;
        } | null;
        aiIdentification: {
          id: string;
          confidence: number;
          provider: AiProvider;
        } | null;
        assignedVolunteer: {
          id: string;
          name: string;
          email: string | null;
        } | null;
        assignedBy: { id: string; name: string } | null;
        verifiedBy: { id: string; name: string } | null;
        timeline: Array<{
          id: string;
          event: string;
          description: string | null;
          createdAt: string;
        }>;
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

export type NearbyRescuesQueryVariables = Exact<{
  input: NearbyRescuesInput;
}>;

export type NearbyRescuesQuery = {
  nearbyRescues: Array<{
    distance: number;
    rescue: {
      id: string;
      name: string;
      phone: string;
      email: string | null;
      municipality: string;
      ward: number | null;
      address: string;
      landmark: string | null;
      lat: number | null;
      lng: number | null;
      locationAccuracy: number | null;
      snakeDescription: string | null;
      snakeSize: string | null;
      snakeColor: string | null;
      snakeImageUrl: string | null;
      snakeImages: Array<string>;
      status: RescueStatus;
      priority: RescuePriority;
      stillPresent: boolean;
      isEmergency: boolean;
      hasBite: boolean;
      notes: string | null;
      referenceNumber: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }>;
};

export type RescueStatsQueryVariables = Exact<{
  input?: RescueStatsInput | null | undefined;
}>;

export type RescueStatsQuery = {
  rescueStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    averageResponseTime: number | null;
    averageRescueTime: number | null;
    successRate: number | null;
  };
};

export type PendingRescuesCountQueryVariables = Exact<{ [key: string]: never }>;

export type PendingRescuesCountQuery = { pendingRescuesCount: number };

export type CreateRescueRequestMutationVariables = Exact<{
  input: CreateRescueRequestInput;
}>;

export type CreateRescueRequestMutation = {
  createRescueRequest: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type UpdateRescueRequestMutationVariables = Exact<{
  id: string | number;
  input: UpdateRescueRequestInput;
}>;

export type UpdateRescueRequestMutation = {
  updateRescueRequest: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type AssignRescueMutationVariables = Exact<{
  input: AssignRescueInput;
}>;

export type AssignRescueMutation = {
  assignRescue: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type AcceptRescueMutationVariables = Exact<{
  input: AcceptRescueInput;
}>;

export type AcceptRescueMutation = {
  acceptRescue: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type UpdateRescueProgressMutationVariables = Exact<{
  input: UpdateRescueProgressInput;
}>;

export type UpdateRescueProgressMutation = {
  updateRescueProgress: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type CompleteRescueMutationVariables = Exact<{
  input: CompleteRescueInput;
}>;

export type CompleteRescueMutation = {
  completeRescue: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type CancelRescueMutationVariables = Exact<{
  rescueId: string | number;
  reason?: string | null | undefined;
}>;

export type CancelRescueMutation = {
  cancelRescue: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type ReopenRescueMutationVariables = Exact<{
  rescueId: string | number;
}>;

export type ReopenRescueMutation = {
  reopenRescue: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type VerifyRescueMutationVariables = Exact<{
  rescueId: string | number;
  notes?: string | null | undefined;
}>;

export type VerifyRescueMutation = {
  verifyRescue: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type RescueCreatedSubscriptionVariables = Exact<{
  municipality?: string | null | undefined;
}>;

export type RescueCreatedSubscription = {
  rescueCreated: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type RescueUpdatedSubscriptionVariables = Exact<{
  rescueId?: string | number | null | undefined;
}>;

export type RescueUpdatedSubscription = {
  rescueUpdated: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type RescueAssignedSubscriptionVariables = Exact<{
  volunteerId: string | number;
}>;

export type RescueAssignedSubscription = {
  rescueAssigned: {
    assignedAt: string;
    notes: string | null;
    rescue: {
      id: string;
      name: string;
      phone: string;
      email: string | null;
      municipality: string;
      ward: number | null;
      address: string;
      landmark: string | null;
      lat: number | null;
      lng: number | null;
      locationAccuracy: number | null;
      snakeDescription: string | null;
      snakeSize: string | null;
      snakeColor: string | null;
      snakeImageUrl: string | null;
      snakeImages: Array<string>;
      status: RescueStatus;
      priority: RescuePriority;
      stillPresent: boolean;
      isEmergency: boolean;
      hasBite: boolean;
      notes: string | null;
      referenceNumber: string | null;
      createdAt: string;
      updatedAt: string;
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
      biteDetails: string | null;
      source: RescueSource;
      user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
      } | null;
      species: {
        id: string;
        name: string;
        scientificName: string;
        venomous: boolean;
        dangerLevel: DangerLevel | null;
      } | null;
      aiIdentification: {
        id: string;
        confidence: number;
        provider: AiProvider;
      } | null;
      assignedVolunteer: {
        id: string;
        name: string;
        email: string | null;
      } | null;
      assignedBy: { id: string; name: string } | null;
      verifiedBy: { id: string; name: string } | null;
      timeline: Array<{
        id: string;
        event: string;
        description: string | null;
        createdAt: string;
      }>;
    };
    volunteer: { id: string; name: string; email: string | null };
    assignedBy: { id: string; name: string };
  };
};

export type RescueTimelineUpdatedSubscriptionVariables = Exact<{
  rescueId: string | number;
}>;

export type RescueTimelineUpdatedSubscription = {
  rescueTimelineUpdated: {
    id: string;
    event: string;
    description: string | null;
    createdAt: string;
  };
};

export type NearbyRescuesUpdatedSubscriptionVariables = Exact<{
  lat: number;
  lng: number;
  radiusKm: number;
}>;

export type NearbyRescuesUpdatedSubscription = {
  nearbyRescuesUpdated: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type EmergencyRescueCreatedSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type EmergencyRescueCreatedSubscription = {
  emergencyRescueCreated: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    municipality: string;
    ward: number | null;
    address: string;
    landmark: string | null;
    lat: number | null;
    lng: number | null;
    locationAccuracy: number | null;
    snakeDescription: string | null;
    snakeSize: string | null;
    snakeColor: string | null;
    snakeImageUrl: string | null;
    snakeImages: Array<string>;
    status: RescueStatus;
    priority: RescuePriority;
    stillPresent: boolean;
    isEmergency: boolean;
    hasBite: boolean;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: string;
    updatedAt: string;
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
    biteDetails: string | null;
    source: RescueSource;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    } | null;
    species: {
      id: string;
      name: string;
      scientificName: string;
      venomous: boolean;
      dangerLevel: DangerLevel | null;
    } | null;
    aiIdentification: {
      id: string;
      confidence: number;
      provider: AiProvider;
    } | null;
    assignedVolunteer: {
      id: string;
      name: string;
      email: string | null;
    } | null;
    assignedBy: { id: string; name: string } | null;
    verifiedBy: { id: string; name: string } | null;
    timeline: Array<{
      id: string;
      event: string;
      description: string | null;
      createdAt: string;
    }>;
  };
};

export type SnakeBasicFieldsFragment = {
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  localNames: Array<string>;
  family: string | null;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  venomType: VenomType | null;
  conservationStatus: ConservationStatus | null;
  behavior: string | null;
  habitat: string | null;
  foundInNepal: boolean;
  regions: Array<string>;
  imageUrl: string | null;
  rescueCount: number;
  identificationCount: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SnakeDetailFieldsFragment = {
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  localNames: Array<string>;
  family: string | null;
  venomous: boolean;
  dangerLevel: DangerLevel | null;
  venomType: VenomType | null;
  conservationStatus: ConservationStatus | null;
  behavior: string | null;
  habitat: string | null;
  foundInNepal: boolean;
  regions: Array<string>;
  imageUrl: string | null;
  rescueCount: number;
  identificationCount: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  aliases: Array<string>;
  genus: string | null;
  species: string | null;
  averageLength: string | null;
  maxLength: string | null;
  color: string | null;
  pattern: string | null;
  identificationGuide: string | null;
  distinctiveFeatures: Array<string>;
  activeTime: ActivityPattern | null;
  diet: string | null;
  safetyTips: string | null;
  emergencyAdvice: string | null;
  firstAidSteps: Array<string>;
  altitudeRange: string | null;
  protected: boolean;
  images: Array<string>;
  videoUrl: string | null;
  verifiedBy: { id: string; name: string; email: string } | null;
};

export type AllSnakeSpeciesQueryVariables = Exact<{
  pagination?: PaginationInput | null | undefined;
  filter?: SnakeSpeciesFilterInput | null | undefined;
  sort?: SnakeSpeciesSortInput | null | undefined;
}>;

export type AllSnakeSpeciesQuery = {
  allSnakeSpecies: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        name: string;
        scientificName: string;
        nepaliName: string;
        localNames: Array<string>;
        family: string | null;
        venomous: boolean;
        dangerLevel: DangerLevel | null;
        venomType: VenomType | null;
        conservationStatus: ConservationStatus | null;
        behavior: string | null;
        habitat: string | null;
        foundInNepal: boolean;
        regions: Array<string>;
        imageUrl: string | null;
        rescueCount: number;
        identificationCount: number;
        verified: boolean;
        createdAt: string;
        updatedAt: string;
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

export type SnakeSpeciesQueryVariables = Exact<{
  id: string | number;
}>;

export type SnakeSpeciesQuery = {
  snakeSpecies: {
    id: string;
    name: string;
    scientificName: string;
    nepaliName: string;
    localNames: Array<string>;
    family: string | null;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    venomType: VenomType | null;
    conservationStatus: ConservationStatus | null;
    behavior: string | null;
    habitat: string | null;
    foundInNepal: boolean;
    regions: Array<string>;
    imageUrl: string | null;
    rescueCount: number;
    identificationCount: number;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    aliases: Array<string>;
    genus: string | null;
    species: string | null;
    averageLength: string | null;
    maxLength: string | null;
    color: string | null;
    pattern: string | null;
    identificationGuide: string | null;
    distinctiveFeatures: Array<string>;
    activeTime: ActivityPattern | null;
    diet: string | null;
    safetyTips: string | null;
    emergencyAdvice: string | null;
    firstAidSteps: Array<string>;
    altitudeRange: string | null;
    protected: boolean;
    images: Array<string>;
    videoUrl: string | null;
    verifiedBy: { id: string; name: string; email: string } | null;
  } | null;
};

export type SearchSnakeSpeciesQueryVariables = Exact<{
  query: string;
  pagination?: PaginationInput | null | undefined;
  filter?: SnakeSpeciesFilterInput | null | undefined;
}>;

export type SearchSnakeSpeciesQuery = {
  searchSnakeSpecies: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        name: string;
        scientificName: string;
        nepaliName: string;
        localNames: Array<string>;
        family: string | null;
        venomous: boolean;
        dangerLevel: DangerLevel | null;
        venomType: VenomType | null;
        conservationStatus: ConservationStatus | null;
        behavior: string | null;
        habitat: string | null;
        foundInNepal: boolean;
        regions: Array<string>;
        imageUrl: string | null;
        rescueCount: number;
        identificationCount: number;
        verified: boolean;
        createdAt: string;
        updatedAt: string;
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

export type VenomousSnakesQueryVariables = Exact<{
  pagination?: PaginationInput | null | undefined;
}>;

export type VenomousSnakesQuery = {
  venomousSnakes: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        name: string;
        scientificName: string;
        nepaliName: string;
        localNames: Array<string>;
        family: string | null;
        venomous: boolean;
        dangerLevel: DangerLevel | null;
        venomType: VenomType | null;
        conservationStatus: ConservationStatus | null;
        behavior: string | null;
        habitat: string | null;
        foundInNepal: boolean;
        regions: Array<string>;
        imageUrl: string | null;
        rescueCount: number;
        identificationCount: number;
        verified: boolean;
        createdAt: string;
        updatedAt: string;
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

export type SnakeSpeciesByRegionQueryVariables = Exact<{
  region: string;
  pagination?: PaginationInput | null | undefined;
}>;

export type SnakeSpeciesByRegionQuery = {
  snakeSpeciesByRegion: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        name: string;
        scientificName: string;
        nepaliName: string;
        localNames: Array<string>;
        family: string | null;
        venomous: boolean;
        dangerLevel: DangerLevel | null;
        venomType: VenomType | null;
        conservationStatus: ConservationStatus | null;
        behavior: string | null;
        habitat: string | null;
        foundInNepal: boolean;
        regions: Array<string>;
        imageUrl: string | null;
        rescueCount: number;
        identificationCount: number;
        verified: boolean;
        createdAt: string;
        updatedAt: string;
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

export type SnakeSpeciesStatsQueryVariables = Exact<{ [key: string]: never }>;

export type SnakeSpeciesStatsQuery = {
  snakeSpeciesStats: {
    totalSpecies: number;
    venomousCount: number;
    harmlessCount: number;
  };
};

export type CreateSnakeSpeciesMutationVariables = Exact<{
  input: CreateSnakeSpeciesInput;
}>;

export type CreateSnakeSpeciesMutation = {
  createSnakeSpecies: {
    id: string;
    name: string;
    scientificName: string;
    nepaliName: string;
    localNames: Array<string>;
    family: string | null;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    venomType: VenomType | null;
    conservationStatus: ConservationStatus | null;
    behavior: string | null;
    habitat: string | null;
    foundInNepal: boolean;
    regions: Array<string>;
    imageUrl: string | null;
    rescueCount: number;
    identificationCount: number;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    aliases: Array<string>;
    genus: string | null;
    species: string | null;
    averageLength: string | null;
    maxLength: string | null;
    color: string | null;
    pattern: string | null;
    identificationGuide: string | null;
    distinctiveFeatures: Array<string>;
    activeTime: ActivityPattern | null;
    diet: string | null;
    safetyTips: string | null;
    emergencyAdvice: string | null;
    firstAidSteps: Array<string>;
    altitudeRange: string | null;
    protected: boolean;
    images: Array<string>;
    videoUrl: string | null;
    verifiedBy: { id: string; name: string; email: string } | null;
  };
};

export type UpdateSnakeSpeciesMutationVariables = Exact<{
  id: string | number;
  input: UpdateSnakeSpeciesInput;
}>;

export type UpdateSnakeSpeciesMutation = {
  updateSnakeSpecies: {
    id: string;
    name: string;
    scientificName: string;
    nepaliName: string;
    localNames: Array<string>;
    family: string | null;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    venomType: VenomType | null;
    conservationStatus: ConservationStatus | null;
    behavior: string | null;
    habitat: string | null;
    foundInNepal: boolean;
    regions: Array<string>;
    imageUrl: string | null;
    rescueCount: number;
    identificationCount: number;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    aliases: Array<string>;
    genus: string | null;
    species: string | null;
    averageLength: string | null;
    maxLength: string | null;
    color: string | null;
    pattern: string | null;
    identificationGuide: string | null;
    distinctiveFeatures: Array<string>;
    activeTime: ActivityPattern | null;
    diet: string | null;
    safetyTips: string | null;
    emergencyAdvice: string | null;
    firstAidSteps: Array<string>;
    altitudeRange: string | null;
    protected: boolean;
    images: Array<string>;
    videoUrl: string | null;
    verifiedBy: { id: string; name: string; email: string } | null;
  };
};

export type VerifySnakeSpeciesMutationVariables = Exact<{
  id: string | number;
}>;

export type VerifySnakeSpeciesMutation = {
  verifySnakeSpecies: {
    id: string;
    name: string;
    scientificName: string;
    nepaliName: string;
    localNames: Array<string>;
    family: string | null;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    venomType: VenomType | null;
    conservationStatus: ConservationStatus | null;
    behavior: string | null;
    habitat: string | null;
    foundInNepal: boolean;
    regions: Array<string>;
    imageUrl: string | null;
    rescueCount: number;
    identificationCount: number;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    aliases: Array<string>;
    genus: string | null;
    species: string | null;
    averageLength: string | null;
    maxLength: string | null;
    color: string | null;
    pattern: string | null;
    identificationGuide: string | null;
    distinctiveFeatures: Array<string>;
    activeTime: ActivityPattern | null;
    diet: string | null;
    safetyTips: string | null;
    emergencyAdvice: string | null;
    firstAidSteps: Array<string>;
    altitudeRange: string | null;
    protected: boolean;
    images: Array<string>;
    videoUrl: string | null;
    verifiedBy: { id: string; name: string; email: string } | null;
  };
};

export type DeleteSnakeSpeciesMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteSnakeSpeciesMutation = {
  deleteSnakeSpecies: { success: boolean; message: string | null };
};

export type SnakeSpeciesAddedSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type SnakeSpeciesAddedSubscription = {
  snakeSpeciesAdded: {
    id: string;
    name: string;
    scientificName: string;
    nepaliName: string;
    localNames: Array<string>;
    family: string | null;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    venomType: VenomType | null;
    conservationStatus: ConservationStatus | null;
    behavior: string | null;
    habitat: string | null;
    foundInNepal: boolean;
    regions: Array<string>;
    imageUrl: string | null;
    rescueCount: number;
    identificationCount: number;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    aliases: Array<string>;
    genus: string | null;
    species: string | null;
    averageLength: string | null;
    maxLength: string | null;
    color: string | null;
    pattern: string | null;
    identificationGuide: string | null;
    distinctiveFeatures: Array<string>;
    activeTime: ActivityPattern | null;
    diet: string | null;
    safetyTips: string | null;
    emergencyAdvice: string | null;
    firstAidSteps: Array<string>;
    altitudeRange: string | null;
    protected: boolean;
    images: Array<string>;
    videoUrl: string | null;
    verifiedBy: { id: string; name: string; email: string } | null;
  };
};

export type SnakeSpeciesUpdatedSubscriptionVariables = Exact<{
  id?: string | number | null | undefined;
}>;

export type SnakeSpeciesUpdatedSubscription = {
  snakeSpeciesUpdated: {
    id: string;
    name: string;
    scientificName: string;
    nepaliName: string;
    localNames: Array<string>;
    family: string | null;
    venomous: boolean;
    dangerLevel: DangerLevel | null;
    venomType: VenomType | null;
    conservationStatus: ConservationStatus | null;
    behavior: string | null;
    habitat: string | null;
    foundInNepal: boolean;
    regions: Array<string>;
    imageUrl: string | null;
    rescueCount: number;
    identificationCount: number;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    aliases: Array<string>;
    genus: string | null;
    species: string | null;
    averageLength: string | null;
    maxLength: string | null;
    color: string | null;
    pattern: string | null;
    identificationGuide: string | null;
    distinctiveFeatures: Array<string>;
    activeTime: ActivityPattern | null;
    diet: string | null;
    safetyTips: string | null;
    emergencyAdvice: string | null;
    firstAidSteps: Array<string>;
    altitudeRange: string | null;
    protected: boolean;
    images: Array<string>;
    videoUrl: string | null;
    verifiedBy: { id: string; name: string; email: string } | null;
  };
};
