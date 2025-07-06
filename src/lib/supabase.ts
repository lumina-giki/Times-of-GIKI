import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we have valid Supabase credentials
const hasValidCredentials =
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder-key' &&
    !supabaseUrl.includes('your_supabase_url_here') &&
    !supabaseAnonKey.includes('your_supabase_anon_key_here') &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20

// Create Supabase client with proper error handling and auth configuration
export const supabase = hasValidCredentials
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
        }
    })
    : createClient('https://placeholder.supabase.co', 'placeholder-anon-key-for-fallback')

// Export flag to check if Supabase is configured
export const isSupabaseConfigured = hasValidCredentials

// Types for our database tables
export interface Article {
    id: string
    title: string
    content: string
    excerpt: string
    author: string
    category: string
    featured_image?: string
    created_at: string
    updated_at: string
    published: boolean
    author_id: string
}

export interface GalleryImage {
    id: string
    title: string
    description: string
    image_url: string
    alt_text: string
    uploaded_by: string
    credit?: string
    created_at: string
    featured: boolean
    author_id: string
    source?: 'database' | 'local' // Track image source
}

// Interface for local static images
export interface LocalImage {
    id: string
    title: string
    description: string
    image_url: string
    alt_text: string
    uploaded_by: string
    credit?: string
    created_at: string
    featured: boolean
    author_id: string
    source: 'local'
}

export interface UserProfile {
    id: string
    email: string
    full_name: string
    role: 'admin' | 'editor' | 'contributor'
    avatar_url?: string
    created_at: string
}

// Static local images that are always available
export const localGalleryImages: LocalImage[] = [
    {
        id: 'local-1',
        title: 'GIKI Campus Main View',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/first picture.jpg',
        alt_text: 'GIKI Campus Main View',
        uploaded_by: 'Times of GIKI',
        credit: 'Official GIKI Photography',
        created_at: '2024-01-01T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    // Add more local images as needed
    {
        id: 'local-2',
        title: 'GIKI Hostel 11',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250622-WA0011.jpg',
        alt_text: 'GIKI Hostel 11',
        uploaded_by: 'Times of GIKI',
        credit: '',
        created_at: '2024-08-29T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-3',
        title: 'GIKI Hostel 12 TOP',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250622-WA0013.jpg',
        alt_text: 'GIKI Hostel 12',
        uploaded_by: 'Times of GIKI',
        credit: '',
        created_at: '2024-08-29T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-4',
        title: 'GIKI Cricket Ground',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250622-WA0014.jpg',
        alt_text: 'GIKI Cricket Ground',
        uploaded_by: 'Times of GIKI',
        credit: '',
        created_at: '2024-08-29T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-5',
        title: 'GIKI Administration Block left Side',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250622-WA0015.jpg',
        alt_text: 'GIKI Administration Block left Side',
        uploaded_by: 'Times of GIKI',
        credit: '',
        created_at: '2024-08-29T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-6',
        title: 'GIKI AcB Block Side',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250623-WA0004.jpg',
        alt_text: 'GIKI AcB Block Side',
        uploaded_by: 'Times of GIKI',
        credit: '@lensofabdullaah',
        created_at: '2025-06-23T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-7',
        title: 'GIKI Library Top',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250623-WA0005.jpg',
        alt_text: 'GIKI Library Top',
        uploaded_by: 'Times of GIKI',
        credit: '@lensofabdullaah',
        created_at: '2025-06-23T00:00:30Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-8',
        title: 'GIKI Audi view from AcB',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250623-WA0006.jpg',
        alt_text: 'GIKI Audi view from AcB',
        uploaded_by: 'Times of GIKI',
        credit: '@lensofabdullaah',
        created_at: '2025-06-23T00:00:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
    {
        id: 'local-9',
        title: 'GIKI Auditorium',
        description: 'The iconic main entrance and campus overview',
        image_url: '/media/IMG-20250623-WA0007.jpg',
        alt_text: 'GIKI Auditorium',
        uploaded_by: 'Times of GIKI',
        credit: '@lensofabdullaah',
        created_at: '2025-06-23T00:01:00Z',
        featured: true,
        author_id: 'system',
        source: 'local'
    },
];

// Function to combine database images with local images
export const getCombinedGalleryImages = async (limit?: number): Promise<GalleryImage[]> => {
    try {
        // Fetch from database
        let query = supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(Math.max(1, limit - localGalleryImages.length));
        }

        const { data: dbImages, error } = await query;

        if (error) throw error;

        // Add source field to database images
        const databaseImages: GalleryImage[] = (dbImages || []).map(img => ({
            ...img,
            source: 'database' as const
        }));

        // Combine and sort by created_at (newest first)
        const allImages: GalleryImage[] = [...localGalleryImages, ...databaseImages]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Apply limit if specified
        return limit ? allImages.slice(0, limit) : allImages;

    } catch (error) {
        console.error('Error fetching combined gallery images:', error);
        // Fallback to local images only
        return localGalleryImages.slice(0, limit || localGalleryImages.length);
    }
};

// Function to get only database images (for admin management)
export const getDatabaseImages = async (): Promise<GalleryImage[]> => {
    try {
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(img => ({
            ...img,
            source: 'database' as const
        }));
    } catch (error) {
        console.error('Error fetching database images:', error);
        return [];
    }
};
