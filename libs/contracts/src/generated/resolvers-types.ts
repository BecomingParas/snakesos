import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import {
  User as UserModel,
  RescueRequest as RescueRequestModel,
  RescueTimeline as RescueTimelineModel,
  Volunteer as VolunteerModel,
  SnakeSpecies as SnakeSpeciesModel,
  AIIdentification as AIIdentificationModel,
  BlogPost as BlogPostModel,
  GalleryImage as GalleryImageModel,
  Donation as DonationModel,
  Notification as NotificationModel,
  ContactMessage as ContactMessageModel,
  ActivityLog as ActivityLogModel,
  Training as TrainingModel,
} from '@snake-rescue/database';
import { GraphQLContext } from '../context/index.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** ISO 8601 datetime string (e.g., "2024-08-05T12:30:00Z") */
  DateTime: { input: Date; output: Date };
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
  /** Change password (requires current password) */
  changePassword: Scalars['Boolean']['output'];
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
  /** Delete user account (soft delete) */
  deleteAccount: Scalars['Boolean']['output'];
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
  /** Register a new user account */
  register: AuthPayload;
  /** Reopen cancelled/closed rescue */
  reopenRescue: RescueRequest;
  /** Reprocess identification with different model */
  reprocessIdentification: AiIdentification;
  /** Resend email verification */
  resendVerification: Scalars['Boolean']['output'];
  /** Reset password with token */
  resetPassword: Scalars['Boolean']['output'];
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
  /** Verify email address with token */
  verifyEmail: EmailVerificationPayload;
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

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
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

