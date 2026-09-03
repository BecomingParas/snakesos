

export const mediaTypeDefs = [
  `enum MediaType {
  RESCUER_PROFILE_IMAGE
  CITIZEN_PROFILE_IMAGE
  ADMIN_PROFILE_IMAGE
  RESCUER_VERIFICATION_DOCUMENT
  RESCUER_PROFILE_VIDEO
  GALLERY_IMAGE
  GALLERY_VIDEO
}

enum MediaStatus {
  PENDING
  UPLOADED
  VERIFIED
  REJECTED
  DELETED
}
`,
  `type MediaAsset {
  id: ID!
  mediaType: MediaType!
  provider: String!
  publicId: String!
  resourceType: String!
  originalFileName: String
  mimeType: String!
  sizeBytes: Int
  width: Int
  height: Int
  format: String
  status: MediaStatus!
  secureUrl: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type MediaUploadSignature {
  mediaId: ID!
  cloudName: String!
  apiKey: String!
  timestamp: Int!
  signature: String!
  folder: String!
  publicId: String!
  uploadUrl: String!
  resourceType: String!
}
`,
  `input CreateMediaUploadSignatureInput {
  mediaType: MediaType!
  fileName: String!
  mimeType: String!
  sizeBytes: Int!
}
`,
  `extend type Query {
  getSecureMediaUrl(mediaId: ID!): String! @auth
}
`,
  `extend type Mutation {
  createMediaUploadSignature(input: CreateMediaUploadSignatureInput!): MediaUploadSignature! @auth
  confirmMediaUpload(mediaId: ID!): MediaAsset! @auth
}
`,
].join('\n\n');
