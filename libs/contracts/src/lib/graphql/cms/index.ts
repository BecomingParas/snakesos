// ===================================================================
// CMS - MODULE EXPORTS
// ===================================================================



export const cmsEnums = `# ===================================================================
# CMS - ENUMS
# ===================================================================

"""
Status of blog post
"""
enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  SCHEDULED
}

"""
Category of blog post
"""
enum PostCategory {
  NEWS
  EDUCATION
  RESEARCH
  SUCCESS_STORY
  ANNOUNCEMENT
  GUIDE
  EVENT
}

"""
Category of gallery image
"""
enum GalleryCategory {
  RESCUE
  SPECIES
  TRAINING
  EVENT
  VOLUNTEER
  EDUCATION
  HABITAT
}
`;
export const cmsSchema = `# ===================================================================
# CMS - TYPE DEFINITIONS
# ===================================================================

"""
Blog post
"""
type BlogPost {
  id: ID!
  
  # Content
  title: String!
  slug: String!
  content: String!
  excerpt: String
  
  # Categorization
  category: PostCategory!
  tags: [String!]!
  
  # Author
  author: User!
  
  # Publishing
  status: PostStatus!
  publishedAt: DateTime
  scheduledAt: DateTime
  
  # Media
  imageUrl: String
  images: [String!]!
  videoUrl: String
  
  # SEO
  metaTitle: String
  metaDescription: String
  metaKeywords: [String!]!
  
  # Engagement
  views: Int!
  likes: Int!
  shares: Int!
  
  # Comments
  commentsEnabled: Boolean!
  commentCount: Int!
  
  # Metadata
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
Gallery image
"""
type GalleryImage {
  id: ID!
  
  # Content
  title: String
  description: String
  imageUrl: String
  videoUrl: String
  thumbnailUrl: String
  
  # Categorization
  category: GalleryCategory
  tags: [String!]!
  
  # Context
  rescueId: ID
  rescue: RescueRequest
  speciesId: ID
  species: SnakeSpecies
  
  # Uploader
  uploader: User
  
  # Visibility
  isPublic: Boolean!
  isFeatured: Boolean!
  
  # Engagement
  views: Int!
  likes: Int!
  
  # Metadata
  fileSize: Int
  dimensions: String
  format: String
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
CMS statistics
"""
type CMSStats {
  totalPosts: Int!
  publishedPosts: Int!
  draftPosts: Int!
  totalImages: Int!
  publicImages: Int!
  totalViews: Int!
  totalLikes: Int!
  popularPosts: [BlogPost!]!
  recentPosts: [BlogPost!]!
  featuredImages: [GalleryImage!]!
}
`;
export const cmsInputs = `# ===================================================================
# CMS - INPUT TYPES
# ===================================================================

"""
Input for creating a blog post
"""
input CreateBlogPostInput {
  title: String!
  slug: String!
  content: String!
  excerpt: String
  category: PostCategory!
  tags: [String!]
  imageUrl: String
  images: [String!]
  videoUrl: String
  metaTitle: String
  metaDescription: String
  metaKeywords: [String!]
  status: PostStatus
  scheduledAt: DateTime
  commentsEnabled: Boolean
}

"""
Input for updating a blog post
"""
input UpdateBlogPostInput {
  title: String
  slug: String
  content: String
  excerpt: String
  category: PostCategory
  tags: [String!]
  imageUrl: String
  images: [String!]
  videoUrl: String
  metaTitle: String
  metaDescription: String
  metaKeywords: [String!]
  status: PostStatus
  scheduledAt: DateTime
  commentsEnabled: Boolean
}

"""
Input for uploading gallery media
"""
input UploadGalleryImageInput {
  title: String
  description: String
  imageUrl: String
  videoUrl: String
  thumbnailUrl: String
  category: GalleryCategory
  tags: [String!]
  rescueId: ID
  speciesId: ID
  isPublic: Boolean
  isFeatured: Boolean
}

"""
Input for updating gallery media
"""
input UpdateGalleryImageInput {
  title: String
  description: String
  imageUrl: String
  videoUrl: String
  category: GalleryCategory
  tags: [String!]
  isPublic: Boolean
  isFeatured: Boolean
}

"""
Filter input for blog post queries
"""
input BlogPostFilterInput {
  status: PostStatus
  statuses: [PostStatus!]
  category: PostCategory
  categories: [PostCategory!]
  authorId: ID
  tags: [String!]
  search: String
  publishedAfter: DateTime
  publishedBefore: DateTime
}

"""
Sort input for blog post queries
"""
input BlogPostSortInput {
  field: BlogPostSortField!
  order: SortOrder!
}

"""
Fields available for sorting blog posts
"""
enum BlogPostSortField {
  CREATED_AT
  PUBLISHED_AT
  UPDATED_AT
  VIEWS
  LIKES
  TITLE
}

"""
Filter input for gallery image queries
"""
input GalleryImageFilterInput {
  category: GalleryCategory
  categories: [GalleryCategory!]
  tags: [String!]
  isPublic: Boolean
  isFeatured: Boolean
  uploaderId: ID
  rescueId: ID
  speciesId: ID
  search: String
}

"""
Sort input for gallery image queries
"""
input GalleryImageSortInput {
  field: GalleryImageSortField!
  order: SortOrder!
}

"""
Fields available for sorting gallery images
"""
enum GalleryImageSortField {
  CREATED_AT
  VIEWS
  LIKES
  TITLE
}
`;
export const cmsQueries = `# ===================================================================
# CMS - QUERIES
# ===================================================================

extend type Query {
  """
  Get blog post by ID or slug
  """
  blogPost(id: ID, slug: String): BlogPost
  
  """
  List blog posts
  """
  blogPosts(
    pagination: PaginationInput
    filter: BlogPostFilterInput
    sort: BlogPostSortInput
  ): BlogPostConnection!
  
  """
  Get published blog posts (public)
  """
  publishedBlogPosts(
    pagination: PaginationInput
    category: PostCategory
  ): BlogPostConnection!
  
  """
  Search blog posts
  """
  searchBlogPosts(
    query: String!
    pagination: PaginationInput
  ): BlogPostConnection!
  
  """
  Get gallery image by ID
  """
  galleryImage(id: ID!): GalleryImage
  
  """
  List gallery images
  """
  galleryImages(
    pagination: PaginationInput
    filter: GalleryImageFilterInput
    sort: GalleryImageSortInput
  ): GalleryImageConnection!
  
  """
  Get featured gallery images (public)
  """
  featuredGalleryImages(
    pagination: PaginationInput
  ): GalleryImageConnection!
  
  """
  Get CMS statistics
  """
  cmsStats: CMSStats! @auth(requires: [ADMIN, SUPER_ADMIN])
}

"""
Connection type for paginated blog post results
"""
type BlogPostConnection {
  edges: [BlogPostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for blog post connection
"""
type BlogPostEdge {
  node: BlogPost!
  cursor: String!
}

"""
Connection type for paginated gallery image results
"""
type GalleryImageConnection {
  edges: [GalleryImageEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for gallery image connection
"""
type GalleryImageEdge {
  node: GalleryImage!
  cursor: String!
}
`;
export const cmsMutations = `# ===================================================================
# CMS - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Create a blog post
  """
  createBlogPost(input: CreateBlogPostInput!): BlogPost! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Update a blog post
  """
  updateBlogPost(id: ID!, input: UpdateBlogPostInput!): BlogPost! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Publish a blog post
  """
  publishBlogPost(id: ID!): BlogPost! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Archive a blog post
  """
  archiveBlogPost(id: ID!): BlogPost! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete a blog post (soft delete)
  """
  deleteBlogPost(id: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
  
  """
  Increment blog post views
  """
  incrementBlogPostViews(id: ID!): BlogPost!
  
  """
  Like a blog post
  """
  likeBlogPost(id: ID!): BlogPost! @auth
  
  """
  Upload gallery image
  """
  uploadGalleryImage(input: UploadGalleryImageInput!): GalleryImage! @auth(requires: [ADMIN, SUPER_ADMIN, VERIFIED_RESCUER])
  
  """
  Update gallery image
  """
  updateGalleryImage(id: ID!, input: UpdateGalleryImageInput!): GalleryImage! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete gallery image (soft delete)
  """
  deleteGalleryImage(id: ID!): SuccessResponse! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Increment gallery image views
  """
  incrementGalleryImageViews(id: ID!): GalleryImage!
  
  """
  Like a gallery image
  """
  likeGalleryImage(id: ID!): GalleryImage! @auth
  
  """
  Bulk publish blog posts
  """
  bulkPublishBlogPosts(ids: [ID!]!): BulkOperationResult! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Bulk delete gallery images
  """
  bulkDeleteGalleryImages(ids: [ID!]!): BulkOperationResult! @auth(requires: [SUPER_ADMIN])
}
`;
export const cmsSubscriptions = `# ===================================================================
# CMS - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new blog post publications
  """
  blogPostPublished: BlogPost!
  
  """
  Subscribe to blog post updates
  """
  blogPostUpdated(id: ID): BlogPost! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Subscribe to new gallery image uploads
  """
  galleryImageUploaded: GalleryImage! @auth(requires: [ADMIN, SUPER_ADMIN])
}
`;
export const cmsFragments = `# ===================================================================
# CMS - REUSABLE FRAGMENTS
# ===================================================================

"""
Core blog post fields
"""
fragment BlogPostCore on BlogPost {
  id
  title
  slug
  excerpt
  category
  status
  imageUrl
  publishedAt
  createdAt
}

"""
Blog post with author
"""
fragment BlogPostWithAuthor on BlogPost {
  ...BlogPostCore
  author {
    id
    name
    avatar
  }
  tags
  views
  likes
}

"""
Full blog post details
"""
fragment BlogPostFull on BlogPost {
  ...BlogPostWithAuthor
  content
  images
  videoUrl
  metaTitle
  metaDescription
  metaKeywords
  scheduledAt
  commentsEnabled
  commentCount
  shares
  updatedAt
}

"""
Blog post list item
"""
fragment BlogPostListItem on BlogPost {
  ...BlogPostCore
  author {
    id
    name
  }
  tags
  views
}

"""
Core gallery image fields
"""
fragment GalleryImageCore on GalleryImage {
  id
  title
  imageUrl
  thumbnailUrl
  category
  isPublic
  isFeatured
  createdAt
}

"""
Gallery image with context
"""
fragment GalleryImageWithContext on GalleryImage {
  ...GalleryImageCore
  description
  tags
  rescue {
    id
    referenceNumber
  }
  species {
    id
    name
    scientificName
  }
}

"""
Full gallery image details
"""
fragment GalleryImageFull on GalleryImage {
  ...GalleryImageWithContext
  uploader {
    id
    name
    avatar
  }
  views
  likes
  fileSize
  dimensions
  format
  updatedAt
}

"""
Gallery image list item
"""
fragment GalleryImageListItem on GalleryImage {
  ...GalleryImageCore
  views
  likes
}
`;

// Combine all CMS type definitions
export const cmsTypeDefs = [
  cmsEnums,
  cmsSchema,
  cmsInputs,
  cmsQueries,
  cmsMutations,
  cmsSubscriptions,
  cmsFragments,
].join('\n\n');

// Export operations for code generation
export const cmsOperations = {
  queries: cmsQueries,
  mutations: cmsMutations,
  subscriptions: cmsSubscriptions,
};

// Export fragments for reuse
export const cmsFragmentDefinitions = cmsFragments;