export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationReopenRescueArgs = {
  rescueId: Scalars['ID']['input'];
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

export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
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
  /** Get current authenticated user */
  me?: Maybe<User>;
  /** Get activity logs for current user */
  myActivityLogs: ActivityLogConnection;
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
  /** Search users by name or email */
  searchUsers: UserConnection;
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

export type QuerySearchUsersArgs = {
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

/** Input for password reset */
export type ResetPasswordInput = {
  code: Scalars['String']['input'];
  email: Scalars['Email']['input'];
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
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

/** Input for email verification using OTP code only */
export type VerifyEmailInput = {
  code: Scalars['String']['input'];
  email: Scalars['Email']['input'];
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> =
  ResolversObject<{
    MutationResponse: never;
  }>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AIIdentification: ResolverTypeWrapper<AIIdentificationModel>;
  AIIdentificationConnection: ResolverTypeWrapper<
    Omit<AiIdentificationConnection, 'edges'> & {
      edges: Array<ResolversTypes['AIIdentificationEdge']>;
    }
  >;
  AIIdentificationEdge: ResolverTypeWrapper<
    Omit<AiIdentificationEdge, 'node'> & {
      node: ResolversTypes['AIIdentification'];
    }
  >;
  AIIdentificationFilterInput: AiIdentificationFilterInput;
  AIIdentificationSortField: AiIdentificationSortField;
  AIIdentificationSortInput: AiIdentificationSortInput;
  AIIdentificationStats: ResolverTypeWrapper<
    Omit<AiIdentificationStats, 'topIdentifiedSpecies'> & {
      topIdentifiedSpecies: Array<ResolversTypes['SpeciesIdentificationCount']>;
    }
  >;
  AIModelConfig: ResolverTypeWrapper<AiModelConfig>;
  AIProvider: AiProvider;
  AcceptRescueInput: AcceptRescueInput;
  ActivityLog: ResolverTypeWrapper<ActivityLogModel>;
  ActivityLogConnection: ResolverTypeWrapper<
    Omit<ActivityLogConnection, 'edges'> & {
      edges: Array<ResolversTypes['ActivityLog']>;
    }
  >;
  ActivityPattern: ActivityPattern;
  AddTimelineEventInput: AddTimelineEventInput;
  AlternativeMatch: ResolverTypeWrapper<
    Omit<AlternativeMatch, 'species'> & {
      species: ResolversTypes['SnakeSpecies'];
    }
  >;
  AnalyticsDateRangeInput: AnalyticsDateRangeInput;
  AnalyticsTimePeriod: AnalyticsTimePeriod;
  ApplyVolunteerInput: ApplyVolunteerInput;
  AssignRescueInput: AssignRescueInput;
  AuthPayload: ResolverTypeWrapper<
    Omit<AuthPayload, 'user'> & { user: ResolversTypes['User'] }
  >;
  AvailabilityTime: AvailabilityTime;
  AvailableVolunteer: ResolverTypeWrapper<
    Omit<AvailableVolunteer, 'volunteer'> & {
      volunteer: ResolversTypes['Volunteer'];
    }
  >;
  BlogPost: ResolverTypeWrapper<BlogPostModel>;
  BlogPostConnection: ResolverTypeWrapper<
    Omit<BlogPostConnection, 'edges'> & {
      edges: Array<ResolversTypes['BlogPostEdge']>;
    }
  >;
  BlogPostEdge: ResolverTypeWrapper<
    Omit<BlogPostEdge, 'node'> & { node: ResolversTypes['BlogPost'] }
  >;
  BlogPostFilterInput: BlogPostFilterInput;
  BlogPostSortField: BlogPostSortField;
  BlogPostSortInput: BlogPostSortInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BulkNotificationInput: BulkNotificationInput;
  BulkOperationResult: ResolverTypeWrapper<BulkOperationResult>;
  CMSStats: ResolverTypeWrapper<
    Omit<CmsStats, 'featuredImages' | 'popularPosts' | 'recentPosts'> & {
      featuredImages: Array<ResolversTypes['GalleryImage']>;
      popularPosts: Array<ResolversTypes['BlogPost']>;
      recentPosts: Array<ResolversTypes['BlogPost']>;
    }
  >;
  ChangePasswordInput: ChangePasswordInput;
  CompleteRescueInput: CompleteRescueInput;
  ConservationStatus: ConservationStatus;
  ContactMessage: ResolverTypeWrapper<ContactMessageModel>;
  ContactMessageConnection: ResolverTypeWrapper<
    Omit<ContactMessageConnection, 'edges'> & {
      edges: Array<ResolversTypes['ContactMessageEdge']>;
    }
  >;
  ContactMessageEdge: ResolverTypeWrapper<
    Omit<ContactMessageEdge, 'node'> & {
      node: ResolversTypes['ContactMessage'];
    }
  >;
  ContactMessageFilterInput: ContactMessageFilterInput;
  ContactMessageSortField: ContactMessageSortField;
  ContactMessageSortInput: ContactMessageSortInput;
  ContactMessageStats: ResolverTypeWrapper<
    Omit<ContactMessageStats, 'recentMessages'> & {
      recentMessages: Array<ResolversTypes['ContactMessage']>;
    }
  >;
  CreateBlogPostInput: CreateBlogPostInput;
  CreateDonationInput: CreateDonationInput;
  CreateNotificationInput: CreateNotificationInput;
  CreateRescueRequestInput: CreateRescueRequestInput;
  CreateSnakeSpeciesInput: CreateSnakeSpeciesInput;
  CreateTrainingInput: CreateTrainingInput;
  CursorPaginationInput: CursorPaginationInput;
  DangerLevel: DangerLevel;
  DashboardStats: ResolverTypeWrapper<
    Omit<DashboardStats, 'recentDonations' | 'recentRescues'> & {
      recentDonations: Array<ResolversTypes['Donation']>;
      recentRescues: Array<ResolversTypes['RescueRequest']>;
    }
  >;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Donation: ResolverTypeWrapper<DonationModel>;
  DonationByMethod: ResolverTypeWrapper<DonationByMethod>;
  DonationByPurpose: ResolverTypeWrapper<DonationByPurpose>;
  DonationConnection: ResolverTypeWrapper<
    Omit<DonationConnection, 'edges'> & {
      edges: Array<ResolversTypes['DonationEdge']>;
    }
  >;
  DonationEdge: ResolverTypeWrapper<
    Omit<DonationEdge, 'node'> & { node: ResolversTypes['Donation'] }
  >;
  DonationFilterInput: DonationFilterInput;
  DonationPurpose: DonationPurpose;
  DonationSortField: DonationSortField;
  DonationSortInput: DonationSortInput;
  DonationStats: ResolverTypeWrapper<
    Omit<DonationStats, 'recentDonations' | 'topDonors'> & {
      recentDonations: Array<ResolversTypes['Donation']>;
      topDonors: Array<ResolversTypes['TopDonor']>;
    }
  >;
  DonationStatsInput: DonationStatsInput;
  DonationStatusChangeEvent: ResolverTypeWrapper<
    Omit<DonationStatusChangeEvent, 'donation'> & {
      donation: ResolversTypes['Donation'];
    }
  >;
  Email: ResolverTypeWrapper<Scalars['Email']['output']>;
  EmailVerificationPayload: ResolverTypeWrapper<
    Omit<EmailVerificationPayload, 'user'> & {
      user?: Maybe<ResolversTypes['User']>;
    }
  >;
  EngagementMetrics: ResolverTypeWrapper<EngagementMetrics>;
  Error: ResolverTypeWrapper<Error>;
  ErrorCode: ErrorCode;
  ErrorSeverity: ErrorSeverity;
  ExperienceLevel: ExperienceLevel;
  FindAvailableVolunteersInput: FindAvailableVolunteersInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GalleryCategory: GalleryCategory;
  GalleryImage: ResolverTypeWrapper<GalleryImageModel>;
  GalleryImageConnection: ResolverTypeWrapper<
    Omit<GalleryImageConnection, 'edges'> & {
      edges: Array<ResolversTypes['GalleryImageEdge']>;
    }
  >;
  GalleryImageEdge: ResolverTypeWrapper<
    Omit<GalleryImageEdge, 'node'> & { node: ResolversTypes['GalleryImage'] }
  >;
  GalleryImageFilterInput: GalleryImageFilterInput;
  GalleryImageSortField: GalleryImageSortField;
  GalleryImageSortInput: GalleryImageSortInput;
  GeographicHeatmap: ResolverTypeWrapper<GeographicHeatmap>;
  GeographicHeatmapInput: GeographicHeatmapInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IdentificationByProvider: ResolverTypeWrapper<IdentificationByProvider>;
  IdentificationFeedback: IdentificationFeedback;
  IdentificationFeedbackEvent: ResolverTypeWrapper<
    Omit<
      IdentificationFeedbackEvent,
      'correctSpecies' | 'identification' | 'user'
    > & {
      correctSpecies?: Maybe<ResolversTypes['SnakeSpecies']>;
      identification: ResolversTypes['AIIdentification'];
      user: ResolversTypes['User'];
    }
  >;
  IdentificationFeedbackInput: IdentificationFeedbackInput;
  IdentifySnakeInput: IdentifySnakeInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Latitude: ResolverTypeWrapper<Scalars['Latitude']['output']>;
  LoginInput: LoginInput;
  Longitude: ResolverTypeWrapper<Scalars['Longitude']['output']>;
  MessageByCategory: ResolverTypeWrapper<MessageByCategory>;
  MessageByPriority: ResolverTypeWrapper<MessageByPriority>;
  MessageCategory: MessageCategory;
  MessagePriority: MessagePriority;
  MessageStatus: MessageStatus;
  MonthlyDonationData: ResolverTypeWrapper<MonthlyDonationData>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  MutationResponse: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>['MutationResponse']
  >;
  NearbyRescue: ResolverTypeWrapper<
    Omit<NearbyRescue, 'rescue'> & { rescue: ResolversTypes['RescueRequest'] }
  >;
  NearbyRescuesInput: NearbyRescuesInput;
  Notification: ResolverTypeWrapper<NotificationModel>;
  NotificationByPriority: ResolverTypeWrapper<NotificationByPriority>;
  NotificationByType: ResolverTypeWrapper<NotificationByType>;
  NotificationChannel: NotificationChannel;
  NotificationConnection: ResolverTypeWrapper<
    Omit<NotificationConnection, 'edges'> & {
      edges: Array<ResolversTypes['NotificationEdge']>;
    }
  >;
  NotificationDeliveryStats: ResolverTypeWrapper<NotificationDeliveryStats>;
  NotificationEdge: ResolverTypeWrapper<
    Omit<NotificationEdge, 'node'> & { node: ResolversTypes['Notification'] }
  >;
  NotificationFilterInput: NotificationFilterInput;
  NotificationPreferences: ResolverTypeWrapper<NotificationPreferences>;
  NotificationPreferencesInput: NotificationPreferencesInput;
  NotificationPriority: NotificationPriority;
  NotificationReadEvent: ResolverTypeWrapper<
    Omit<NotificationReadEvent, 'notification'> & {
      notification: ResolversTypes['Notification'];
    }
  >;
  NotificationSortField: NotificationSortField;
  NotificationSortInput: NotificationSortInput;
  NotificationStats: ResolverTypeWrapper<NotificationStats>;
  NotificationType: NotificationType;
  OAuthLoginInput: OAuthLoginInput;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PageView: ResolverTypeWrapper<PageView>;
  PaginationInput: PaginationInput;
  PasswordResetRequestInput: PasswordResetRequestInput;
  PasswordResetTokenPayload: ResolverTypeWrapper<PasswordResetTokenPayload>;
  PaymentGatewayConfig: ResolverTypeWrapper<PaymentGatewayConfig>;
  PaymentMethod: PaymentMethod;
  PaymentStatus: PaymentStatus;
  Phone: ResolverTypeWrapper<Scalars['Phone']['output']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']['output']>;
  PostCategory: PostCategory;
  PostStatus: PostStatus;
  ProcessPaymentInput: ProcessPaymentInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RefundDonationInput: RefundDonationInput;
  RegisterInput: RegisterInput;
  RescueActivityPoint: ResolverTypeWrapper<RescueActivityPoint>;
  RescueAnalytics: ResolverTypeWrapper<
    Omit<RescueAnalytics, 'bySpecies'> & {
      bySpecies: Array<ResolversTypes['RescueBySpecies']>;
    }
  >;
  RescueAnalyticsInput: RescueAnalyticsInput;
  RescueAssignmentEvent: ResolverTypeWrapper<
    Omit<RescueAssignmentEvent, 'assignedBy' | 'rescue' | 'volunteer'> & {
      assignedBy: ResolversTypes['User'];
      rescue: ResolversTypes['RescueRequest'];
      volunteer: ResolversTypes['Volunteer'];
    }
  >;
  RescueByMunicipality: ResolverTypeWrapper<RescueByMunicipality>;
  RescueByPriority: ResolverTypeWrapper<RescueByPriority>;
  RescueBySpecies: ResolverTypeWrapper<
    Omit<RescueBySpecies, 'species'> & {
      species: ResolversTypes['SnakeSpecies'];
    }
  >;
  RescueByStatus: ResolverTypeWrapper<RescueByStatus>;
  RescueByTimeOfDay: ResolverTypeWrapper<RescueByTimeOfDay>;
  RescueMunicipalityStats: ResolverTypeWrapper<RescueMunicipalityStats>;
  RescueOutcome: RescueOutcome;
  RescuePriority: RescuePriority;
  RescuePriorityStats: ResolverTypeWrapper<RescuePriorityStats>;
  RescueRequest: ResolverTypeWrapper<RescueRequestModel>;
  RescueRequestConnection: ResolverTypeWrapper<
    Omit<RescueRequestConnection, 'edges'> & {
      edges: Array<ResolversTypes['RescueRequestEdge']>;
    }
  >;
  RescueRequestEdge: ResolverTypeWrapper<
    Omit<RescueRequestEdge, 'node'> & { node: ResolversTypes['RescueRequest'] }
  >;
  RescueRequestFilterInput: RescueRequestFilterInput;
  RescueSortField: RescueSortField;
  RescueSortInput: RescueSortInput;
  RescueSource: RescueSource;
  RescueSpeciesStats: ResolverTypeWrapper<
    Omit<RescueSpeciesStats, 'species'> & {
      species: ResolversTypes['SnakeSpecies'];
    }
  >;
  RescueStats: ResolverTypeWrapper<
    Omit<RescueStats, 'bySpecies'> & {
      bySpecies: Array<ResolversTypes['RescueSpeciesStats']>;
    }
  >;
  RescueStatsInput: RescueStatsInput;
  RescueStatus: RescueStatus;
  RescueTimeline: ResolverTypeWrapper<RescueTimelineModel>;
  ResendVerificationInput: ResendVerificationInput;
  ResetPasswordInput: ResetPasswordInput;
  RespondToMessageInput: RespondToMessageInput;
  ResponseTimeAnalysis: ResolverTypeWrapper<ResponseTimeAnalysis>;
  ResponseTimeByPriority: ResolverTypeWrapper<ResponseTimeByPriority>;
  ReviewVolunteerInput: ReviewVolunteerInput;
  SnakeSize: SnakeSize;
  SnakeSpecies: ResolverTypeWrapper<SnakeSpeciesModel>;
  SnakeSpeciesConnection: ResolverTypeWrapper<
    Omit<SnakeSpeciesConnection, 'edges'> & {
      edges: Array<ResolversTypes['SnakeSpeciesEdge']>;
    }
  >;
  SnakeSpeciesEdge: ResolverTypeWrapper<
    Omit<SnakeSpeciesEdge, 'node'> & { node: ResolversTypes['SnakeSpecies'] }
  >;
  SnakeSpeciesFilterInput: SnakeSpeciesFilterInput;
  SnakeSpeciesSortField: SnakeSpeciesSortField;
  SnakeSpeciesSortInput: SnakeSpeciesSortInput;
  SnakeSpeciesStats: ResolverTypeWrapper<
    Omit<SnakeSpeciesStats, 'mostEncountered'> & {
      mostEncountered: Array<ResolversTypes['SnakeSpecies']>;
    }
  >;
  SortOrder: SortOrder;
  SpeciesByDangerLevel: ResolverTypeWrapper<SpeciesByDangerLevel>;
  SpeciesByFamily: ResolverTypeWrapper<SpeciesByFamily>;
  SpeciesIdentificationCount: ResolverTypeWrapper<
    Omit<SpeciesIdentificationCount, 'species'> & {
      species: ResolversTypes['SnakeSpecies'];
    }
  >;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StripeConnectionStatus: ResolverTypeWrapper<StripeConnectionStatus>;
  SubmitContactMessageInput: SubmitContactMessageInput;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SuccessResponse: ResolverTypeWrapper<SuccessResponse>;
  TimeSeriesPoint: ResolverTypeWrapper<TimeSeriesPoint>;
  TopDonor: ResolverTypeWrapper<
    Omit<TopDonor, 'donor'> & { donor?: Maybe<ResolversTypes['User']> }
  >;
  Training: ResolverTypeWrapper<TrainingModel>;
  TrainingByType: ResolverTypeWrapper<TrainingByType>;
  TrainingConnection: ResolverTypeWrapper<
    Omit<TrainingConnection, 'edges'> & {
      edges: Array<ResolversTypes['TrainingEdge']>;
    }
  >;
  TrainingEdge: ResolverTypeWrapper<
    Omit<TrainingEdge, 'node'> & { node: ResolversTypes['Training'] }
  >;
  TrainingEnrollmentEvent: ResolverTypeWrapper<
    Omit<TrainingEnrollmentEvent, 'training' | 'user'> & {
      training: ResolversTypes['Training'];
      user: ResolversTypes['User'];
    }
  >;
  TrainingFilterInput: TrainingFilterInput;
  TrainingSortField: TrainingSortField;
  TrainingSortInput: TrainingSortInput;
  TrainingStats: ResolverTypeWrapper<
    Omit<TrainingStats, 'recentSessions'> & {
      recentSessions: Array<ResolversTypes['Training']>;
    }
  >;
  TrainingStatus: TrainingStatus;
  TrainingType: TrainingType;
  TrendData: ResolverTypeWrapper<TrendData>;
  TrendDirection: TrendDirection;
  UnreadCountEvent: ResolverTypeWrapper<UnreadCountEvent>;
  UpdateAIModelConfigInput: UpdateAiModelConfigInput;
  UpdateBlogPostInput: UpdateBlogPostInput;
  UpdateGalleryImageInput: UpdateGalleryImageInput;
  UpdateMessageStatusInput: UpdateMessageStatusInput;
  UpdateNotificationPreferencesInput: UpdateNotificationPreferencesInput;
  UpdatePaymentGatewayInput: UpdatePaymentGatewayInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateRescueProgressInput: UpdateRescueProgressInput;
  UpdateRescueRequestInput: UpdateRescueRequestInput;
  UpdateSnakeSpeciesInput: UpdateSnakeSpeciesInput;
  UpdateTrainingInput: UpdateTrainingInput;
  UpdateUserProfileInput: UpdateUserProfileInput;
  UpdateVolunteerAvailabilityInput: UpdateVolunteerAvailabilityInput;
  UpdateVolunteerInput: UpdateVolunteerInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UploadGalleryImageInput: UploadGalleryImageInput;
  UploadSource: UploadSource;
  User: ResolverTypeWrapper<UserModel>;
  UserConnection: ResolverTypeWrapper<
    Omit<UserConnection, 'edges'> & { edges: Array<ResolversTypes['User']> }
  >;
  UserFilterInput: UserFilterInput;
  UserProfile: ResolverTypeWrapper<
    Omit<UserProfile, 'volunteerProfile'> & {
      volunteerProfile?: Maybe<ResolversTypes['Volunteer']>;
    }
  >;
  UserRole: UserRole;
  UserSortField: UserSortField;
  UserSortInput: UserSortInput;
  UserStatus: UserStatus;
  UserStatusChangeEvent: ResolverTypeWrapper<
    Omit<UserStatusChangeEvent, 'changedBy' | 'user'> & {
      changedBy?: Maybe<ResolversTypes['User']>;
      user: ResolversTypes['User'];
    }
  >;
  ValidationError: ResolverTypeWrapper<ValidationError>;
  VehicleType: VehicleType;
  VenomType: VenomType;
  VerifyEmailInput: VerifyEmailInput;
  Volunteer: ResolverTypeWrapper<VolunteerModel>;
  VolunteerAnalytics: ResolverTypeWrapper<
    Omit<VolunteerAnalytics, 'topPerformers'> & {
      topPerformers: Array<ResolversTypes['VolunteerPerformance']>;
    }
  >;
  VolunteerAnalyticsInput: VolunteerAnalyticsInput;
  VolunteerAvailabilityEvent: ResolverTypeWrapper<
    Omit<VolunteerAvailabilityEvent, 'volunteer'> & {
      volunteer: ResolversTypes['Volunteer'];
    }
  >;
  VolunteerByExperience: ResolverTypeWrapper<VolunteerByExperience>;
  VolunteerByMunicipality: ResolverTypeWrapper<VolunteerByMunicipality>;
  VolunteerByStatus: ResolverTypeWrapper<VolunteerByStatus>;
  VolunteerConnection: ResolverTypeWrapper<
    Omit<VolunteerConnection, 'edges'> & {
      edges: Array<ResolversTypes['VolunteerEdge']>;
    }
  >;
  VolunteerEdge: ResolverTypeWrapper<
    Omit<VolunteerEdge, 'node'> & { node: ResolversTypes['Volunteer'] }
  >;
  VolunteerExperienceStats: ResolverTypeWrapper<VolunteerExperienceStats>;
  VolunteerFilterInput: VolunteerFilterInput;
  VolunteerMunicipalityStats: ResolverTypeWrapper<VolunteerMunicipalityStats>;
  VolunteerPerformance: ResolverTypeWrapper<
    Omit<VolunteerPerformance, 'volunteer'> & {
      volunteer: ResolversTypes['Volunteer'];
    }
  >;
  VolunteerSortField: VolunteerSortField;
  VolunteerSortInput: VolunteerSortInput;
  VolunteerStats: ResolverTypeWrapper<
    Omit<VolunteerStats, 'topPerformers'> & {
      topPerformers: Array<ResolversTypes['VolunteerPerformance']>;
    }
  >;
  VolunteerStatus: VolunteerStatus;
  VolunteerStatusChangeEvent: ResolverTypeWrapper<
    Omit<VolunteerStatusChangeEvent, 'changedBy' | 'volunteer'> & {
      changedBy?: Maybe<ResolversTypes['User']>;
      volunteer: ResolversTypes['Volunteer'];
    }
  >;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AIIdentification: AIIdentificationModel;
  AIIdentificationConnection: Omit<AiIdentificationConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['AIIdentificationEdge']>;
  };
  AIIdentificationEdge: Omit<AiIdentificationEdge, 'node'> & {
    node: ResolversParentTypes['AIIdentification'];
  };
  AIIdentificationFilterInput: AiIdentificationFilterInput;
  AIIdentificationSortInput: AiIdentificationSortInput;
  AIIdentificationStats: Omit<AiIdentificationStats, 'topIdentifiedSpecies'> & {
    topIdentifiedSpecies: Array<
      ResolversParentTypes['SpeciesIdentificationCount']
    >;
  };
  AIModelConfig: AiModelConfig;
  AcceptRescueInput: AcceptRescueInput;
  ActivityLog: ActivityLogModel;
  ActivityLogConnection: Omit<ActivityLogConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['ActivityLog']>;
  };
  AddTimelineEventInput: AddTimelineEventInput;
  AlternativeMatch: Omit<AlternativeMatch, 'species'> & {
    species: ResolversParentTypes['SnakeSpecies'];
  };
  AnalyticsDateRangeInput: AnalyticsDateRangeInput;
  ApplyVolunteerInput: ApplyVolunteerInput;
  AssignRescueInput: AssignRescueInput;
  AuthPayload: Omit<AuthPayload, 'user'> & {
    user: ResolversParentTypes['User'];
  };
  AvailableVolunteer: Omit<AvailableVolunteer, 'volunteer'> & {
    volunteer: ResolversParentTypes['Volunteer'];
  };
  BlogPost: BlogPostModel;
  BlogPostConnection: Omit<BlogPostConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['BlogPostEdge']>;
  };
  BlogPostEdge: Omit<BlogPostEdge, 'node'> & {
    node: ResolversParentTypes['BlogPost'];
  };
  BlogPostFilterInput: BlogPostFilterInput;
  BlogPostSortInput: BlogPostSortInput;
  Boolean: Scalars['Boolean']['output'];
  BulkNotificationInput: BulkNotificationInput;
  BulkOperationResult: BulkOperationResult;
  CMSStats: Omit<
    CmsStats,
    'featuredImages' | 'popularPosts' | 'recentPosts'
  > & {
    featuredImages: Array<ResolversParentTypes['GalleryImage']>;
    popularPosts: Array<ResolversParentTypes['BlogPost']>;
    recentPosts: Array<ResolversParentTypes['BlogPost']>;
  };
  ChangePasswordInput: ChangePasswordInput;
  CompleteRescueInput: CompleteRescueInput;
  ContactMessage: ContactMessageModel;
  ContactMessageConnection: Omit<ContactMessageConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['ContactMessageEdge']>;
  };
  ContactMessageEdge: Omit<ContactMessageEdge, 'node'> & {
    node: ResolversParentTypes['ContactMessage'];
  };
  ContactMessageFilterInput: ContactMessageFilterInput;
  ContactMessageSortInput: ContactMessageSortInput;
  ContactMessageStats: Omit<ContactMessageStats, 'recentMessages'> & {
    recentMessages: Array<ResolversParentTypes['ContactMessage']>;
  };
  CreateBlogPostInput: CreateBlogPostInput;
  CreateDonationInput: CreateDonationInput;
  CreateNotificationInput: CreateNotificationInput;
  CreateRescueRequestInput: CreateRescueRequestInput;
  CreateSnakeSpeciesInput: CreateSnakeSpeciesInput;
  CreateTrainingInput: CreateTrainingInput;
  CursorPaginationInput: CursorPaginationInput;
  DashboardStats: Omit<DashboardStats, 'recentDonations' | 'recentRescues'> & {
    recentDonations: Array<ResolversParentTypes['Donation']>;
    recentRescues: Array<ResolversParentTypes['RescueRequest']>;
  };
  DateTime: Scalars['DateTime']['output'];
  Donation: DonationModel;
  DonationByMethod: DonationByMethod;
  DonationByPurpose: DonationByPurpose;
  DonationConnection: Omit<DonationConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['DonationEdge']>;
  };
  DonationEdge: Omit<DonationEdge, 'node'> & {
    node: ResolversParentTypes['Donation'];
  };
  DonationFilterInput: DonationFilterInput;
  DonationSortInput: DonationSortInput;
  DonationStats: Omit<DonationStats, 'recentDonations' | 'topDonors'> & {
    recentDonations: Array<ResolversParentTypes['Donation']>;
    topDonors: Array<ResolversParentTypes['TopDonor']>;
  };
  DonationStatsInput: DonationStatsInput;
  DonationStatusChangeEvent: Omit<DonationStatusChangeEvent, 'donation'> & {
    donation: ResolversParentTypes['Donation'];
  };
  Email: Scalars['Email']['output'];
  EmailVerificationPayload: Omit<EmailVerificationPayload, 'user'> & {
    user?: Maybe<ResolversParentTypes['User']>;
  };
  EngagementMetrics: EngagementMetrics;
  Error: Error;
  FindAvailableVolunteersInput: FindAvailableVolunteersInput;
  Float: Scalars['Float']['output'];
  GalleryImage: GalleryImageModel;
  GalleryImageConnection: Omit<GalleryImageConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['GalleryImageEdge']>;
  };
  GalleryImageEdge: Omit<GalleryImageEdge, 'node'> & {
    node: ResolversParentTypes['GalleryImage'];
  };
  GalleryImageFilterInput: GalleryImageFilterInput;
  GalleryImageSortInput: GalleryImageSortInput;
  GeographicHeatmap: GeographicHeatmap;
  GeographicHeatmapInput: GeographicHeatmapInput;
  ID: Scalars['ID']['output'];
  IdentificationByProvider: IdentificationByProvider;
  IdentificationFeedbackEvent: Omit<
    IdentificationFeedbackEvent,
    'correctSpecies' | 'identification' | 'user'
  > & {
    correctSpecies?: Maybe<ResolversParentTypes['SnakeSpecies']>;
    identification: ResolversParentTypes['AIIdentification'];
    user: ResolversParentTypes['User'];
  };
  IdentificationFeedbackInput: IdentificationFeedbackInput;
  IdentifySnakeInput: IdentifySnakeInput;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Latitude: Scalars['Latitude']['output'];
  LoginInput: LoginInput;
  Longitude: Scalars['Longitude']['output'];
  MessageByCategory: MessageByCategory;
  MessageByPriority: MessageByPriority;
  MonthlyDonationData: MonthlyDonationData;
  Mutation: Record<PropertyKey, never>;
  MutationResponse: ResolversInterfaceTypes<ResolversParentTypes>['MutationResponse'];
  NearbyRescue: Omit<NearbyRescue, 'rescue'> & {
    rescue: ResolversParentTypes['RescueRequest'];
  };
  NearbyRescuesInput: NearbyRescuesInput;
  Notification: NotificationModel;
  NotificationByPriority: NotificationByPriority;
  NotificationByType: NotificationByType;
  NotificationConnection: Omit<NotificationConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['NotificationEdge']>;
  };
  NotificationDeliveryStats: NotificationDeliveryStats;
  NotificationEdge: Omit<NotificationEdge, 'node'> & {
    node: ResolversParentTypes['Notification'];
  };
  NotificationFilterInput: NotificationFilterInput;
  NotificationPreferences: NotificationPreferences;
  NotificationPreferencesInput: NotificationPreferencesInput;
  NotificationReadEvent: Omit<NotificationReadEvent, 'notification'> & {
    notification: ResolversParentTypes['Notification'];
  };
  NotificationSortInput: NotificationSortInput;
  NotificationStats: NotificationStats;
  OAuthLoginInput: OAuthLoginInput;
  PageInfo: PageInfo;
  PageView: PageView;
  PaginationInput: PaginationInput;
  PasswordResetRequestInput: PasswordResetRequestInput;
  PasswordResetTokenPayload: PasswordResetTokenPayload;
  PaymentGatewayConfig: PaymentGatewayConfig;
  Phone: Scalars['Phone']['output'];
  PositiveInt: Scalars['PositiveInt']['output'];
  ProcessPaymentInput: ProcessPaymentInput;
  Query: Record<PropertyKey, never>;
  RefundDonationInput: RefundDonationInput;
  RegisterInput: RegisterInput;
  RescueActivityPoint: RescueActivityPoint;
  RescueAnalytics: Omit<RescueAnalytics, 'bySpecies'> & {
    bySpecies: Array<ResolversParentTypes['RescueBySpecies']>;
  };
  RescueAnalyticsInput: RescueAnalyticsInput;
  RescueAssignmentEvent: Omit<
    RescueAssignmentEvent,
    'assignedBy' | 'rescue' | 'volunteer'
  > & {
    assignedBy: ResolversParentTypes['User'];
    rescue: ResolversParentTypes['RescueRequest'];
    volunteer: ResolversParentTypes['Volunteer'];
  };
  RescueByMunicipality: RescueByMunicipality;
  RescueByPriority: RescueByPriority;
  RescueBySpecies: Omit<RescueBySpecies, 'species'> & {
    species: ResolversParentTypes['SnakeSpecies'];
  };
  RescueByStatus: RescueByStatus;
  RescueByTimeOfDay: RescueByTimeOfDay;
  RescueMunicipalityStats: RescueMunicipalityStats;
  RescuePriorityStats: RescuePriorityStats;
  RescueRequest: RescueRequestModel;
  RescueRequestConnection: Omit<RescueRequestConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['RescueRequestEdge']>;
  };
  RescueRequestEdge: Omit<RescueRequestEdge, 'node'> & {
    node: ResolversParentTypes['RescueRequest'];
  };
  RescueRequestFilterInput: RescueRequestFilterInput;
  RescueSortInput: RescueSortInput;
  RescueSpeciesStats: Omit<RescueSpeciesStats, 'species'> & {
    species: ResolversParentTypes['SnakeSpecies'];
  };
  RescueStats: Omit<RescueStats, 'bySpecies'> & {
    bySpecies: Array<ResolversParentTypes['RescueSpeciesStats']>;
  };
  RescueStatsInput: RescueStatsInput;
  RescueTimeline: RescueTimelineModel;
  ResendVerificationInput: ResendVerificationInput;
  ResetPasswordInput: ResetPasswordInput;
  RespondToMessageInput: RespondToMessageInput;
  ResponseTimeAnalysis: ResponseTimeAnalysis;
  ResponseTimeByPriority: ResponseTimeByPriority;
  ReviewVolunteerInput: ReviewVolunteerInput;
  SnakeSpecies: SnakeSpeciesModel;
  SnakeSpeciesConnection: Omit<SnakeSpeciesConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['SnakeSpeciesEdge']>;
  };
  SnakeSpeciesEdge: Omit<SnakeSpeciesEdge, 'node'> & {
    node: ResolversParentTypes['SnakeSpecies'];
  };
  SnakeSpeciesFilterInput: SnakeSpeciesFilterInput;
  SnakeSpeciesSortInput: SnakeSpeciesSortInput;
  SnakeSpeciesStats: Omit<SnakeSpeciesStats, 'mostEncountered'> & {
    mostEncountered: Array<ResolversParentTypes['SnakeSpecies']>;
  };
  SpeciesByDangerLevel: SpeciesByDangerLevel;
  SpeciesByFamily: SpeciesByFamily;
  SpeciesIdentificationCount: Omit<SpeciesIdentificationCount, 'species'> & {
    species: ResolversParentTypes['SnakeSpecies'];
  };
  String: Scalars['String']['output'];
  StripeConnectionStatus: StripeConnectionStatus;
  SubmitContactMessageInput: SubmitContactMessageInput;
  Subscription: Record<PropertyKey, never>;
  SuccessResponse: SuccessResponse;
  TimeSeriesPoint: TimeSeriesPoint;
  TopDonor: Omit<TopDonor, 'donor'> & {
    donor?: Maybe<ResolversParentTypes['User']>;
  };
  Training: TrainingModel;
  TrainingByType: TrainingByType;
  TrainingConnection: Omit<TrainingConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['TrainingEdge']>;
  };
  TrainingEdge: Omit<TrainingEdge, 'node'> & {
    node: ResolversParentTypes['Training'];
  };
  TrainingEnrollmentEvent: Omit<
    TrainingEnrollmentEvent,
    'training' | 'user'
  > & {
    training: ResolversParentTypes['Training'];
    user: ResolversParentTypes['User'];
  };
  TrainingFilterInput: TrainingFilterInput;
  TrainingSortInput: TrainingSortInput;
  TrainingStats: Omit<TrainingStats, 'recentSessions'> & {
    recentSessions: Array<ResolversParentTypes['Training']>;
  };
  TrendData: TrendData;
  UnreadCountEvent: UnreadCountEvent;
  UpdateAIModelConfigInput: UpdateAiModelConfigInput;
  UpdateBlogPostInput: UpdateBlogPostInput;
  UpdateGalleryImageInput: UpdateGalleryImageInput;
  UpdateMessageStatusInput: UpdateMessageStatusInput;
  UpdateNotificationPreferencesInput: UpdateNotificationPreferencesInput;
  UpdatePaymentGatewayInput: UpdatePaymentGatewayInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateRescueProgressInput: UpdateRescueProgressInput;
  UpdateRescueRequestInput: UpdateRescueRequestInput;
  UpdateSnakeSpeciesInput: UpdateSnakeSpeciesInput;
  UpdateTrainingInput: UpdateTrainingInput;
  UpdateUserProfileInput: UpdateUserProfileInput;
  UpdateVolunteerAvailabilityInput: UpdateVolunteerAvailabilityInput;
  UpdateVolunteerInput: UpdateVolunteerInput;
  Upload: Scalars['Upload']['output'];
  UploadGalleryImageInput: UploadGalleryImageInput;
  User: UserModel;
  UserConnection: Omit<UserConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['User']>;
  };
  UserFilterInput: UserFilterInput;
  UserProfile: Omit<UserProfile, 'volunteerProfile'> & {
    volunteerProfile?: Maybe<ResolversParentTypes['Volunteer']>;
  };
  UserSortInput: UserSortInput;
  UserStatusChangeEvent: Omit<UserStatusChangeEvent, 'changedBy' | 'user'> & {
    changedBy?: Maybe<ResolversParentTypes['User']>;
    user: ResolversParentTypes['User'];
  };
  ValidationError: ValidationError;
  VerifyEmailInput: VerifyEmailInput;
  Volunteer: VolunteerModel;
  VolunteerAnalytics: Omit<VolunteerAnalytics, 'topPerformers'> & {
    topPerformers: Array<ResolversParentTypes['VolunteerPerformance']>;
  };
  VolunteerAnalyticsInput: VolunteerAnalyticsInput;
  VolunteerAvailabilityEvent: Omit<VolunteerAvailabilityEvent, 'volunteer'> & {
    volunteer: ResolversParentTypes['Volunteer'];
  };
  VolunteerByExperience: VolunteerByExperience;
  VolunteerByMunicipality: VolunteerByMunicipality;
  VolunteerByStatus: VolunteerByStatus;
  VolunteerConnection: Omit<VolunteerConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['VolunteerEdge']>;
  };
  VolunteerEdge: Omit<VolunteerEdge, 'node'> & {
    node: ResolversParentTypes['Volunteer'];
  };
  VolunteerExperienceStats: VolunteerExperienceStats;
  VolunteerFilterInput: VolunteerFilterInput;
  VolunteerMunicipalityStats: VolunteerMunicipalityStats;
  VolunteerPerformance: Omit<VolunteerPerformance, 'volunteer'> & {
    volunteer: ResolversParentTypes['Volunteer'];
  };
  VolunteerSortInput: VolunteerSortInput;
  VolunteerStats: Omit<VolunteerStats, 'topPerformers'> & {
    topPerformers: Array<ResolversParentTypes['VolunteerPerformance']>;
  };
  VolunteerStatusChangeEvent: Omit<
    VolunteerStatusChangeEvent,
    'changedBy' | 'volunteer'
  > & {
    changedBy?: Maybe<ResolversParentTypes['User']>;
    volunteer: ResolversParentTypes['Volunteer'];
  };
}>;

