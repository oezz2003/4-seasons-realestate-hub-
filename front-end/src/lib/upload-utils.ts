import { uploadApi } from './admin-api';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  id: string | number;
  image: string;
  alt_text?: string;
}

// Image validation
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images only.',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload images smaller than 5MB.',
    };
  }
  
  return { valid: true };
};

// Upload single image
export const uploadImage = async (
  file: File,
  type: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    const result = await uploadApi.uploadImage(file, type);
    
    // Handle new backend response format
    if (result.images && result.images.length > 0) {
      const normalized = result.images[0];
      normalized.image = normalizeMediaPath(normalized.image);
      normalized.id = String(normalized.id ?? '');
      return normalized;
    }
    
    // Fallback for old format
    result.image = normalizeMediaPath(result.image);
    result.id = String(result.id ?? '');
    return result;
  } catch (error) {
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  type: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult[]> => {
  // Validate all files
  for (const file of files) {
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  try {
    const result = await uploadApi.uploadMultipleImages(files, type);
    
    // Handle new backend response format
    if (result.images && Array.isArray(result.images)) {
      return result.images.map((img: UploadResult) => ({
        ...img,
        id: String(img.id ?? ''),
        image: normalizeMediaPath(img.image),
      }));
    }
    
    // Fallback for old format
    return result.map((img: UploadResult) => ({
      ...img,
      id: String(img.id ?? ''),
      image: normalizeMediaPath(img.image),
    }));
  } catch (error) {
    throw new Error(`Bulk upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

function normalizeMediaPath(path: string): string {
  if (!path) return path;

  let normalized = path.replace(/\\/g, '/');
  const mediaIndex = normalized.indexOf('/media/');

  if (mediaIndex >= 0) {
    normalized = normalized.substring(mediaIndex);
  } else if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  // Remove duplicate slashes (except protocol)
  normalized = normalized.replace(/([^:])\/+/g, '$1/');

  return normalized;
}

// Compress image before upload
export const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1920px width)
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Generate thumbnail
export const generateThumbnail = (file: File, size: number = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let newWidth = size;
      let newHeight = size;
      
      if (aspectRatio > 1) {
        newHeight = size / aspectRatio;
      } else {
        newWidth = size * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = () => reject(new Error('Failed to generate thumbnail'));
    img.src = URL.createObjectURL(file);
  });
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

