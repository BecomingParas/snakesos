// ===================================================================
// PAYMENT - MODULE EXPORTS
// ===================================================================



export const paymentEnums = `# ===================================================================
# PAYMENT - ENUMS
# ===================================================================

"""
Payment method
"""
enum PaymentMethod {
  ESEWA
  KHALTI
  IME_PAY
  FONEPAY
  BANK_TRANSFER
  STRIPE
  PAYPAL
  CASH
}

"""
Payment status
"""
enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

"""
Donation purpose
"""
enum DonationPurpose {
  GENERAL
  EMERGENCY_FUND
  EQUIPMENT
  TRAINING
  MEDICAL
  RESEARCH
  EDUCATION
  INFRASTRUCTURE
}
`;
export const paymentSchema = `# ===================================================================
# PAYMENT - TYPE DEFINITIONS
# ===================================================================

"""
Stripe connection status for development testing
"""
type StripeConnectionStatus {
  """Whether Stripe is successfully connected"""
  connected: Boolean!
  
  """Stripe mode: test, live, or unknown"""
  mode: String!
  
  """Stripe account ID (if connected)"""
  accountId: String
  
  """Whether Stripe is in live mode"""
  livemode: Boolean!
  
  """Human-readable status message"""
  message: String!
}

"""
Donation transaction
"""
type Donation {
  id: ID!
  
  # Donor Information
  donor: User
  donorName: String!
  donorEmail: Email
  donorPhone: Phone
  
  # Amount
  amount: Float!
  currency: String!
  amountUSD: Float
  
  # Payment Details
  paymentMethod: PaymentMethod!
  paymentGateway: String!
  transactionId: String
  gatewayResponse: JSON
  
  # Status
  status: PaymentStatus!
  paidAt: DateTime
  
  # Purpose
  purpose: DonationPurpose
  campaign: String
  message: String
  anonymous: Boolean!
  
  # Receipt
  receiptNumber: String
  receiptUrl: String
  invoiceUrl: String
  
  # Verification
  verifiedAt: DateTime
  verifiedBy: User
  verificationNotes: String
  
  # Refund
  refundedAt: DateTime
  refundReason: String
  refundAmount: Float
  
  # Metadata
  ipAddress: String
  userAgent: String
  source: String!
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

type PaymentIntent {
  id: ID!
  rescueChargeId: ID
  donationId: ID
  provider: String!
  amount: String!
  currency: String!
  status: PaymentIntentStatus!
  providerReference: String
  idempotencyKey: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type PaymentIntentCheckout {
  paymentIntent: PaymentIntent!
  providerReference: String!
  checkoutUrl: String
}

type Settlement {
  id: ID!
  rescueChargeId: ID
  rescuerId: ID!
  rescuer: Volunteer
  rescuerName: String!
  citizenName: String!
  grossAmount: String!
  commissionRate: String!
  commissionAmount: String!
  rescuerAmount: String!
  amount: String!
  currency: String!
  status: SettlementStatus!
  eligibleAt: DateTime
  settledAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Payout {
  id: ID!
  settlementId: ID!
  rescuerId: ID!
  rescuerName: String!
  citizenName: String!
  amount: String!
  currency: String!
  status: PayoutStatus!
  paymentMethod: String
  externalReference: String
  requestedAt: DateTime!
  processedAt: DateTime
  failedAt: DateTime
  failureReason: String
}

type Refund {
  id: ID!
  transactionId: ID!
  amount: String!
  currency: String!
  reason: String
  providerReference: String
  status: PaymentStatus!
  createdAt: DateTime!
  processedAt: DateTime
}

enum SettlementStatus {
  PENDING
  ELIGIBLE
  PROCESSING
  SETTLED
  FAILED
  CANCELLED
}

enum PayoutStatus {
  PENDING
  APPROVED
  PROCESSING
  PAID
  FAILED
  REJECTED
  CANCELLED
}

enum PaymentIntentStatus {
  CREATED
  REQUIRES_ACTION
  AUTHORIZED
  SUCCEEDED
  FAILED
  CANCELLED
}

"""
Donation statistics
"""
type DonationStats {
  totalDonations: Int!
  totalAmount: Float!
  totalAmountUSD: Float!
  averageDonation: Float!
  byMethod: [DonationByMethod!]!
  byPurpose: [DonationByPurpose!]!
  topDonors: [TopDonor!]!
  recentDonations: [Donation!]!
  monthlyTrend: [MonthlyDonationData!]!
}

"""
Donation count by payment method
"""
type DonationByMethod {
  method: PaymentMethod!
  count: Int!
  totalAmount: Float!
}

"""
Donation count by purpose
"""
type DonationByPurpose {
  purpose: DonationPurpose!
  count: Int!
  totalAmount: Float!
}

"""
Top donor information
"""
type TopDonor {
  donor: User
  donorName: String!
  totalDonations: Int!
  totalAmount: Float!
  anonymous: Boolean!
}

"""
Monthly donation trend data
"""
type MonthlyDonationData {
  month: String!
  year: Int!
  count: Int!
  amount: Float!
}

"""
Payment gateway configuration
"""
type PaymentGatewayConfig {
  method: PaymentMethod!
  enabled: Boolean!
  displayName: String!
  description: String
  minAmount: Float
  maxAmount: Float
  currencies: [String!]!
  testMode: Boolean!
}
`;
export const paymentInputs = `# ===================================================================
# PAYMENT - INPUT TYPES
# ===================================================================

"""
Input for creating a donation
"""
input CreateDonationInput {
  donorName: String!
  donorEmail: Email
  donorPhone: Phone
  amount: Float!
  currency: String
  paymentMethod: PaymentMethod!
  purpose: DonationPurpose
  campaign: String
  message: String
  anonymous: Boolean
}

"""
Input for processing payment
"""
input ProcessPaymentInput {
  donationId: ID!
  transactionId: String!
  gatewayResponse: JSON
}

enum PaymentProvider {
  ESEWA
  KHALTI
  STRIPE
}

input CreatePaymentIntentInput {
  rescueChargeId: ID
  donationId: ID
  provider: PaymentProvider!
  amount: String!
  currency: String
  idempotencyKey: String!
}

input InitiatePaymentInput {
  rescueChargeId: ID
  donationId: ID
  provider: PaymentProvider!
  amount: String!
  currency: String
  idempotencyKey: String!
  returnUrl: String
}

input ConfirmPaymentInput {
  paymentIntentId: ID
  providerReference: String!
}

input CreatePayoutInput {
  settlementId: ID!
  paymentMethod: String
  idempotencyKey: String!
}

input TransitionPayoutInput {
  payoutId: ID!
  status: PayoutStatus!
  externalReference: String
  failureReason: String
}

input RefundPaymentInput {
  paymentIntentId: ID!
  amount: String!
  idempotencyKey: String!
}

input StartPaymentInput {
  paymentIntentId: ID!
  amount: String
  returnUrl: String
}

"""
Input for refunding donation
"""
input RefundDonationInput {
  donationId: ID!
  reason: String!
  amount: Float
}

"""
Filter input for donation queries
"""
input DonationFilterInput {
  status: PaymentStatus
  statuses: [PaymentStatus!]
  paymentMethod: PaymentMethod
  methods: [PaymentMethod!]
  purpose: DonationPurpose
  purposes: [DonationPurpose!]
  donorId: ID
  anonymous: Boolean
  minAmount: Float
  maxAmount: Float
  createdAfter: DateTime
  createdBefore: DateTime
  verified: Boolean
}

"""
Sort input for donation queries
"""
input DonationSortInput {
  field: DonationSortField!
  order: SortOrder!
}

"""
Fields available for sorting donations
"""
enum DonationSortField {
  CREATED_AT
  AMOUNT
  PAID_AT
  DONOR_NAME
}

"""
Input for donation statistics
"""
input DonationStatsInput {
  startDate: DateTime
  endDate: DateTime
  purpose: DonationPurpose
  paymentMethod: PaymentMethod
}

"""
Input for updating payment gateway config
"""
input UpdatePaymentGatewayInput {
  method: PaymentMethod!
  enabled: Boolean
  displayName: String
  description: String
  minAmount: Float
  maxAmount: Float
  currencies: [String!]
  testMode: Boolean
}
`;
export const paymentQueries = `# ===================================================================
# PAYMENT - QUERIES
# ===================================================================

extend type Query {
  paymentIntent(id: ID!): PaymentIntent @auth(requires: [ADMIN, SUPER_ADMIN])
  settlement(id: ID!): Settlement @auth(requires: [ADMIN, SUPER_ADMIN])
  payout(id: ID!): Payout @auth(requires: [ADMIN, SUPER_ADMIN])
  settlements(status: SettlementStatus): [Settlement!]! @auth(requires: [ADMIN, SUPER_ADMIN])
  payouts(status: PayoutStatus): [Payout!]! @auth(requires: [ADMIN, SUPER_ADMIN])
  mySettlements(pagination: PaginationInput): SettlementConnection! @auth
  myPayouts(pagination: PaginationInput): PayoutConnection! @auth
  myRescuePaymentIntent(rescueId: ID!): PaymentIntent @auth
  assignedRescuePaymentIntent(rescueId: ID!): PaymentIntent @auth(requires: [VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR])

  """
  Check Stripe connection status (DEVELOPMENT ONLY)
  This query is only available in non-production environments
  """
  stripeConnectionStatus: StripeConnectionStatus!
  
  """
  Get donation by ID
  """
  donation(id: ID!): Donation @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  List donations
  """
  donations(
    pagination: PaginationInput
    filter: DonationFilterInput
    sort: DonationSortInput
  ): DonationConnection! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get my donations
  """
  myDonations(
    pagination: PaginationInput
  ): DonationConnection! @auth
  
  """
  Get donation statistics
  """
  donationStats(input: DonationStatsInput): DonationStats! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get available payment gateways
  """
  availablePaymentGateways: [PaymentGatewayConfig!]!
  
  """
  Get payment gateway configuration
  """
  paymentGatewayConfig(method: PaymentMethod!): PaymentGatewayConfig @auth(requires: [ADMIN, SUPER_ADMIN])
}

type SettlementConnection {
  edges: [SettlementEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type SettlementEdge {
  node: Settlement!
  cursor: String!
}

type PayoutConnection {
  edges: [PayoutEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PayoutEdge {
  node: Payout!
  cursor: String!
}

"""
Connection type for paginated donation results
"""
type DonationConnection {
  edges: [DonationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for donation connection
"""
type DonationEdge {
  node: Donation!
  cursor: String!
}
`;
export const paymentMutations = `# ===================================================================
# PAYMENT - MUTATIONS
# ===================================================================

extend type Mutation {
  startPayment(input: StartPaymentInput!): PaymentIntentCheckout! @auth
  refundPayment(input: RefundPaymentInput!): Refund! @auth(requires: [ADMIN, SUPER_ADMIN])
  createPayout(input: CreatePayoutInput!): Payout! @auth
  transitionPayout(input: TransitionPayoutInput!): Payout! @auth(requires: [ADMIN, SUPER_ADMIN])

  createPaymentIntent(input: CreatePaymentIntentInput!): PaymentIntent! @auth
  initiatePayment(input: InitiatePaymentInput!): PaymentIntentCheckout! @auth
  confirmPayment(input: ConfirmPaymentInput!): PaymentIntent! @auth

  """
  Create a donation
  """
  createDonation(input: CreateDonationInput!): Donation!
  
  """
  Process payment (callback from gateway)
  """
  processPayment(input: ProcessPaymentInput!): Donation!
  
  """
  Verify donation (admin)
  """
  verifyDonation(donationId: ID!, notes: String): Donation! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Refund donation (admin)
  """
  refundDonation(input: RefundDonationInput!): Donation! @auth(requires: [SUPER_ADMIN])
  
  """
  Generate donation receipt
  """
  generateDonationReceipt(donationId: ID!): Donation! @auth
  
  """
  Update payment gateway configuration
  """
  updatePaymentGateway(input: UpdatePaymentGatewayInput!): PaymentGatewayConfig! @auth(requires: [SUPER_ADMIN])
}
`;
export const paymentSubscriptions = `# ===================================================================
# PAYMENT - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new donations
  """
  donationReceived: Donation! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Subscribe to donation status changes
  """
  donationStatusChanged(donationId: ID): DonationStatusChangeEvent! @auth
}

"""
Donation status change event
"""
type DonationStatusChangeEvent {
  donation: Donation!
  oldStatus: PaymentStatus!
  newStatus: PaymentStatus!
  changedAt: DateTime!
}
`;
export const paymentFragments = `# ===================================================================
# PAYMENT - REUSABLE FRAGMENTS
# ===================================================================

"""
Core donation fields
"""
fragment DonationCore on Donation {
  id
  donorName
  amount
  currency
  paymentMethod
  status
  anonymous
  createdAt
}

"""
Donation with payment details
"""
fragment DonationWithPayment on Donation {
  ...DonationCore
  transactionId
  paymentGateway
  paidAt
  receiptNumber
}

"""
Full donation details
"""
fragment DonationFull on Donation {
  ...DonationWithPayment
  donor {
    id
    name
    email
  }
  donorEmail
  donorPhone
  amountUSD
  gatewayResponse
  purpose
  campaign
  message
  receiptUrl
  invoiceUrl
  verifiedAt
  verifiedBy {
    id
    name
  }
  verificationNotes
  refundedAt
  refundReason
  refundAmount
  source
  updatedAt
}

"""
Donation list item
"""
fragment DonationListItem on Donation {
  ...DonationCore
  purpose
  paidAt
}

"""
Payment gateway config
"""
fragment PaymentGatewayConfigFields on PaymentGatewayConfig {
  method
  enabled
  displayName
  description
  minAmount
  maxAmount
  currencies
  testMode
}
`;

// Combine all payment type definitions
export const paymentTypeDefs = [
  paymentEnums,
  paymentSchema,
  paymentInputs,
  paymentQueries,
  paymentMutations,
  paymentSubscriptions,
  paymentFragments,
].join('\n\n');

// Export operations for code generation
export const paymentOperations = {
  queries: paymentQueries,
  mutations: paymentMutations,
  subscriptions: paymentSubscriptions,
};

// Export fragments for reuse
export const paymentFragmentDefinitions = paymentFragments;