export type AuthDirectiveArgs = {
  requires?: Maybe<Array<UserRole>>;
};

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = GraphQLContext,
  Args = AuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RateLimitDirectiveArgs = {
  limit: Scalars['Int']['input'];
  window: Scalars['Int']['input'];
};

export type RateLimitDirectiveResolver<
  Result,
  Parent,
  ContextType = GraphQLContext,
  Args = RateLimitDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AiIdentificationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AIIdentification'] = ResolversParentTypes['AIIdentification'],
> = ResolversObject<{
  alternativeMatches?: Resolver<
    Array<ResolversTypes['AlternativeMatch']>,
    ParentType,
    ContextType
  >;
  colorDetected?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  confidence?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  correctSpecies?: Resolver<
    Maybe<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dangerAssessment?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageThumbnail?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  promptUsed?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  provider?: Resolver<ResolversTypes['AIProvider'], ParentType, ContextType>;
  rescueRequest?: Resolver<
    Maybe<ResolversTypes['RescueRequest']>,
    ParentType,
    ContextType
  >;
  responseTime?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  sizeEstimate?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  species?: Resolver<
    Maybe<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType
  >;
  uploadSource?: Resolver<
    ResolversTypes['UploadSource'],
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userFeedback?: Resolver<
    Maybe<ResolversTypes['IdentificationFeedback']>,
    ParentType,
    ContextType
  >;
  venomousDetected?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
}>;

export type AiIdentificationConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AIIdentificationConnection'] = ResolversParentTypes['AIIdentificationConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['AIIdentificationEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type AiIdentificationEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AIIdentificationEdge'] = ResolversParentTypes['AIIdentificationEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AIIdentification'], ParentType, ContextType>;
}>;

