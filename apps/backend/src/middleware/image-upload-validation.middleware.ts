/**
 * Image Upload Validation Middleware
 * 
 * Security-focused validation for snake identification image uploads
 * 
 * VALIDATES:
 * - File size limits
 * - MIME type restrictions
 * - File signature (magic bytes) verification
 * - Image dimension constraints
 * - Content type headers
 * 
 * SECURITY NOTES:
 * - Never trust client-provided MIME types alone
 * - Verify actual file signatures to prevent malicious uploads
 * - Reject executable files, SVG, and unsupported formats
 * - Apply size limits to prevent DoS attacks
 */

import type { Request, Response, NextFunction } from 'express';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('ImageUploadValidation');

/**
 * Supported image MIME types for snake identification
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

/**
 * File signatures (magic bytes) for supported formats
 * Used to verify actual file type regardless of extension/MIME
 */
const FILE_SIGNATURES = {
  jpeg: [
    [0xff, 0xd8, 0xff], // JPEG
  ],
  png: [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG
  ],
  webp: [
    [0x52, 0x49, 0x46, 0x46], // RIFF (WebP container)
  ],
} as const;

/**
 * Configuration
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_DIMENSION = 4096; // Max width/height in pixels
const MIN_DIMENSION = 100; // Min width/height in pixels

/**
 * Image upload validation error
 */
export class ImageValidationError extends Error {
  constructor(
    message: string,
    public code: string,
    public httpStatus: number = 400
  ) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

/**
 * Verify file signature matches expected format
 */
function verifyFileSignature(buffer: Buffer, mimeType: string): boolean {
  // Map MIME type to signature
  let signatures: number[][];

  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    signatures = FILE_SIGNATURES.jpeg;
  } else if (mimeType === 'image/png') {
    signatures = FILE_SIGNATURES.png;
  } else if (mimeType === 'image/webp') {
    signatures = FILE_SIGNATURES.webp;
  } else {
    return false;
  }

  // Check if buffer starts with any of the valid signatures
  return signatures.some((signature) => {
    if (buffer.length < signature.length) {
      return false;
    }
    return signature.every((byte, index) => buffer[index] === byte);
  });
}

/**
 * Validate image URL for snake identification
 * 
 * This is used when images are already uploaded to Cloudinary
 * and we're validating the URL before sending to AI
 */
export async function validateImageUrl(imageUrl: string): Promise<void> {
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new ImageValidationError(
      'Image URL is required',
      'MISSING_IMAGE_URL'
    );
  }

  const trimmedUrl = imageUrl.trim();

  // Basic URL validation
  try {
    const url = new URL(trimmedUrl);
    
    // Only allow HTTPS for security
    if (url.protocol !== 'https:') {
      throw new ImageValidationError(
        'Image URL must use HTTPS protocol',
        'INSECURE_URL',
        400
      );
    }

    // Optional: Restrict to known image hosting domains (Cloudinary, etc.)
    // Uncomment to enforce domain restrictions
    // const allowedDomains = ['res.cloudinary.com', 'cloudinary.com'];
    // if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
    //   throw new ImageValidationError(
    //     'Image must be hosted on approved domain',
    //     'INVALID_IMAGE_HOST',
    //     400
    //   );
    // }

  } catch (error) {
    if (error instanceof ImageValidationError) {
      throw error;
    }
    throw new ImageValidationError(
      'Invalid image URL format',
      'INVALID_URL',
      400
    );
  }
}

/**
 * Validate uploaded image file (multipart upload)
 * 
 * This validates raw file uploads before they're sent to storage
 */
export async function validateImageFile(
  file: Express.Multer.File
): Promise<void> {
  // Check file exists
  if (!file) {
    throw new ImageValidationError('No file provided', 'MISSING_FILE');
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    throw new ImageValidationError(
      `File size exceeds maximum allowed size of ${sizeMB}MB`,
      'FILE_TOO_LARGE',
      413
    );
  }

  if (file.size === 0) {
    throw new ImageValidationError('File is empty', 'EMPTY_FILE');
  }

  // Validate MIME type
  const mimeType = file.mimetype.toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(mimeType as any)) {
    throw new ImageValidationError(
      `Invalid file type: ${mimeType}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      'INVALID_MIME_TYPE',
      415
    );
  }

  // Verify file signature (magic bytes)
  // This prevents malicious files disguised with fake extensions/MIME types
  if (file.buffer) {
    const isValidSignature = verifyFileSignature(file.buffer, mimeType);
    if (!isValidSignature) {
      logger.warn({
        msg: 'File signature mismatch',
        declaredMimeType: mimeType,
        fileSize: file.size,
      });
      throw new ImageValidationError(
        'File signature does not match declared type',
        'SIGNATURE_MISMATCH',
        400
      );
    }
  }

  // Additional security checks
  // Reject files with suspicious characteristics

  // Check filename for suspicious patterns
  if (file.originalname) {
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.dll$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.sh$/i,
      /\.php$/i,
      /\.jsp$/i,
      /\.asp$/i,
      /\.svg$/i, // SVG can contain scripts
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(file.originalname))) {
      throw new ImageValidationError(
        'File name contains suspicious pattern',
        'SUSPICIOUS_FILENAME',
        400
      );
    }
  }

  logger.info({
    msg: 'Image file validation passed',
    mimeType,
    size: file.size,
    originalName: file.originalname,
  });
}

/**
 * Express middleware for image upload validation
 * 
 * Usage in routes:
 * router.post('/upload', upload.single('image'), validateImageUpload, handler)
 */
export function validateImageUpload(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Check if file exists in request
  if (!req.file) {
    return next(
      new ImageValidationError('No image file uploaded', 'MISSING_FILE')
    );
  }

  // Validate the uploaded file
  validateImageFile(req.file)
    .then(() => {
      next();
    })
    .catch((error) => {
      if (error instanceof ImageValidationError) {
        logger.warn({
          msg: 'Image validation failed',
          error: error.message,
          code: error.code,
        });
        return res.status(error.httpStatus).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }

      logger.error({ msg: 'Unexpected validation error', error });
      return res.status(500).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate image',
        },
      });
    });
}

/**
 * Validate image dimensions (optional)
 * Requires image processing library like sharp
 */
export async function validateImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  try {
    // Dynamic import to avoid requiring sharp if not installed
    const sharp = await import('sharp');
    const metadata = await sharp.default(buffer).metadata();

    const width = metadata.width || 0;
    const height = metadata.height || 0;

    if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
      throw new ImageValidationError(
        `Image dimensions too small. Minimum ${MIN_DIMENSION}x${MIN_DIMENSION} pixels required`,
        'IMAGE_TOO_SMALL'
      );
    }

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      throw new ImageValidationError(
        `Image dimensions too large. Maximum ${MAX_DIMENSION}x${MAX_DIMENSION} pixels allowed`,
        'IMAGE_TOO_LARGE'
      );
    }

    return { width, height };
  } catch (error) {
    if (error instanceof ImageValidationError) {
      throw error;
    }

    // If sharp is not installed, skip dimension validation
    logger.warn({
      msg: 'Image dimension validation skipped (sharp not available)',
      error,
    });
    return { width: 0, height: 0 };
  }
}
