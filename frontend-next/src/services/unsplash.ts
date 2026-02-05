// Unsplash API Service
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

// Search photos by query
export const searchPhotos = async (
  query: string, 
  perPage: number = 10,
  page: number = 1
): Promise<UnsplashPhoto[]> => {
  try {
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    
    const data: UnsplashSearchResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Unsplash API error:', error);
    return [];
  }
};

// Get a random photo by query
export const getRandomPhoto = async (query: string): Promise<UnsplashPhoto | null> => {
  try {
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch random photo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Unsplash API error:', error);
    return null;
  }
};

// Get multiple random photos
export const getRandomPhotos = async (query: string, count: number = 3): Promise<UnsplashPhoto[]> => {
  try {
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch random photos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Unsplash API error:', error);
    return [];
  }
};

// Helper to get optimized image URL with size parameters
export const getOptimizedImageUrl = (photo: UnsplashPhoto, width: number = 1920): string => {
  return `${photo.urls.raw}&w=${width}&q=80&fit=crop`;
};

export default {
  searchPhotos,
  getRandomPhoto,
  getRandomPhotos,
  getOptimizedImageUrl,
};
