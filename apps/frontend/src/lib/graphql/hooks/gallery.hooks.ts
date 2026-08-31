import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import type { MutationHookOptions, QueryHookOptions } from '@/lib/apollo/hooks';

export type GalleryCategory =
  | 'RESCUE'
  | 'SPECIES'
  | 'TRAINING'
  | 'EVENT'
  | 'VOLUNTEER'
  | 'EDUCATION'
  | 'HABITAT';

export interface GalleryImage {
  id: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  category?: GalleryCategory | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface GalleryImageConnection {
  edges: Array<{ node: GalleryImage; cursor: string }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
}

export interface GalleryImagesQueryData {
  galleryImages?: GalleryImageConnection | null;
}

export interface GalleryImageQueryData {
  galleryImage?: GalleryImage | null;
}

const GALLERY_IMAGES = gql`
  query GalleryImages(
    $pagination: PaginationInput
    $filter: GalleryImageFilterInput
  ) {
    galleryImages(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          title
          description
          imageUrl
          videoUrl
          thumbnailUrl
          category
          isPublic
          isFeatured
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

const GALLERY_IMAGE = gql`
  query GalleryImage($id: ID!) {
    galleryImage(id: $id) {
      id
      title
      description
      imageUrl
      videoUrl
      thumbnailUrl
      category
      isPublic
      isFeatured
      createdAt
    }
  }
`;

export function useGalleryImagesQuery(
  options?: QueryHookOptions<GalleryImagesQueryData, any>,
) {
  return useQuery<GalleryImagesQueryData, any>(GALLERY_IMAGES, options);
}

export function useGalleryImageQuery(
  options?: QueryHookOptions<GalleryImageQueryData, { id: string }>,
) {
  return useQuery<GalleryImageQueryData, { id: string }>(GALLERY_IMAGE, options);
}

const UPLOAD_GALLERY_IMAGE = gql`
  mutation UploadGalleryImage($input: UploadGalleryImageInput!) {
    uploadGalleryImage(input: $input) {
      id
      title
      imageUrl
      videoUrl
      thumbnailUrl
      category
      isPublic
      createdAt
    }
  }
`;

export function useUploadGalleryImageMutation(
  options?: MutationHookOptions<
    { uploadGalleryImage: GalleryImage },
    {
      input: {
        title?: string;
        description?: string;
        imageUrl?: string;
        videoUrl?: string;
        thumbnailUrl?: string;
        category?: GalleryCategory;
      };
    }
  >,
) {
  return useMutation(UPLOAD_GALLERY_IMAGE, options);
}

const UPDATE_GALLERY_IMAGE = gql`
  mutation UpdateGalleryImage($id: ID!, $input: UpdateGalleryImageInput!) {
    updateGalleryImage(id: $id, input: $input) {
      id
      isPublic
      isFeatured
      updatedAt
    }
  }
`;

const DELETE_GALLERY_IMAGE = gql`
  mutation DeleteGalleryImage($id: ID!) {
    deleteGalleryImage(id: $id) {
      success
      message
    }
  }
`;

export function useUpdateGalleryImageMutation(
  options?: MutationHookOptions<
    {
      updateGalleryImage: Pick<GalleryImage, 'id'> & {
        isPublic: boolean;
        isFeatured: boolean;
        updatedAt: string;
      };
    },
    {
      id: string;
      input: {
        isPublic?: boolean;
        isFeatured?: boolean;
        title?: string;
        description?: string;
        imageUrl?: string;
        videoUrl?: string;
        category?: GalleryCategory;
      };
    }
  >,
) {
  return useMutation(UPDATE_GALLERY_IMAGE, options);
}

export function useDeleteGalleryImageMutation(
  options?: MutationHookOptions<
    { deleteGalleryImage: { success: boolean; message?: string } },
    { id: string }
  >,
) {
  return useMutation(DELETE_GALLERY_IMAGE, options);
}
