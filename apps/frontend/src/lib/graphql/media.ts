import { gql } from '@apollo/client';

export const CREATE_MEDIA_UPLOAD_SIGNATURE = gql`
  mutation CreateMediaUploadSignature(
    $input: CreateMediaUploadSignatureInput!
  ) {
    createMediaUploadSignature(input: $input) {
      mediaId
      cloudName
      apiKey
      timestamp
      signature
      folder
      publicId
      uploadUrl
      resourceType
    }
  }
`;

export const CONFIRM_MEDIA_UPLOAD = gql`
  mutation ConfirmMediaUpload($mediaId: ID!) {
    confirmMediaUpload(mediaId: $mediaId) {
      id
      status
      mediaType
      publicId
      format
      width
      height
    }
  }
`;
