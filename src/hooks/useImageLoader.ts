import { useState, useEffect } from 'react';

interface UseImageLoaderProps {
  primaryUrl?: string;
  fallbackUrl?: string;
  defaultUrl: string;
}

interface UseImageLoaderReturn {
  imageUrl: string;
  isLoading: boolean;
  hasError: boolean;
  handleLoad: () => void;
  handleError: () => void;
}

export const useImageLoader = ({
  primaryUrl,
  fallbackUrl,
  defaultUrl
}: UseImageLoaderProps): UseImageLoaderReturn => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getValidImageUrl = (): string => {
    if (primaryUrl && primaryUrl.trim() !== '') {
      return primaryUrl;
    }
    if (fallbackUrl && fallbackUrl.trim() !== '') {
      return fallbackUrl;
    }
    return defaultUrl;
  };

  const imageUrl = getValidImageUrl();

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [primaryUrl, fallbackUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return {
    imageUrl,
    isLoading,
    hasError,
    handleLoad,
    handleError
  };
};