export type AiIdentificationStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AIIdentificationStats'] = ResolversParentTypes['AIIdentificationStats'],
> = ResolversObject<{
  accuracyRate?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  averageConfidence?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  averageResponseTime?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  byProvider?: Resolver<
    Array<ResolversTypes['IdentificationByProvider']>,
    ParentType,
    ContextType
  >;
  topIdentifiedSpecies?: Resolver<
    Array<ResolversTypes['SpeciesIdentificationCount']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type AiModelConfigResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AIModelConfig'] = ResolversParentTypes['AIModelConfig'],
> = ResolversObject<{
  accuracy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  averageResponseTime?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxImageSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['AIProvider'], ParentType, ContextType>;
  supportedFormats?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
}>;

export type ActivityLogResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ActivityLog'] = ResolversParentTypes['ActivityLog'],
> = ResolversObject<{
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ipAddress?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resourceId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userAgent?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type ActivityLogConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ActivityLogConnection'] = ResolversParentTypes['ActivityLogConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['ActivityLog']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type AlternativeMatchResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AlternativeMatch'] = ResolversParentTypes['AlternativeMatch'],
> = ResolversObject<{
  confidence?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reasoning?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  species?: Resolver<ResolversTypes['SnakeSpecies'], ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload'],
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type AvailableVolunteerResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['AvailableVolunteer'] = ResolversParentTypes['AvailableVolunteer'],
> = ResolversObject<{
  currentlyAssigned?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  distance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  estimatedArrival?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  volunteer?: Resolver<ResolversTypes['Volunteer'], ParentType, ContextType>;
}>;

export type BlogPostResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['BlogPost'] = ResolversParentTypes['BlogPost'],
> = ResolversObject<{
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['PostCategory'], ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  commentsEnabled?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  excerpt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  metaKeywords?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  metaTitle?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  publishedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  scheduledAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  shares?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PostStatus'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  videoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type BlogPostConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['BlogPostConnection'] = ResolversParentTypes['BlogPostConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['BlogPostEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type BlogPostEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['BlogPostEdge'] = ResolversParentTypes['BlogPostEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['BlogPost'], ParentType, ContextType>;
}>;

export type BulkOperationResultResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['BulkOperationResult'] = ResolversParentTypes['BulkOperationResult'],
> = ResolversObject<{
  errors?: Resolver<Array<ResolversTypes['Error']>, ParentType, ContextType>;
  failed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  succeeded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type CmsStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['CMSStats'] = ResolversParentTypes['CMSStats'],
> = ResolversObject<{
  draftPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  featuredImages?: Resolver<
    Array<ResolversTypes['GalleryImage']>,
    ParentType,
    ContextType
  >;
  popularPosts?: Resolver<
    Array<ResolversTypes['BlogPost']>,
    ParentType,
    ContextType
  >;
  publicImages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publishedPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recentPosts?: Resolver<
    Array<ResolversTypes['BlogPost']>,
    ParentType,
    ContextType
  >;
  totalImages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalLikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ContactMessageResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ContactMessage'] = ResolversParentTypes['ContactMessage'],
> = ResolversObject<{
  assignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  category?: Resolver<
    ResolversTypes['MessageCategory'],
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['Email'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ipAddress?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['Phone']>, ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['MessagePriority'],
    ParentType,
    ContextType
  >;
  responded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  respondedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  response?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MessageStatus'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userAgent?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
}>;

export type ContactMessageConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ContactMessageConnection'] = ResolversParentTypes['ContactMessageConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['ContactMessageEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ContactMessageEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ContactMessageEdge'] = ResolversParentTypes['ContactMessageEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ContactMessage'], ParentType, ContextType>;
}>;

export type ContactMessageStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ContactMessageStats'] = ResolversParentTypes['ContactMessageStats'],
> = ResolversObject<{
  averageResponseTime?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  byCategory?: Resolver<
    Array<ResolversTypes['MessageByCategory']>,
    ParentType,
    ContextType
  >;
  byPriority?: Resolver<
    Array<ResolversTypes['MessageByPriority']>,
    ParentType,
    ContextType
  >;
  newMessages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recentMessages?: Resolver<
    Array<ResolversTypes['ContactMessage']>,
    ParentType,
    ContextType
  >;
  respondedMessages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type DashboardStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DashboardStats'] = ResolversParentTypes['DashboardStats'],
> = ResolversObject<{
  activeRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  activeVolunteers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  averageResponseTime?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  completedRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  donationTrend?: Resolver<
    ResolversTypes['TrendData'],
    ParentType,
    ContextType
  >;
  recentDonations?: Resolver<
    Array<ResolversTypes['Donation']>,
    ParentType,
    ContextType
  >;
  recentRescues?: Resolver<
    Array<ResolversTypes['RescueRequest']>,
    ParentType,
    ContextType
  >;
  rescueTrend?: Resolver<ResolversTypes['TrendData'], ParentType, ContextType>;
  totalDonationAmount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  totalDonations?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalSpecies?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalVolunteers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  venomousEncounters?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  verifiedRescuers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  volunteerTrend?: Resolver<
    ResolversTypes['TrendData'],
    ParentType,
    ContextType
  >;
}>;

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DonationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Donation'] = ResolversParentTypes['Donation'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  anonymous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  campaign?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  donor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  donorEmail?: Resolver<
    Maybe<ResolversTypes['Email']>,
    ParentType,
    ContextType
  >;
  donorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  donorPhone?: Resolver<
    Maybe<ResolversTypes['Phone']>,
    ParentType,
    ContextType
  >;
  gatewayResponse?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  ipAddress?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paidAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  paymentGateway?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentMethod?: Resolver<
    ResolversTypes['PaymentMethod'],
    ParentType,
    ContextType
  >;
  purpose?: Resolver<
    Maybe<ResolversTypes['DonationPurpose']>,
    ParentType,
    ContextType
  >;
  receiptNumber?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  receiptUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  refundAmount?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  refundReason?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  refundedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ContextType>;
  transactionId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userAgent?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  verificationNotes?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  verifiedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  verifiedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type DonationByMethodResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DonationByMethod'] = ResolversParentTypes['DonationByMethod'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  method?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type DonationByPurposeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DonationByPurpose'] = ResolversParentTypes['DonationByPurpose'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  purpose?: Resolver<
    ResolversTypes['DonationPurpose'],
    ParentType,
    ContextType
  >;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type DonationConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DonationConnection'] = ResolversParentTypes['DonationConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['DonationEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type DonationEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DonationEdge'] = ResolversParentTypes['DonationEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Donation'], ParentType, ContextType>;
}>;

export type DonationStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DonationStats'] = ResolversParentTypes['DonationStats'],
> = ResolversObject<{
  averageDonation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  byMethod?: Resolver<
    Array<ResolversTypes['DonationByMethod']>,
    ParentType,
    ContextType
  >;
  byPurpose?: Resolver<
    Array<ResolversTypes['DonationByPurpose']>,
    ParentType,
    ContextType
  >;
  monthlyTrend?: Resolver<
    Array<ResolversTypes['MonthlyDonationData']>,
    ParentType,
    ContextType
  >;
  recentDonations?: Resolver<
    Array<ResolversTypes['Donation']>,
    ParentType,
    ContextType
  >;
  topDonors?: Resolver<
    Array<ResolversTypes['TopDonor']>,
    ParentType,
    ContextType
  >;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmountUSD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalDonations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type DonationStatusChangeEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['DonationStatusChangeEvent'] = ResolversParentTypes['DonationStatusChangeEvent'],
> = ResolversObject<{
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  donation?: Resolver<ResolversTypes['Donation'], ParentType, ContextType>;
  newStatus?: Resolver<
    ResolversTypes['PaymentStatus'],
    ParentType,
    ContextType
  >;
  oldStatus?: Resolver<
    ResolversTypes['PaymentStatus'],
    ParentType,
    ContextType
  >;
}>;

export interface EmailScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Email'], any> {
  name: 'Email';
}

export type EmailVerificationPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['EmailVerificationPayload'] = ResolversParentTypes['EmailVerificationPayload'],
> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type EngagementMetricsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['EngagementMetrics'] = ResolversParentTypes['EngagementMetrics'],
> = ResolversObject<{
  avgSessionDuration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  bounceRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  topPages?: Resolver<
    Array<ResolversTypes['PageView']>,
    ParentType,
    ContextType
  >;
  totalPageViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uniqueVisitors?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userGrowth?: Resolver<
    Array<ResolversTypes['TimeSeriesPoint']>,
    ParentType,
    ContextType
  >;
}>;

export type ErrorResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Error'] = ResolversParentTypes['Error'],
> = ResolversObject<{
  code?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  field?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['ErrorSeverity'], ParentType, ContextType>;
}>;

export type GalleryImageResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['GalleryImage'] = ResolversParentTypes['GalleryImage'],
> = ResolversObject<{
  category?: Resolver<
    Maybe<ResolversTypes['GalleryCategory']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  dimensions?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  fileSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isFeatured?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rescue?: Resolver<
    Maybe<ResolversTypes['RescueRequest']>,
    ParentType,
    ContextType
  >;
  rescueId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  species?: Resolver<
    Maybe<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType
  >;
  speciesId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploader?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GalleryImageConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['GalleryImageConnection'] = ResolversParentTypes['GalleryImageConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['GalleryImageEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GalleryImageEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['GalleryImageEdge'] = ResolversParentTypes['GalleryImageEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['GalleryImage'], ParentType, ContextType>;
}>;

export type GeographicHeatmapResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['GeographicHeatmap'] = ResolversParentTypes['GeographicHeatmap'],
> = ResolversObject<{
  intensity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Latitude'], ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Longitude'], ParentType, ContextType>;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rescueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type IdentificationByProviderResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['IdentificationByProvider'] = ResolversParentTypes['IdentificationByProvider'],
> = ResolversObject<{
  averageConfidence?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  averageResponseTime?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['AIProvider'], ParentType, ContextType>;
}>;

export type IdentificationFeedbackEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['IdentificationFeedbackEvent'] = ResolversParentTypes['IdentificationFeedbackEvent'],
> = ResolversObject<{
  correctSpecies?: Resolver<
    Maybe<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType
  >;
  feedback?: Resolver<
    ResolversTypes['IdentificationFeedback'],
    ParentType,
    ContextType
  >;
  identification?: Resolver<
    ResolversTypes['AIIdentification'],
    ParentType,
    ContextType
  >;
  providedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface LatitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Latitude'], any> {
  name: 'Latitude';
}

export interface LongitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Longitude'], any> {
  name: 'Longitude';
}

export type MessageByCategoryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['MessageByCategory'] = ResolversParentTypes['MessageByCategory'],
> = ResolversObject<{
  category?: Resolver<
    ResolversTypes['MessageCategory'],
    ParentType,
    ContextType
  >;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  newCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type MessageByPriorityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['MessageByPriority'] = ResolversParentTypes['MessageByPriority'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['MessagePriority'],
    ParentType,
    ContextType
  >;
}>;

export type MonthlyDonationDataResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['MonthlyDonationData'] = ResolversParentTypes['MonthlyDonationData'],
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  acceptRescue?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationAcceptRescueArgs, 'input'>
  >;
  addRescueTimelineEvent?: Resolver<
    ResolversTypes['RescueTimeline'],
    ParentType,
    ContextType,
    RequireFields<MutationAddRescueTimelineEventArgs, 'input'>
  >;
  applyVolunteer?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationApplyVolunteerArgs, 'input'>
  >;
  archiveBlogPost?: Resolver<
    ResolversTypes['BlogPost'],
    ParentType,
    ContextType,
    RequireFields<MutationArchiveBlogPostArgs, 'id'>
  >;
  archiveContactMessage?: Resolver<
    ResolversTypes['ContactMessage'],
    ParentType,
    ContextType,
    RequireFields<MutationArchiveContactMessageArgs, 'messageId'>
  >;
  assignRescue?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignRescueArgs, 'input'>
  >;
  bulkApproveVolunteers?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkApproveVolunteersArgs, 'volunteerIds'>
  >;
  bulkAssignRescues?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkAssignRescuesArgs, 'rescueIds' | 'volunteerId'>
  >;
  bulkDeleteGalleryImages?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkDeleteGalleryImagesArgs, 'ids'>
  >;
  bulkImportSnakeSpecies?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkImportSnakeSpeciesArgs, 'species'>
  >;
  bulkPublishBlogPosts?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkPublishBlogPostsArgs, 'ids'>
  >;
  bulkUpdateMessageStatus?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkUpdateMessageStatusArgs, 'messageIds' | 'status'>
  >;
  bulkUpdateRescueStatus?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationBulkUpdateRescueStatusArgs, 'rescueIds' | 'status'>
  >;
  cancelRescue?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationCancelRescueArgs, 'rescueId'>
  >;
  cancelTraining?: Resolver<
    ResolversTypes['Training'],
    ParentType,
    ContextType,
    RequireFields<MutationCancelTrainingArgs, 'trainingId'>
  >;
  cancelTrainingEnrollment?: Resolver<
    ResolversTypes['Training'],
    ParentType,
    ContextType,
    RequireFields<MutationCancelTrainingEnrollmentArgs, 'trainingId'>
  >;
  changePassword?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationChangePasswordArgs, 'input'>
  >;
  completeRescue?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationCompleteRescueArgs, 'input'>
  >;
  completeTraining?: Resolver<
    ResolversTypes['Training'],
    ParentType,
    ContextType,
    RequireFields<MutationCompleteTrainingArgs, 'trainingId'>
  >;
  createBlogPost?: Resolver<
    ResolversTypes['BlogPost'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateBlogPostArgs, 'input'>
  >;
  createDonation?: Resolver<
    ResolversTypes['Donation'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDonationArgs, 'input'>
  >;
  createNotification?: Resolver<
    ResolversTypes['Notification'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateNotificationArgs, 'input'>
  >;
  createRescueRequest?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateRescueRequestArgs, 'input'>
  >;
  createSnakeSpecies?: Resolver<
    ResolversTypes['SnakeSpecies'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateSnakeSpeciesArgs, 'input'>
  >;
  createTraining?: Resolver<
    ResolversTypes['Training'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTrainingArgs, 'input'>
  >;
  deleteAIIdentification?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteAiIdentificationArgs, 'id'>
  >;
  deleteAccount?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteAccountArgs, 'password'>
  >;
  deleteBlogPost?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteBlogPostArgs, 'id'>
  >;
  deleteContactMessage?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteContactMessageArgs, 'id'>
  >;
  deleteGalleryImage?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteGalleryImageArgs, 'id'>
  >;
  deleteNotification?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteNotificationArgs, 'id'>
  >;
  deleteReadNotifications?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType
  >;
  deleteRescueRequest?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRescueRequestArgs, 'id'>
  >;
  deleteSnakeSpecies?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteSnakeSpeciesArgs, 'id'>
  >;
  deleteTraining?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTrainingArgs, 'id'>
  >;
  deleteVolunteer?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteVolunteerArgs, 'volunteerId'>
  >;
  enrollInTraining?: Resolver<
    ResolversTypes['Training'],
    ParentType,
    ContextType,
    RequireFields<MutationEnrollInTrainingArgs, 'trainingId'>
  >;
  forgotPassword?: Resolver<
    ResolversTypes['PasswordResetTokenPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationForgotPasswordArgs, 'email'>
  >;
  generateDonationReceipt?: Resolver<
    ResolversTypes['Donation'],
    ParentType,
    ContextType,
    RequireFields<MutationGenerateDonationReceiptArgs, 'donationId'>
  >;
  identifySnake?: Resolver<
    ResolversTypes['AIIdentification'],
    ParentType,
    ContextType,
    RequireFields<MutationIdentifySnakeArgs, 'input'>
  >;
  incrementBlogPostViews?: Resolver<
    ResolversTypes['BlogPost'],
    ParentType,
    ContextType,
    RequireFields<MutationIncrementBlogPostViewsArgs, 'id'>
  >;
  incrementGalleryImageViews?: Resolver<
    ResolversTypes['GalleryImage'],
    ParentType,
    ContextType,
    RequireFields<MutationIncrementGalleryImageViewsArgs, 'id'>
  >;
  likeBlogPost?: Resolver<
    ResolversTypes['BlogPost'],
    ParentType,
    ContextType,
    RequireFields<MutationLikeBlogPostArgs, 'id'>
  >;
  likeGalleryImage?: Resolver<
    ResolversTypes['GalleryImage'],
    ParentType,
    ContextType,
    RequireFields<MutationLikeGalleryImageArgs, 'id'>
  >;
  login?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'input'>
  >;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  markAllNotificationsAsRead?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType
  >;
  markMessageAsRead?: Resolver<
    ResolversTypes['ContactMessage'],
    ParentType,
    ContextType,
    RequireFields<MutationMarkMessageAsReadArgs, 'messageId'>
  >;
  markNotificationAsRead?: Resolver<
    ResolversTypes['Notification'],
    ParentType,
    ContextType,
    RequireFields<MutationMarkNotificationAsReadArgs, 'id'>
  >;
  oauthLogin?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationOauthLoginArgs, 'input'>
  >;
  processPayment?: Resolver<
    ResolversTypes['Donation'],
    ParentType,
    ContextType,
    RequireFields<MutationProcessPaymentArgs, 'input'>
  >;
  provideIdentificationFeedback?: Resolver<
    ResolversTypes['AIIdentification'],
    ParentType,
    ContextType,
    RequireFields<MutationProvideIdentificationFeedbackArgs, 'input'>
  >;
  publishBlogPost?: Resolver<
    ResolversTypes['BlogPost'],
    ParentType,
    ContextType,
    RequireFields<MutationPublishBlogPostArgs, 'id'>
  >;
  rateVolunteer?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<
      MutationRateVolunteerArgs,
      'rating' | 'rescueId' | 'volunteerId'
    >
  >;
  reactivateVolunteer?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationReactivateVolunteerArgs, 'volunteerId'>
  >;
  refreshAnalyticsCache?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType
  >;
  refreshToken?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType
  >;
  refundDonation?: Resolver<
    ResolversTypes['Donation'],
    ParentType,
    ContextType,
    RequireFields<MutationRefundDonationArgs, 'input'>
  >;
  register?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, 'input'>
  >;
  reopenRescue?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationReopenRescueArgs, 'rescueId'>
  >;
  reprocessIdentification?: Resolver<
    ResolversTypes['AIIdentification'],
    ParentType,
    ContextType,
    RequireFields<
      MutationReprocessIdentificationArgs,
      'identificationId' | 'provider'
    >
  >;
  resendVerification?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationResendVerificationArgs, 'input'>
  >;
  resetPassword?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, 'input'>
  >;
  respondToMessage?: Resolver<
    ResolversTypes['ContactMessage'],
    ParentType,
    ContextType,
    RequireFields<MutationRespondToMessageArgs, 'input'>
  >;
  reviewVolunteerApplication?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationReviewVolunteerApplicationArgs, 'input'>
  >;
  sendBulkNotifications?: Resolver<
    ResolversTypes['BulkOperationResult'],
    ParentType,
    ContextType,
    RequireFields<MutationSendBulkNotificationsArgs, 'input'>
  >;
  submitContactMessage?: Resolver<
    ResolversTypes['ContactMessage'],
    ParentType,
    ContextType,
    RequireFields<MutationSubmitContactMessageArgs, 'input'>
  >;
  suspendVolunteer?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationSuspendVolunteerArgs, 'reason' | 'volunteerId'>
  >;
  testNotificationDelivery?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationTestNotificationDeliveryArgs, 'channel'>
  >;
  trackPageView?: Resolver<
    ResolversTypes['SuccessResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationTrackPageViewArgs, 'page'>
  >;
  updateAIModelConfig?: Resolver<
    ResolversTypes['AIModelConfig'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAiModelConfigArgs, 'input'>
  >;
  updateBlogPost?: Resolver<
    ResolversTypes['BlogPost'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateBlogPostArgs, 'id' | 'input'>
  >;
  updateGalleryImage?: Resolver<
    ResolversTypes['GalleryImage'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGalleryImageArgs, 'id' | 'input'>
  >;
  updateMessageStatus?: Resolver<
    ResolversTypes['ContactMessage'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMessageStatusArgs, 'input'>
  >;
  updateNotificationPreferences?: Resolver<
    ResolversTypes['NotificationPreferences'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateNotificationPreferencesArgs, 'input'>
  >;
  updatePaymentGateway?: Resolver<
    ResolversTypes['PaymentGatewayConfig'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePaymentGatewayArgs, 'input'>
  >;
  updateProfile?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProfileArgs, 'input'>
  >;
  updateRescueProgress?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateRescueProgressArgs, 'input'>
  >;
  updateRescueRequest?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateRescueRequestArgs, 'id' | 'input'>
  >;
  updateSnakeSpecies?: Resolver<
    ResolversTypes['SnakeSpecies'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSnakeSpeciesArgs, 'id' | 'input'>
  >;
  updateTraining?: Resolver<
    ResolversTypes['Training'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTrainingArgs, 'id' | 'input'>
  >;
  updateVolunteerAvailability?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateVolunteerAvailabilityArgs, 'input'>
  >;
  updateVolunteerProfile?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateVolunteerProfileArgs, 'input'>
  >;
  updateVolunteerZone?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateVolunteerZoneArgs, 'volunteerId' | 'zone'>
  >;
  uploadGalleryImage?: Resolver<
    ResolversTypes['GalleryImage'],
    ParentType,
    ContextType,
    RequireFields<MutationUploadGalleryImageArgs, 'input'>
  >;
  verifyDonation?: Resolver<
    ResolversTypes['Donation'],
    ParentType,
    ContextType,
    RequireFields<MutationVerifyDonationArgs, 'donationId'>
  >;
  verifyEmail?: Resolver<
    ResolversTypes['EmailVerificationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationVerifyEmailArgs, 'input'>
  >;
  verifyRescue?: Resolver<
    ResolversTypes['RescueRequest'],
    ParentType,
    ContextType,
    RequireFields<MutationVerifyRescueArgs, 'rescueId'>
  >;
  verifySnakeSpecies?: Resolver<
    ResolversTypes['SnakeSpecies'],
    ParentType,
    ContextType,
    RequireFields<MutationVerifySnakeSpeciesArgs, 'id'>
  >;
  verifyVolunteer?: Resolver<
    ResolversTypes['Volunteer'],
    ParentType,
    ContextType,
    RequireFields<MutationVerifyVolunteerArgs, 'volunteerId'>
  >;
}>;

export type MutationResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
}>;

export type NearbyRescueResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NearbyRescue'] = ResolversParentTypes['NearbyRescue'],
> = ResolversObject<{
  distance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rescue?: Resolver<ResolversTypes['RescueRequest'], ParentType, ContextType>;
}>;

export type NotificationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Notification'] = ResolversParentTypes['Notification'],
> = ResolversObject<{
  actionUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiresAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['NotificationPriority'],
    ParentType,
    ContextType
  >;
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  readAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  rescue?: Resolver<
    Maybe<ResolversTypes['RescueRequest']>,
    ParentType,
    ContextType
  >;
  sentViaApp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sentViaEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sentViaSMS?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sentViaTelegram?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type NotificationByPriorityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationByPriority'] = ResolversParentTypes['NotificationByPriority'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['NotificationPriority'],
    ParentType,
    ContextType
  >;
}>;

export type NotificationByTypeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationByType'] = ResolversParentTypes['NotificationByType'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>;
  unreadCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type NotificationConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationConnection'] = ResolversParentTypes['NotificationConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['NotificationEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type NotificationDeliveryStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationDeliveryStats'] = ResolversParentTypes['NotificationDeliveryStats'],
> = ResolversObject<{
  app?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sms?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  telegram?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalDelivered?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalFailed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type NotificationEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationEdge'] = ResolversParentTypes['NotificationEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Notification'], ParentType, ContextType>;
}>;

export type NotificationPreferencesResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationPreferences'] = ResolversParentTypes['NotificationPreferences'],
> = ResolversObject<{
  donationReceipts?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  enableApp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  enableEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  enableSMS?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  enableTelegram?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  quietHoursEnd?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  quietHoursStart?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  rescueUpdates?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  systemAnnouncements?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trainingReminders?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  volunteerUpdates?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
}>;

export type NotificationReadEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationReadEvent'] = ResolversParentTypes['NotificationReadEvent'],
> = ResolversObject<{
  notification?: Resolver<
    ResolversTypes['Notification'],
    ParentType,
    ContextType
  >;
  readAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type NotificationStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['NotificationStats'] = ResolversParentTypes['NotificationStats'],
> = ResolversObject<{
  byPriority?: Resolver<
    Array<ResolversTypes['NotificationByPriority']>,
    ParentType,
    ContextType
  >;
  byType?: Resolver<
    Array<ResolversTypes['NotificationByType']>,
    ParentType,
    ContextType
  >;
  deliveryStats?: Resolver<
    ResolversTypes['NotificationDeliveryStats'],
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unread?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo'],
> = ResolversObject<{
  endCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  startCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
}>;

export type PageViewResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['PageView'] = ResolversParentTypes['PageView'],
> = ResolversObject<{
  avgDuration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uniqueViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type PasswordResetTokenPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['PasswordResetTokenPayload'] = ResolversParentTypes['PasswordResetTokenPayload'],
> = ResolversObject<{
  expiresAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PaymentGatewayConfigResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['PaymentGatewayConfig'] = ResolversParentTypes['PaymentGatewayConfig'],
> = ResolversObject<{
  currencies?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  method?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType>;
  minAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  testMode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export interface PhoneScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Phone'], any> {
  name: 'Phone';
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activeRescues?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    Partial<QueryActiveRescuesArgs>
  >;
  aiIdentification?: Resolver<
    Maybe<ResolversTypes['AIIdentification']>,
    ParentType,
    ContextType,
    RequireFields<QueryAiIdentificationArgs, 'id'>
  >;
  aiIdentificationStats?: Resolver<
    ResolversTypes['AIIdentificationStats'],
    ParentType,
    ContextType
  >;
  aiIdentifications?: Resolver<
    ResolversTypes['AIIdentificationConnection'],
    ParentType,
    ContextType,
    Partial<QueryAiIdentificationsArgs>
  >;
  aiModelConfig?: Resolver<
    Maybe<ResolversTypes['AIModelConfig']>,
    ParentType,
    ContextType,
    RequireFields<QueryAiModelConfigArgs, 'provider'>
  >;
  allSnakeSpecies?: Resolver<
    ResolversTypes['SnakeSpeciesConnection'],
    ParentType,
    ContextType,
    Partial<QueryAllSnakeSpeciesArgs>
  >;
  availableAIModels?: Resolver<
    Array<ResolversTypes['AIModelConfig']>,
    ParentType,
    ContextType
  >;
  availablePaymentGateways?: Resolver<
    Array<ResolversTypes['PaymentGatewayConfig']>,
    ParentType,
    ContextType
  >;
  availableVolunteers?: Resolver<
    Array<ResolversTypes['AvailableVolunteer']>,
    ParentType,
    ContextType,
    RequireFields<QueryAvailableVolunteersArgs, 'input'>
  >;
  blogPost?: Resolver<
    Maybe<ResolversTypes['BlogPost']>,
    ParentType,
    ContextType,
    Partial<QueryBlogPostArgs>
  >;
  blogPosts?: Resolver<
    ResolversTypes['BlogPostConnection'],
    ParentType,
    ContextType,
    Partial<QueryBlogPostsArgs>
  >;
  checkEmailAvailability?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryCheckEmailAvailabilityArgs, 'email'>
  >;
  cmsStats?: Resolver<ResolversTypes['CMSStats'], ParentType, ContextType>;
  contactMessage?: Resolver<
    Maybe<ResolversTypes['ContactMessage']>,
    ParentType,
    ContextType,
    RequireFields<QueryContactMessageArgs, 'id'>
  >;
  contactMessageStats?: Resolver<
    ResolversTypes['ContactMessageStats'],
    ParentType,
    ContextType
  >;
  contactMessages?: Resolver<
    ResolversTypes['ContactMessageConnection'],
    ParentType,
    ContextType,
    Partial<QueryContactMessagesArgs>
  >;
  dashboardStats?: Resolver<
    ResolversTypes['DashboardStats'],
    ParentType,
    ContextType,
    Partial<QueryDashboardStatsArgs>
  >;
  donation?: Resolver<
    Maybe<ResolversTypes['Donation']>,
    ParentType,
    ContextType,
    RequireFields<QueryDonationArgs, 'id'>
  >;
  donationStats?: Resolver<
    ResolversTypes['DonationStats'],
    ParentType,
    ContextType,
    Partial<QueryDonationStatsArgs>
  >;
  donations?: Resolver<
    ResolversTypes['DonationConnection'],
    ParentType,
    ContextType,
    Partial<QueryDonationsArgs>
  >;
  engagementMetrics?: Resolver<
    ResolversTypes['EngagementMetrics'],
    ParentType,
    ContextType,
    Partial<QueryEngagementMetricsArgs>
  >;
  exportAnalytics?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<QueryExportAnalyticsArgs, 'type'>
  >;
  featuredGalleryImages?: Resolver<
    ResolversTypes['GalleryImageConnection'],
    ParentType,
    ContextType,
    Partial<QueryFeaturedGalleryImagesArgs>
  >;
  galleryImage?: Resolver<
    Maybe<ResolversTypes['GalleryImage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGalleryImageArgs, 'id'>
  >;
  galleryImages?: Resolver<
    ResolversTypes['GalleryImageConnection'],
    ParentType,
    ContextType,
    Partial<QueryGalleryImagesArgs>
  >;
  geographicHeatmap?: Resolver<
    Array<ResolversTypes['GeographicHeatmap']>,
    ParentType,
    ContextType,
    Partial<QueryGeographicHeatmapArgs>
  >;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myActivityLogs?: Resolver<
    ResolversTypes['ActivityLogConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyActivityLogsArgs>
  >;
  myAssignedRescues?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyAssignedRescuesArgs>
  >;
  myDonations?: Resolver<
    ResolversTypes['DonationConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyDonationsArgs>
  >;
  myIdentificationHistory?: Resolver<
    ResolversTypes['AIIdentificationConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyIdentificationHistoryArgs>
  >;
  myNotificationPreferences?: Resolver<
    ResolversTypes['NotificationPreferences'],
    ParentType,
    ContextType
  >;
  myNotifications?: Resolver<
    ResolversTypes['NotificationConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyNotificationsArgs>
  >;
  myRescueRequests?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyRescueRequestsArgs>
  >;
  myTrainings?: Resolver<
    ResolversTypes['TrainingConnection'],
    ParentType,
    ContextType,
    Partial<QueryMyTrainingsArgs>
  >;
  myVolunteerProfile?: Resolver<
    Maybe<ResolversTypes['Volunteer']>,
    ParentType,
    ContextType
  >;
  nearbyRescues?: Resolver<
    Array<ResolversTypes['NearbyRescue']>,
    ParentType,
    ContextType,
    RequireFields<QueryNearbyRescuesArgs, 'input'>
  >;
  newContactMessagesCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  notification?: Resolver<
    Maybe<ResolversTypes['Notification']>,
    ParentType,
    ContextType,
    RequireFields<QueryNotificationArgs, 'id'>
  >;
  notificationStats?: Resolver<
    ResolversTypes['NotificationStats'],
    ParentType,
    ContextType,
    Partial<QueryNotificationStatsArgs>
  >;
  paymentGatewayConfig?: Resolver<
    Maybe<ResolversTypes['PaymentGatewayConfig']>,
    ParentType,
    ContextType,
    RequireFields<QueryPaymentGatewayConfigArgs, 'method'>
  >;
  pendingRescuesCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  pendingVolunteerApplications?: Resolver<
    ResolversTypes['VolunteerConnection'],
    ParentType,
    ContextType,
    Partial<QueryPendingVolunteerApplicationsArgs>
  >;
  publishedBlogPosts?: Resolver<
    ResolversTypes['BlogPostConnection'],
    ParentType,
    ContextType,
    Partial<QueryPublishedBlogPostsArgs>
  >;
  rescueAnalytics?: Resolver<
    ResolversTypes['RescueAnalytics'],
    ParentType,
    ContextType,
    Partial<QueryRescueAnalyticsArgs>
  >;
  rescueRequest?: Resolver<
    Maybe<ResolversTypes['RescueRequest']>,
    ParentType,
    ContextType,
    RequireFields<QueryRescueRequestArgs, 'id'>
  >;
  rescueRequests?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    Partial<QueryRescueRequestsArgs>
  >;
  rescueStats?: Resolver<
    ResolversTypes['RescueStats'],
    ParentType,
    ContextType,
    Partial<QueryRescueStatsArgs>
  >;
  rescueTimeline?: Resolver<
    Array<ResolversTypes['RescueTimeline']>,
    ParentType,
    ContextType,
    RequireFields<QueryRescueTimelineArgs, 'rescueId'>
  >;
  searchBlogPosts?: Resolver<
    ResolversTypes['BlogPostConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchBlogPostsArgs, 'query'>
  >;
  searchRescues?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchRescuesArgs, 'query'>
  >;
  searchSnakeSpecies?: Resolver<
    ResolversTypes['SnakeSpeciesConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchSnakeSpeciesArgs, 'query'>
  >;
  searchUsers?: Resolver<
    ResolversTypes['UserConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchUsersArgs, 'query'>
  >;
  searchVolunteers?: Resolver<
    ResolversTypes['VolunteerConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchVolunteersArgs, 'query'>
  >;
  snakeSpecies?: Resolver<
    Maybe<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType,
    RequireFields<QuerySnakeSpeciesArgs, 'id'>
  >;
  snakeSpeciesByRegion?: Resolver<
    ResolversTypes['SnakeSpeciesConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySnakeSpeciesByRegionArgs, 'region'>
  >;
  snakeSpeciesStats?: Resolver<
    ResolversTypes['SnakeSpeciesStats'],
    ParentType,
    ContextType
  >;
  snakesByDangerLevel?: Resolver<
    ResolversTypes['SnakeSpeciesConnection'],
    ParentType,
    ContextType,
    RequireFields<QuerySnakesByDangerLevelArgs, 'dangerLevel'>
  >;
  stripeConnectionStatus?: Resolver<
    ResolversTypes['StripeConnectionStatus'],
    ParentType,
    ContextType
  >;
  training?: Resolver<
    Maybe<ResolversTypes['Training']>,
    ParentType,
    ContextType,
    RequireFields<QueryTrainingArgs, 'id'>
  >;
  trainingStats?: Resolver<
    ResolversTypes['TrainingStats'],
    ParentType,
    ContextType
  >;
  trainings?: Resolver<
    ResolversTypes['TrainingConnection'],
    ParentType,
    ContextType,
    Partial<QueryTrainingsArgs>
  >;
  unreadNotificationsCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  upcomingTrainings?: Resolver<
    ResolversTypes['TrainingConnection'],
    ParentType,
    ContextType,
    Partial<QueryUpcomingTrainingsArgs>
  >;
  user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'id'>
  >;
  userProfile?: Resolver<
    Maybe<ResolversTypes['UserProfile']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserProfileArgs, 'id'>
  >;
  users?: Resolver<
    ResolversTypes['UserConnection'],
    ParentType,
    ContextType,
    Partial<QueryUsersArgs>
  >;
  venomousSnakes?: Resolver<
    ResolversTypes['SnakeSpeciesConnection'],
    ParentType,
    ContextType,
    Partial<QueryVenomousSnakesArgs>
  >;
  volunteer?: Resolver<
    Maybe<ResolversTypes['Volunteer']>,
    ParentType,
    ContextType,
    RequireFields<QueryVolunteerArgs, 'id'>
  >;
  volunteerAnalytics?: Resolver<
    ResolversTypes['VolunteerAnalytics'],
    ParentType,
    ContextType,
    Partial<QueryVolunteerAnalyticsArgs>
  >;
  volunteerStats?: Resolver<
    ResolversTypes['VolunteerStats'],
    ParentType,
    ContextType
  >;
  volunteers?: Resolver<
    ResolversTypes['VolunteerConnection'],
    ParentType,
    ContextType,
    Partial<QueryVolunteersArgs>
  >;
}>;

export type RescueActivityPointResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueActivityPoint'] = ResolversParentTypes['RescueActivityPoint'],
> = ResolversObject<{
  cancelled?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type RescueAnalyticsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueAnalytics'] = ResolversParentTypes['RescueAnalytics'],
> = ResolversObject<{
  byMunicipality?: Resolver<
    Array<ResolversTypes['RescueByMunicipality']>,
    ParentType,
    ContextType
  >;
  byPriority?: Resolver<
    Array<ResolversTypes['RescueByPriority']>,
    ParentType,
    ContextType
  >;
  bySpecies?: Resolver<
    Array<ResolversTypes['RescueBySpecies']>,
    ParentType,
    ContextType
  >;
  byStatus?: Resolver<
    Array<ResolversTypes['RescueByStatus']>,
    ParentType,
    ContextType
  >;
  byTimeOfDay?: Resolver<
    Array<ResolversTypes['RescueByTimeOfDay']>,
    ParentType,
    ContextType
  >;
  responseTimeAnalysis?: Resolver<
    ResolversTypes['ResponseTimeAnalysis'],
    ParentType,
    ContextType
  >;
  successRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timeSeriesData?: Resolver<
    Array<ResolversTypes['TimeSeriesPoint']>,
    ParentType,
    ContextType
  >;
  totalRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type RescueAssignmentEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueAssignmentEvent'] = ResolversParentTypes['RescueAssignmentEvent'],
> = ResolversObject<{
  assignedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  assignedBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rescue?: Resolver<ResolversTypes['RescueRequest'], ParentType, ContextType>;
  volunteer?: Resolver<ResolversTypes['Volunteer'], ParentType, ContextType>;
}>;

export type RescueByMunicipalityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueByMunicipality'] = ResolversParentTypes['RescueByMunicipality'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type RescueByPriorityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueByPriority'] = ResolversParentTypes['RescueByPriority'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['RescuePriority'],
    ParentType,
    ContextType
  >;
}>;

export type RescueBySpeciesResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueBySpecies'] = ResolversParentTypes['RescueBySpecies'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['SnakeSpecies'], ParentType, ContextType>;
}>;

export type RescueByStatusResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueByStatus'] = ResolversParentTypes['RescueByStatus'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RescueStatus'], ParentType, ContextType>;
}>;

export type RescueByTimeOfDayResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueByTimeOfDay'] = ResolversParentTypes['RescueByTimeOfDay'],
> = ResolversObject<{
  averageResponseTime?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hour?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type RescueMunicipalityStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueMunicipalityStats'] = ResolversParentTypes['RescueMunicipalityStats'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type RescuePriorityStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescuePriorityStats'] = ResolversParentTypes['RescuePriorityStats'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['RescuePriority'],
    ParentType,
    ContextType
  >;
}>;

export type RescueRequestResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueRequest'] = ResolversParentTypes['RescueRequest'],
> = ResolversObject<{
  acceptedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aiIdentification?: Resolver<
    Maybe<ResolversTypes['AIIdentification']>,
    ParentType,
    ContextType
  >;
  arrivedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  assignedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  assignedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  assignedVolunteer?: Resolver<
    Maybe<ResolversTypes['Volunteer']>,
    ParentType,
    ContextType
  >;
  biteDetails?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  completedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['Email']>, ParentType, ContextType>;
  emergencyDetails?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasBite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  internalNotes?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  isEmergency?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  landmark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['Latitude']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['Longitude']>, ParentType, ContextType>;
  locationAccuracy?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notifications?: Resolver<
    Array<ResolversTypes['Notification']>,
    ParentType,
    ContextType
  >;
  outcome?: Resolver<
    Maybe<ResolversTypes['RescueOutcome']>,
    ParentType,
    ContextType
  >;
  phone?: Resolver<ResolversTypes['Phone'], ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['RescuePriority'],
    ParentType,
    ContextType
  >;
  referenceNumber?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  rescueDuration?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  rescueImages?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  rescueReport?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  snakeColor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  snakeDescription?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  snakeImageUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  snakeImages?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  snakeSize?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  source?: Resolver<ResolversTypes['RescueSource'], ParentType, ContextType>;
  species?: Resolver<
    Maybe<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType
  >;
  startedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes['RescueStatus'], ParentType, ContextType>;
  stillPresent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timeline?: Resolver<
    Array<ResolversTypes['RescueTimeline']>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  verifiedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  verifiedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ward?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
}>;

export type RescueRequestConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueRequestConnection'] = ResolversParentTypes['RescueRequestConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['RescueRequestEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type RescueRequestEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueRequestEdge'] = ResolversParentTypes['RescueRequestEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['RescueRequest'], ParentType, ContextType>;
}>;

export type RescueSpeciesStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueSpeciesStats'] = ResolversParentTypes['RescueSpeciesStats'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['SnakeSpecies'], ParentType, ContextType>;
}>;

export type RescueStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueStats'] = ResolversParentTypes['RescueStats'],
> = ResolversObject<{
  averageRescueTime?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  averageResponseTime?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  byMunicipality?: Resolver<
    Array<ResolversTypes['RescueMunicipalityStats']>,
    ParentType,
    ContextType
  >;
  byPriority?: Resolver<
    Array<ResolversTypes['RescuePriorityStats']>,
    ParentType,
    ContextType
  >;
  bySpecies?: Resolver<
    Array<ResolversTypes['RescueSpeciesStats']>,
    ParentType,
    ContextType
  >;
  cancelled?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  inProgress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recentActivity?: Resolver<
    Array<ResolversTypes['RescueActivityPoint']>,
    ParentType,
    ContextType
  >;
  successRate?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type RescueTimelineResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['RescueTimeline'] = ResolversParentTypes['RescueTimeline'],
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  event?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['Latitude']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['Longitude']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  rescue?: Resolver<ResolversTypes['RescueRequest'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type ResponseTimeAnalysisResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ResponseTimeAnalysis'] = ResolversParentTypes['ResponseTimeAnalysis'],
> = ResolversObject<{
  average?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  byPriority?: Resolver<
    Array<ResolversTypes['ResponseTimeByPriority']>,
    ParentType,
    ContextType
  >;
  fastest?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  median?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slowest?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ResponseTimeByPriorityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ResponseTimeByPriority'] = ResolversParentTypes['ResponseTimeByPriority'],
> = ResolversObject<{
  average?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  median?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<
    ResolversTypes['RescuePriority'],
    ParentType,
    ContextType
  >;
}>;

export type SnakeSpeciesResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SnakeSpecies'] = ResolversParentTypes['SnakeSpecies'],
> = ResolversObject<{
  activeTime?: Resolver<
    Maybe<ResolversTypes['ActivityPattern']>,
    ParentType,
    ContextType
  >;
  aiIdentifications?: Resolver<
    ResolversTypes['AIIdentificationConnection'],
    ParentType,
    ContextType,
    Partial<SnakeSpeciesAiIdentificationsArgs>
  >;
  aliases?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  altitudeRange?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  averageLength?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  behavior?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conservationStatus?: Resolver<
    Maybe<ResolversTypes['ConservationStatus']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dangerLevel?: Resolver<
    Maybe<ResolversTypes['DangerLevel']>,
    ParentType,
    ContextType
  >;
  diet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  distinctiveFeatures?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  emergencyAdvice?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  family?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstAidSteps?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  foundInNepal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  genus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  habitat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identificationCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  identificationGuide?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  localNames?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  maxLength?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nepaliName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pattern?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  protected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  regions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  rescueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rescueRequests?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    Partial<SnakeSpeciesRescueRequestsArgs>
  >;
  safetyTips?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  scientificName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  species?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  venomType?: Resolver<
    Maybe<ResolversTypes['VenomType']>,
    ParentType,
    ContextType
  >;
  venomous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verifiedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  videoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type SnakeSpeciesConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SnakeSpeciesConnection'] = ResolversParentTypes['SnakeSpeciesConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['SnakeSpeciesEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SnakeSpeciesEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SnakeSpeciesEdge'] = ResolversParentTypes['SnakeSpeciesEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['SnakeSpecies'], ParentType, ContextType>;
}>;

export type SnakeSpeciesStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SnakeSpeciesStats'] = ResolversParentTypes['SnakeSpeciesStats'],
> = ResolversObject<{
  byDangerLevel?: Resolver<
    Array<ResolversTypes['SpeciesByDangerLevel']>,
    ParentType,
    ContextType
  >;
  byFamily?: Resolver<
    Array<ResolversTypes['SpeciesByFamily']>,
    ParentType,
    ContextType
  >;
  harmlessCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  mostEncountered?: Resolver<
    Array<ResolversTypes['SnakeSpecies']>,
    ParentType,
    ContextType
  >;
  totalSpecies?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  venomousCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SpeciesByDangerLevelResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SpeciesByDangerLevel'] = ResolversParentTypes['SpeciesByDangerLevel'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dangerLevel?: Resolver<
    ResolversTypes['DangerLevel'],
    ParentType,
    ContextType
  >;
}>;

export type SpeciesByFamilyResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SpeciesByFamily'] = ResolversParentTypes['SpeciesByFamily'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  family?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  venomousCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SpeciesIdentificationCountResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SpeciesIdentificationCount'] = ResolversParentTypes['SpeciesIdentificationCount'],
> = ResolversObject<{
  averageConfidence?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  species?: Resolver<ResolversTypes['SnakeSpecies'], ParentType, ContextType>;
}>;

export type StripeConnectionStatusResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['StripeConnectionStatus'] = ResolversParentTypes['StripeConnectionStatus'],
> = ResolversObject<{
  accountId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  connected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  livemode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = ResolversObject<{
  _empty?: SubscriptionResolver<
    Maybe<ResolversTypes['String']>,
    '_empty',
    ParentType,
    ContextType
  >;
  aiIdentificationCompleted?: SubscriptionResolver<
    ResolversTypes['AIIdentification'],
    'aiIdentificationCompleted',
    ParentType,
    ContextType,
    Partial<SubscriptionAiIdentificationCompletedArgs>
  >;
  analyticsUpdated?: SubscriptionResolver<
    ResolversTypes['JSON'],
    'analyticsUpdated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionAnalyticsUpdatedArgs, 'type'>
  >;
  blogPostPublished?: SubscriptionResolver<
    ResolversTypes['BlogPost'],
    'blogPostPublished',
    ParentType,
    ContextType
  >;
  blogPostUpdated?: SubscriptionResolver<
    ResolversTypes['BlogPost'],
    'blogPostUpdated',
    ParentType,
    ContextType,
    Partial<SubscriptionBlogPostUpdatedArgs>
  >;
  contactMessageReceived?: SubscriptionResolver<
    ResolversTypes['ContactMessage'],
    'contactMessageReceived',
    ParentType,
    ContextType
  >;
  contactMessageUpdated?: SubscriptionResolver<
    ResolversTypes['ContactMessage'],
    'contactMessageUpdated',
    ParentType,
    ContextType,
    Partial<SubscriptionContactMessageUpdatedArgs>
  >;
  dashboardUpdated?: SubscriptionResolver<
    ResolversTypes['DashboardStats'],
    'dashboardUpdated',
    ParentType,
    ContextType
  >;
  donationReceived?: SubscriptionResolver<
    ResolversTypes['Donation'],
    'donationReceived',
    ParentType,
    ContextType
  >;
  donationStatusChanged?: SubscriptionResolver<
    ResolversTypes['DonationStatusChangeEvent'],
    'donationStatusChanged',
    ParentType,
    ContextType,
    Partial<SubscriptionDonationStatusChangedArgs>
  >;
  emergencyRescueCreated?: SubscriptionResolver<
    ResolversTypes['RescueRequest'],
    'emergencyRescueCreated',
    ParentType,
    ContextType
  >;
  galleryImageUploaded?: SubscriptionResolver<
    ResolversTypes['GalleryImage'],
    'galleryImageUploaded',
    ParentType,
    ContextType
  >;
  identificationFeedbackReceived?: SubscriptionResolver<
    ResolversTypes['IdentificationFeedbackEvent'],
    'identificationFeedbackReceived',
    ParentType,
    ContextType
  >;
  nearbyRescuesUpdated?: SubscriptionResolver<
    ResolversTypes['RescueRequest'],
    'nearbyRescuesUpdated',
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionNearbyRescuesUpdatedArgs,
      'lat' | 'lng' | 'radiusKm'
    >
  >;
  notificationRead?: SubscriptionResolver<
    ResolversTypes['NotificationReadEvent'],
    'notificationRead',
    ParentType,
    ContextType,
    RequireFields<SubscriptionNotificationReadArgs, 'userId'>
  >;
  notificationReceived?: SubscriptionResolver<
    ResolversTypes['Notification'],
    'notificationReceived',
    ParentType,
    ContextType,
    RequireFields<SubscriptionNotificationReceivedArgs, 'userId'>
  >;
  rescueAssigned?: SubscriptionResolver<
    ResolversTypes['RescueAssignmentEvent'],
    'rescueAssigned',
    ParentType,
    ContextType,
    RequireFields<SubscriptionRescueAssignedArgs, 'volunteerId'>
  >;
  rescueCreated?: SubscriptionResolver<
    ResolversTypes['RescueRequest'],
    'rescueCreated',
    ParentType,
    ContextType,
    Partial<SubscriptionRescueCreatedArgs>
  >;
  rescueTimelineUpdated?: SubscriptionResolver<
    ResolversTypes['RescueTimeline'],
    'rescueTimelineUpdated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionRescueTimelineUpdatedArgs, 'rescueId'>
  >;
  rescueUpdated?: SubscriptionResolver<
    ResolversTypes['RescueRequest'],
    'rescueUpdated',
    ParentType,
    ContextType,
    Partial<SubscriptionRescueUpdatedArgs>
  >;
  snakeSpeciesAdded?: SubscriptionResolver<
    ResolversTypes['SnakeSpecies'],
    'snakeSpeciesAdded',
    ParentType,
    ContextType
  >;
  snakeSpeciesUpdated?: SubscriptionResolver<
    ResolversTypes['SnakeSpecies'],
    'snakeSpeciesUpdated',
    ParentType,
    ContextType,
    Partial<SubscriptionSnakeSpeciesUpdatedArgs>
  >;
  trainingCreated?: SubscriptionResolver<
    ResolversTypes['Training'],
    'trainingCreated',
    ParentType,
    ContextType
  >;
  trainingEnrollmentReceived?: SubscriptionResolver<
    ResolversTypes['TrainingEnrollmentEvent'],
    'trainingEnrollmentReceived',
    ParentType,
    ContextType,
    RequireFields<SubscriptionTrainingEnrollmentReceivedArgs, 'trainingId'>
  >;
  trainingUpdated?: SubscriptionResolver<
    ResolversTypes['Training'],
    'trainingUpdated',
    ParentType,
    ContextType,
    Partial<SubscriptionTrainingUpdatedArgs>
  >;
  unreadCountChanged?: SubscriptionResolver<
    ResolversTypes['UnreadCountEvent'],
    'unreadCountChanged',
    ParentType,
    ContextType,
    RequireFields<SubscriptionUnreadCountChangedArgs, 'userId'>
  >;
  userStatusChanged?: SubscriptionResolver<
    ResolversTypes['UserStatusChangeEvent'],
    'userStatusChanged',
    ParentType,
    ContextType
  >;
  userUpdated?: SubscriptionResolver<
    ResolversTypes['User'],
    'userUpdated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionUserUpdatedArgs, 'userId'>
  >;
  volunteerApplicationReceived?: SubscriptionResolver<
    ResolversTypes['Volunteer'],
    'volunteerApplicationReceived',
    ParentType,
    ContextType
  >;
  volunteerAvailabilityChanged?: SubscriptionResolver<
    ResolversTypes['VolunteerAvailabilityEvent'],
    'volunteerAvailabilityChanged',
    ParentType,
    ContextType,
    Partial<SubscriptionVolunteerAvailabilityChangedArgs>
  >;
  volunteerStatusChanged?: SubscriptionResolver<
    ResolversTypes['VolunteerStatusChangeEvent'],
    'volunteerStatusChanged',
    ParentType,
    ContextType,
    Partial<SubscriptionVolunteerStatusChangedArgs>
  >;
}>;

export type SuccessResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['SuccessResponse'] = ResolversParentTypes['SuccessResponse'],
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type TimeSeriesPointResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TimeSeriesPoint'] = ResolversParentTypes['TimeSeriesPoint'],
> = ResolversObject<{
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type TopDonorResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TopDonor'] = ResolversParentTypes['TopDonor'],
> = ResolversObject<{
  anonymous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  donor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  donorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalDonations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TrainingResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Training'] = ResolversParentTypes['Training'],
> = ResolversObject<{
  availableSeats?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  certificate?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instructor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  materials?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  maxParticipants?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  participants?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  registeredCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  scheduledAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TrainingStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TrainingType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  volunteers?: Resolver<
    Array<ResolversTypes['Volunteer']>,
    ParentType,
    ContextType
  >;
}>;

export type TrainingByTypeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrainingByType'] = ResolversParentTypes['TrainingByType'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalParticipants?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TrainingType'], ParentType, ContextType>;
}>;

export type TrainingConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrainingConnection'] = ResolversParentTypes['TrainingConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['TrainingEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TrainingEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrainingEdge'] = ResolversParentTypes['TrainingEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Training'], ParentType, ContextType>;
}>;

export type TrainingEnrollmentEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrainingEnrollmentEvent'] = ResolversParentTypes['TrainingEnrollmentEvent'],
> = ResolversObject<{
  availableSeats?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  enrolledAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  training?: Resolver<ResolversTypes['Training'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type TrainingStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrainingStats'] = ResolversParentTypes['TrainingStats'],
> = ResolversObject<{
  averageAttendance?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  byType?: Resolver<
    Array<ResolversTypes['TrainingByType']>,
    ParentType,
    ContextType
  >;
  completedSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recentSessions?: Resolver<
    Array<ResolversTypes['Training']>,
    ParentType,
    ContextType
  >;
  totalParticipants?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  upcomingSession?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TrendDataResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['TrendData'] = ResolversParentTypes['TrendData'],
> = ResolversObject<{
  change?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  current?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<
    Array<ResolversTypes['TimeSeriesPoint']>,
    ParentType,
    ContextType
  >;
  direction?: Resolver<
    ResolversTypes['TrendDirection'],
    ParentType,
    ContextType
  >;
  previous?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type UnreadCountEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UnreadCountEvent'] = ResolversParentTypes['UnreadCountEvent'],
> = ResolversObject<{
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  unreadCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = ResolversObject<{
  activityLogs?: Resolver<
    Maybe<ResolversTypes['ActivityLogConnection']>,
    ParentType,
    ContextType,
    Partial<UserActivityLogsArgs>
  >;
  aiIdentifications?: Resolver<
    Maybe<ResolversTypes['AIIdentificationConnection']>,
    ParentType,
    ContextType,
    Partial<UserAiIdentificationsArgs>
  >;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blogPosts?: Resolver<
    Maybe<ResolversTypes['BlogPostConnection']>,
    ParentType,
    ContextType,
    Partial<UserBlogPostsArgs>
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  donations?: Resolver<
    Maybe<ResolversTypes['DonationConnection']>,
    ParentType,
    ContextType,
    Partial<UserDonationsArgs>
  >;
  email?: Resolver<ResolversTypes['Email'], ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  galleryImages?: Resolver<
    Maybe<ResolversTypes['GalleryImageConnection']>,
    ParentType,
    ContextType,
    Partial<UserGalleryImagesArgs>
  >;
  googleEmail?: Resolver<
    Maybe<ResolversTypes['Email']>,
    ParentType,
    ContextType
  >;
  googleId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastLoginAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  lastLoginIp?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notificationPreferences?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  notifications?: Resolver<
    Maybe<ResolversTypes['NotificationConnection']>,
    ParentType,
    ContextType,
    Partial<UserNotificationsArgs>
  >;
  phone?: Resolver<Maybe<ResolversTypes['Phone']>, ParentType, ContextType>;
  rescueRequests?: Resolver<
    Maybe<ResolversTypes['RescueRequestConnection']>,
    ParentType,
    ContextType,
    Partial<UserRescueRequestsArgs>
  >;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verifiedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  volunteerProfile?: Resolver<
    Maybe<ResolversTypes['Volunteer']>,
    ParentType,
    ContextType
  >;
}>;

export type UserConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection'],
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type UserProfileResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile'],
> = ResolversObject<{
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  joinedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  totalRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  volunteerProfile?: Resolver<
    Maybe<ResolversTypes['Volunteer']>,
    ParentType,
    ContextType
  >;
}>;

export type UserStatusChangeEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UserStatusChangeEvent'] = ResolversParentTypes['UserStatusChangeEvent'],
> = ResolversObject<{
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  changedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  newStatus?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  oldStatus?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type ValidationErrorResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError'],
> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type VolunteerResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Volunteer'] = ResolversParentTypes['Volunteer'],
> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignedZone?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  availableDays?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  availableTime?: Resolver<
    ResolversTypes['AvailabilityTime'],
    ParentType,
    ContextType
  >;
  averageRescueTime?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  averageResponseTime?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cancelledRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  certificationExpiry?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  certifications?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  completedRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contact?: Resolver<ResolversTypes['Phone'], ParentType, ContextType>;
  coverageRadius?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentLat?: Resolver<
    Maybe<ResolversTypes['Latitude']>,
    ParentType,
    ContextType
  >;
  currentLng?: Resolver<
    Maybe<ResolversTypes['Longitude']>,
    ParentType,
    ContextType
  >;
  dateOfBirth?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  email?: Resolver<Maybe<ResolversTypes['Email']>, ParentType, ContextType>;
  emergencyAvailability?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  emergencyContact?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  emergencyPhone?: Resolver<
    Maybe<ResolversTypes['Phone']>,
    ParentType,
    ContextType
  >;
  equipment?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  experience?: Resolver<
    ResolversTypes['ExperienceLevel'],
    ParentType,
    ContextType
  >;
  experienceYears?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasEquipment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAvailableNow?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  languages?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  lastLocationUpdate?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  rejectedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  rejectedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  rejectionReason?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  rescueAssignments?: Resolver<
    ResolversTypes['RescueRequestConnection'],
    ParentType,
    ContextType,
    Partial<VolunteerRescueAssignmentsArgs>
  >;
  skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['VolunteerStatus'], ParentType, ContextType>;
  successRate?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  totalRatings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRescues?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trainingCompleted?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  trainingDate?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  trainings?: Resolver<
    ResolversTypes['TrainingConnection'],
    ParentType,
    ContextType,
    Partial<VolunteerTrainingsArgs>
  >;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vehicle?: Resolver<ResolversTypes['VehicleType'], ParentType, ContextType>;
  vehicleDetails?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  verifiedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  verifiedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ward?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
}>;

export type VolunteerAnalyticsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerAnalytics'] = ResolversParentTypes['VolunteerAnalytics'],
> = ResolversObject<{
  activeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  averageRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  byExperience?: Resolver<
    Array<ResolversTypes['VolunteerByExperience']>,
    ParentType,
    ContextType
  >;
  byMunicipality?: Resolver<
    Array<ResolversTypes['VolunteerByMunicipality']>,
    ParentType,
    ContextType
  >;
  byStatus?: Resolver<
    Array<ResolversTypes['VolunteerByStatus']>,
    ParentType,
    ContextType
  >;
  timeSeriesData?: Resolver<
    Array<ResolversTypes['TimeSeriesPoint']>,
    ParentType,
    ContextType
  >;
  topPerformers?: Resolver<
    Array<ResolversTypes['VolunteerPerformance']>,
    ParentType,
    ContextType
  >;
  totalVolunteers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type VolunteerAvailabilityEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerAvailabilityEvent'] = ResolversParentTypes['VolunteerAvailabilityEvent'],
> = ResolversObject<{
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentLat?: Resolver<
    Maybe<ResolversTypes['Latitude']>,
    ParentType,
    ContextType
  >;
  currentLng?: Resolver<
    Maybe<ResolversTypes['Longitude']>,
    ParentType,
    ContextType
  >;
  isAvailableNow?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  volunteer?: Resolver<ResolversTypes['Volunteer'], ParentType, ContextType>;
}>;

export type VolunteerByExperienceResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerByExperience'] = ResolversParentTypes['VolunteerByExperience'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  experience?: Resolver<
    ResolversTypes['ExperienceLevel'],
    ParentType,
    ContextType
  >;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type VolunteerByMunicipalityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerByMunicipality'] = ResolversParentTypes['VolunteerByMunicipality'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type VolunteerByStatusResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerByStatus'] = ResolversParentTypes['VolunteerByStatus'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['VolunteerStatus'], ParentType, ContextType>;
}>;

export type VolunteerConnectionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerConnection'] = ResolversParentTypes['VolunteerConnection'],
> = ResolversObject<{
  edges?: Resolver<
    Array<ResolversTypes['VolunteerEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type VolunteerEdgeResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerEdge'] = ResolversParentTypes['VolunteerEdge'],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Volunteer'], ParentType, ContextType>;
}>;

export type VolunteerExperienceStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerExperienceStats'] = ResolversParentTypes['VolunteerExperienceStats'],
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  experience?: Resolver<
    ResolversTypes['ExperienceLevel'],
    ParentType,
    ContextType
  >;
}>;

export type VolunteerMunicipalityStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerMunicipalityStats'] = ResolversParentTypes['VolunteerMunicipalityStats'],
> = ResolversObject<{
  activeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  municipality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type VolunteerPerformanceResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerPerformance'] = ResolversParentTypes['VolunteerPerformance'],
> = ResolversObject<{
  averageResponseTime?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rescuesCompleted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volunteer?: Resolver<ResolversTypes['Volunteer'], ParentType, ContextType>;
}>;

export type VolunteerStatsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerStats'] = ResolversParentTypes['VolunteerStats'],
> = ResolversObject<{
  active?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  byExperience?: Resolver<
    Array<ResolversTypes['VolunteerExperienceStats']>,
    ParentType,
    ContextType
  >;
  byMunicipality?: Resolver<
    Array<ResolversTypes['VolunteerMunicipalityStats']>,
    ParentType,
    ContextType
  >;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  suspended?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  topPerformers?: Resolver<
    Array<ResolversTypes['VolunteerPerformance']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type VolunteerStatusChangeEventResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['VolunteerStatusChangeEvent'] = ResolversParentTypes['VolunteerStatusChangeEvent'],
> = ResolversObject<{
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  changedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  newStatus?: Resolver<
    ResolversTypes['VolunteerStatus'],
    ParentType,
    ContextType
  >;
  oldStatus?: Resolver<
    ResolversTypes['VolunteerStatus'],
    ParentType,
    ContextType
  >;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  volunteer?: Resolver<ResolversTypes['Volunteer'], ParentType, ContextType>;
  volunteerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AIIdentification?: AiIdentificationResolvers<ContextType>;
  AIIdentificationConnection?: AiIdentificationConnectionResolvers<ContextType>;
  AIIdentificationEdge?: AiIdentificationEdgeResolvers<ContextType>;
  AIIdentificationStats?: AiIdentificationStatsResolvers<ContextType>;
  AIModelConfig?: AiModelConfigResolvers<ContextType>;
  ActivityLog?: ActivityLogResolvers<ContextType>;
  ActivityLogConnection?: ActivityLogConnectionResolvers<ContextType>;
  AlternativeMatch?: AlternativeMatchResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  AvailableVolunteer?: AvailableVolunteerResolvers<ContextType>;
  BlogPost?: BlogPostResolvers<ContextType>;
  BlogPostConnection?: BlogPostConnectionResolvers<ContextType>;
  BlogPostEdge?: BlogPostEdgeResolvers<ContextType>;
  BulkOperationResult?: BulkOperationResultResolvers<ContextType>;
  CMSStats?: CmsStatsResolvers<ContextType>;
  ContactMessage?: ContactMessageResolvers<ContextType>;
  ContactMessageConnection?: ContactMessageConnectionResolvers<ContextType>;
  ContactMessageEdge?: ContactMessageEdgeResolvers<ContextType>;
  ContactMessageStats?: ContactMessageStatsResolvers<ContextType>;
  DashboardStats?: DashboardStatsResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Donation?: DonationResolvers<ContextType>;
  DonationByMethod?: DonationByMethodResolvers<ContextType>;
  DonationByPurpose?: DonationByPurposeResolvers<ContextType>;
  DonationConnection?: DonationConnectionResolvers<ContextType>;
  DonationEdge?: DonationEdgeResolvers<ContextType>;
  DonationStats?: DonationStatsResolvers<ContextType>;
  DonationStatusChangeEvent?: DonationStatusChangeEventResolvers<ContextType>;
  Email?: GraphQLScalarType;
  EmailVerificationPayload?: EmailVerificationPayloadResolvers<ContextType>;
  EngagementMetrics?: EngagementMetricsResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  GalleryImage?: GalleryImageResolvers<ContextType>;
  GalleryImageConnection?: GalleryImageConnectionResolvers<ContextType>;
  GalleryImageEdge?: GalleryImageEdgeResolvers<ContextType>;
  GeographicHeatmap?: GeographicHeatmapResolvers<ContextType>;
  IdentificationByProvider?: IdentificationByProviderResolvers<ContextType>;
  IdentificationFeedbackEvent?: IdentificationFeedbackEventResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MessageByCategory?: MessageByCategoryResolvers<ContextType>;
  MessageByPriority?: MessageByPriorityResolvers<ContextType>;
  MonthlyDonationData?: MonthlyDonationDataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  NearbyRescue?: NearbyRescueResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationByPriority?: NotificationByPriorityResolvers<ContextType>;
  NotificationByType?: NotificationByTypeResolvers<ContextType>;
  NotificationConnection?: NotificationConnectionResolvers<ContextType>;
  NotificationDeliveryStats?: NotificationDeliveryStatsResolvers<ContextType>;
  NotificationEdge?: NotificationEdgeResolvers<ContextType>;
  NotificationPreferences?: NotificationPreferencesResolvers<ContextType>;
  NotificationReadEvent?: NotificationReadEventResolvers<ContextType>;
  NotificationStats?: NotificationStatsResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageView?: PageViewResolvers<ContextType>;
  PasswordResetTokenPayload?: PasswordResetTokenPayloadResolvers<ContextType>;
  PaymentGatewayConfig?: PaymentGatewayConfigResolvers<ContextType>;
  Phone?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RescueActivityPoint?: RescueActivityPointResolvers<ContextType>;
  RescueAnalytics?: RescueAnalyticsResolvers<ContextType>;
  RescueAssignmentEvent?: RescueAssignmentEventResolvers<ContextType>;
  RescueByMunicipality?: RescueByMunicipalityResolvers<ContextType>;
  RescueByPriority?: RescueByPriorityResolvers<ContextType>;
  RescueBySpecies?: RescueBySpeciesResolvers<ContextType>;
  RescueByStatus?: RescueByStatusResolvers<ContextType>;
  RescueByTimeOfDay?: RescueByTimeOfDayResolvers<ContextType>;
  RescueMunicipalityStats?: RescueMunicipalityStatsResolvers<ContextType>;
  RescuePriorityStats?: RescuePriorityStatsResolvers<ContextType>;
  RescueRequest?: RescueRequestResolvers<ContextType>;
  RescueRequestConnection?: RescueRequestConnectionResolvers<ContextType>;
  RescueRequestEdge?: RescueRequestEdgeResolvers<ContextType>;
  RescueSpeciesStats?: RescueSpeciesStatsResolvers<ContextType>;
  RescueStats?: RescueStatsResolvers<ContextType>;
  RescueTimeline?: RescueTimelineResolvers<ContextType>;
  ResponseTimeAnalysis?: ResponseTimeAnalysisResolvers<ContextType>;
  ResponseTimeByPriority?: ResponseTimeByPriorityResolvers<ContextType>;
  SnakeSpecies?: SnakeSpeciesResolvers<ContextType>;
  SnakeSpeciesConnection?: SnakeSpeciesConnectionResolvers<ContextType>;
  SnakeSpeciesEdge?: SnakeSpeciesEdgeResolvers<ContextType>;
  SnakeSpeciesStats?: SnakeSpeciesStatsResolvers<ContextType>;
  SpeciesByDangerLevel?: SpeciesByDangerLevelResolvers<ContextType>;
  SpeciesByFamily?: SpeciesByFamilyResolvers<ContextType>;
  SpeciesIdentificationCount?: SpeciesIdentificationCountResolvers<ContextType>;
  StripeConnectionStatus?: StripeConnectionStatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SuccessResponse?: SuccessResponseResolvers<ContextType>;
  TimeSeriesPoint?: TimeSeriesPointResolvers<ContextType>;
  TopDonor?: TopDonorResolvers<ContextType>;
  Training?: TrainingResolvers<ContextType>;
  TrainingByType?: TrainingByTypeResolvers<ContextType>;
  TrainingConnection?: TrainingConnectionResolvers<ContextType>;
  TrainingEdge?: TrainingEdgeResolvers<ContextType>;
  TrainingEnrollmentEvent?: TrainingEnrollmentEventResolvers<ContextType>;
  TrainingStats?: TrainingStatsResolvers<ContextType>;
  TrendData?: TrendDataResolvers<ContextType>;
  UnreadCountEvent?: UnreadCountEventResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  UserStatusChangeEvent?: UserStatusChangeEventResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
  Volunteer?: VolunteerResolvers<ContextType>;
  VolunteerAnalytics?: VolunteerAnalyticsResolvers<ContextType>;
  VolunteerAvailabilityEvent?: VolunteerAvailabilityEventResolvers<ContextType>;
  VolunteerByExperience?: VolunteerByExperienceResolvers<ContextType>;
  VolunteerByMunicipality?: VolunteerByMunicipalityResolvers<ContextType>;
  VolunteerByStatus?: VolunteerByStatusResolvers<ContextType>;
  VolunteerConnection?: VolunteerConnectionResolvers<ContextType>;
  VolunteerEdge?: VolunteerEdgeResolvers<ContextType>;
  VolunteerExperienceStats?: VolunteerExperienceStatsResolvers<ContextType>;
  VolunteerMunicipalityStats?: VolunteerMunicipalityStatsResolvers<ContextType>;
  VolunteerPerformance?: VolunteerPerformanceResolvers<ContextType>;
  VolunteerStats?: VolunteerStatsResolvers<ContextType>;
  VolunteerStatusChangeEvent?: VolunteerStatusChangeEventResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  rateLimit?: RateLimitDirectiveResolver<any, any, ContextType>;
}>;
