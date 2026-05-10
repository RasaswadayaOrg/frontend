// Use internal API URL for server-side rendering, public URL for client-side
const API_URL = typeof window === 'undefined' 
  ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '/api')
  : (process.env.NEXT_PUBLIC_API_URL || '/api');

// Admin-authenticated fetch — reads admin_token cookie so server components
// calling protected /v1/admin/* endpoints receive a valid Bearer token.
async function fetchAdminData(endpoint: string, params: Record<string, any> = {}) {
  try {
    // Dynamic import keeps this server-only; won't run in browser bundles.
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    const url = new URL(`${API_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      console.error(`Error fetching ${endpoint}:`, res.status, res.statusText);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

// Helper to fetch data
async function fetchData(endpoint: string, params: Record<string, any> = {}, silent = false) {
  try {
    const url = new URL(`${API_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key].toString());
        }
    });

    const res = await fetch(url.toString(), { 
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
      if (!silent) {
        console.error(`Error fetching ${endpoint}:`, res.status, res.statusText);
      }
      return null;
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    if (!silent) {
      const isNetworkError =
        error?.cause?.code === "ECONNREFUSED" ||
        error?.code === "ECONNREFUSED" ||
        (error?.message ?? "").includes("ECONNREFUSED") ||
        error?.message === "fetch failed";
      if (isNetworkError) {
        console.warn(
          `[API] Backend not reachable at ${API_URL}${endpoint} — start the backend server (npm run dev in /backend).`
        );
      } else {
        console.error(`[API] Fetch error for ${endpoint}:`, error?.message ?? error);
      }
    }
    return null;
  }
}

// Helper to manually override event data (Temporary fix for specific events)
function overrideEventData(event: any) {
  if (!event) return event;
  const idStr = String(event.id);
  
  // Override for Event 002
  if (idStr === 'event-002' || idStr === '002' || idStr === '2') {
    return {
      ...event,
      title: "Deva The Deva Live in Colombo",
      imageUrl: "/deva_event.avif",
      // Ensure description or other fields are appropriate if needed, or leave as is.
    };
  }
  return event;
}

// --- Events ---

export interface EventType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventDate: Date;
  startTime?: string;
  endTime?: string;
  location: string;
  city: string;
  category: string;
  organizerId: string;
  organizer?: {
    fullName: string;
    profileImage?: string;
  };
  [key: string]: any;
}

export async function getEvents(limit = 4, page = 1, city?: string, search?: string, category?: string, featured?: boolean): Promise<EventType[]> {
  const params: any = { limit, page };
  if (city) params.city = city;
  if (search) params.search = search;
  if (category) params.category = category;
    if (featured !== undefined) params.featured = featured ? 'true' : 'false';
  
  const data = await fetchData('/events', params);
  if (!data || !data.success) return [];
  
  return data.data.map((event: any) => {
    const fixedEvent = overrideEventData(event);
    return {
      ...fixedEvent,
      eventDate: new Date(fixedEvent.eventDate),
      startTime: fixedEvent.startTime ? fixedEvent.startTime : undefined,
      endTime: fixedEvent.endTime ? fixedEvent.endTime : undefined
    };
  });
}

export async function getEventsCount(search?: string, category?: string, featured?: boolean) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (featured !== undefined) params.featured = featured ? 'true' : 'false';

    const data = await fetchData('/events', params);
    return data?.pagination?.total || 0;
}

export async function getEvent(id: string) {
    const data = await fetchData(`/events/${id}`);
    if (!data || !data.success) return null;
    
    const fixedEvent = overrideEventData(data.data);
    
    return {
        ...fixedEvent,
        eventDate: new Date(fixedEvent.eventDate),
        startTime: fixedEvent.startTime ? fixedEvent.startTime : undefined,
        endTime: fixedEvent.endTime ? fixedEvent.endTime : undefined
    };
}

export async function getTrendingEvents(limit = 3, city?: string) {
   // Assuming "trending" simply means featured or just events for now, but filtered by city if provided
   // If no specific "trending" logic, just return events
   const params: any = { limit, page: 1 };
   if (city) params.city = city;
   // Maybe prioritize featured
   params.featured = 'true';
   
   let data = await fetchData('/events', params);
   // Fallback if no featured events
   if (!data || !data.success || data.data.length === 0) {
      delete params.featured;
      data = await fetchData('/events', params);
   }

   if (!data || !data.success) return [];
   return data.data.map((event: any) => {
    const fixedEvent = overrideEventData(event);
    return {
      ...fixedEvent,
      eventDate: new Date(fixedEvent.eventDate),
      startTime: fixedEvent.startTime,
      endTime: fixedEvent.endTime
    };
  });
}

export async function getMyReminders(token: string) {
     try {
        const res = await fetch(`${API_URL}/auth/reminders`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.success ? json.data : [];
    } catch (e) {
        return [];
    }
}

// --- Artists ---

export async function getArtists(limit = 3, page = 1, search?: string, category?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (category) params.category = category;

    const data = await fetchData('/artists', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getArtistsCount(search?: string, category?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (category) params.category = category;

    const data = await fetchData('/artists', params);
    return data?.pagination?.total || 0;
}

export async function getArtist(id: string) {
    const data = await fetchData(`/artists/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}

/**
 * Look up an artist by their name slug (e.g. "amal-perera").
 * Searches the API by a loose name term then confirms an exact slug match.
 */
export async function getArtistBySlug(slug: string) {
    const { slugify } = await import('./slugs');
    const searchTerm = slug.replace(/-/g, ' ');
    const data = await fetchData('/artists', { search: searchTerm, limit: 50 });
    if (!data || !data.success) return null;
    const artists: any[] = data.data ?? [];
    return artists.find((a: any) => slugify(a.name || '') === slug) ?? null;
}

// --- Stores ---

export async function getStores(limit = 2) {
    const data = await fetchData('/stores', { limit });
    if (!data || !data.success) return [];
    
    return data.data.map((store: any) => ({
        ...store,
        products: [] 
    }));
}

export async function getStore(id: string) {
    const data = await fetchData(`/stores/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}

// --- Products ---

export async function getProducts(limit = 6, page = 1, search?: string, category?: string, listing?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (category) params.category = category;
    if (listing) params.listing = listing;

    const data = await fetchData('/products', params);
    if (!data || !data.success) return [];

    return data.data.map((p: any) => ({
        ...p,
        storeName: p.storeName || p.store?.name || "Unknown Store"
    }));
}

export async function getProductsCount(search?: string, category?: string, listing?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (listing) params.listing = listing;

    const data = await fetchData('/products', params);
    return data?.pagination?.total || 0;
}

export async function getProduct(id: string) {
    const data = await fetchData(`/products/${id}`);
    if (!data || !data.success) return null;
    
    const product = data.data;
    return {
        ...product,
        store: product.store,
        storeName: product.storeName || product.store?.name || "Unknown Store"
    };
}

export async function getStoreProducts(storeId: string, limit = 8, page = 1) {
    const data = await fetchData('/products', { storeId, limit, page });
    if (!data || !data.success) return [];
    
    return data.data;
}

export async function getStoreProductsCount(storeId: string) {
    const data = await fetchData('/products', { storeId, limit: 1 });
    return data?.pagination?.total || 0;
}


// --- Academies ---

export async function getAcademies(limit = 100, page = 1, search?: string, type?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (type) params.type = type;

    const data = await fetchData('/academies', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getAcademiesCount(search?: string, type?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (type) params.type = type;

    const data = await fetchData('/academies', params);
    return data?.pagination?.total || 0;
}

export async function getAcademy(id: string) {
    const data = await fetchData(`/academies/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}


// --- Static Data ---

export async function getCategories() {
    return [
        { id: 'cat-1', name: 'Instruments', iconUrl: '🎸' },
        { id: 'cat-2', name: 'Percussion', iconUrl: '🥁' },
        { id: 'cat-3', name: 'Strings', iconUrl: '🪕' },
        { id: 'cat-4', name: 'Wind', iconUrl: '🎷' },
        { id: 'cat-5', name: 'Accessories', iconUrl: '🎵' },
        { id: 'cat-6', name: 'Equipment', iconUrl: '🎛️' },
        { id: 'cat-7', name: 'Traditional', iconUrl: '🪘' },
        { id: 'cat-8', name: 'Music', iconUrl: '🎼' },
    ];
}

// --- Admin Dashboard Stats ---

export async function getAdminStats() {
    try {
        const data = await fetchAdminData('/v1/admin/stats');
        if (!data || !data.success) {
            // Fallback to individual endpoints
            const [eventsData, artistsData, productsData, academiesData, storesData] = await Promise.all([
                fetchData('/events', { limit: 1 }),
                fetchData('/artists', { limit: 1 }),
                fetchData('/products', { limit: 1 }),
                fetchData('/academies', { limit: 1 }),
                fetchData('/stores', { limit: 1 })
            ]);
            return {
                totalUsers: 0,
                totalEvents: eventsData?.pagination?.total || 0,
                totalArtists: artistsData?.pagination?.total || 0,
                totalProducts: productsData?.pagination?.total || 0,
                totalAcademies: academiesData?.pagination?.total || 0,
                totalOrders: 0,
                totalStores: storesData?.pagination?.total || storesData?.data?.length || 0
            };
        }
        return data.data;
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return {
            totalUsers: 0,
            totalEvents: 0,
            totalArtists: 0,
            totalProducts: 0,
            totalAcademies: 0,
            totalOrders: 0,
            totalStores: 0
        };
    }
}

// --- Users (Admin) ---

export async function getUsers(limit = 20, page = 1, search?: string, role?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (role) params.role = role;

    const data = await fetchAdminData('/v1/admin/users', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getUsersCount(search?: string, role?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (role) params.role = role;

    const data = await fetchAdminData('/v1/admin/users', params);
    return data?.pagination?.total || 0;
}

export async function getUser(id: string) {
    const data = await fetchAdminData(`/v1/admin/users/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}

// --- Orders (Admin) ---

export async function getAdminOrders(limit = 20, page = 1, status?: string) {
    const params: any = { limit, page };
    if (status) params.status = status;

    // Use admin endpoint
    const data = await fetchAdminData('/v1/admin/orders', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getAdminOrdersCount(status?: string) {
    const params: any = { limit: 1 };
    if (status) params.status = status;

    // Use admin endpoint
    const data = await fetchAdminData('/v1/admin/orders', params);
    return data?.pagination?.total || 0;
}

export async function getOrders(limit = 20, page = 1, status?: string) {
    const params: any = { limit, page };
    if (status) params.status = status;

    const data = await fetchData('/orders', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getOrdersCount(status?: string) {
    const params: any = { limit: 1 };
    if (status) params.status = status;

    const data = await fetchData('/orders', params);
    return data?.pagination?.total || 0;
}

// --- Recent Activity (from various sources) ---

export async function getRecentActivity(limit = 10) {
    try {
        // Try to fetch from admin activity endpoint first
        const adminActivity = await fetchAdminData('/v1/admin/activity', { limit });
        if (adminActivity?.success && adminActivity.data) {
            return adminActivity.data;
        }

        // Fallback: Fetch recent data from multiple sources
        const [recentEvents, recentArtists, recentAcademies] = await Promise.all([
            fetchData('/events', { limit: 5 }),
            fetchData('/artists', { limit: 5 }),
            fetchData('/academies', { limit: 5 })
        ]);

        const activities: any[] = [];

        // Add event activities
        if (recentEvents?.success && recentEvents.data) {
            recentEvents.data.forEach((event: any) => {
                activities.push({
                    id: `event-${event.id}`,
                    type: 'event',
                    user: event.organizer?.fullName || 'Organizer',
                    action: 'created event',
                    target: event.title,
                    time: event.createdAt
                });
            });
        }

        // Add artist activities
        if (recentArtists?.success && recentArtists.data) {
            recentArtists.data.forEach((artist: any) => {
                activities.push({
                    id: `artist-${artist.id}`,
                    type: 'artist',
                    user: artist.name,
                    action: 'joined the platform',
                    target: artist.profession || 'Artist',
                    time: artist.createdAt
                });
            });
        }

        // Add academy activities
        if (recentAcademies?.success && recentAcademies.data) {
            recentAcademies.data.forEach((academy: any) => {
                activities.push({
                    id: `academy-${academy.id}`,
                    type: 'academy',
                    user: academy.name,
                    action: 'was registered',
                    target: academy.type || 'Academy',
                    time: academy.createdAt
                });
            });
        }

        // Sort by time and return limited results
        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
    }
}

// --- Sponsored Ads ---

export async function getSponsoredAds(limit = 20, page = 1, placement?: string, isActive?: boolean) {
    const params: any = { limit, page };
    if (placement) params.placement = placement;
    if (isActive !== undefined) params.isActive = isActive;

    const data = await fetchAdminData('/v1/admin/ads', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getSponsoredAdsCount(placement?: string, isActive?: boolean) {
    const params: any = { limit: 1 };
    if (placement) params.placement = placement;
    if (isActive !== undefined) params.isActive = isActive;

    const data = await fetchAdminData('/v1/admin/ads', params);
    return data?.pagination?.total || 0;
}

export async function getSponsoredAd(id: string) {
    const data = await fetchAdminData(`/v1/admin/ads/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}

export async function getActiveAdsForPlacement(placement: string) {
    // Silent mode - ads endpoint may not exist yet
    const data = await fetchAdminData(`/v1/admin/ads/placement/${placement}`);
    if (!data || !data.success) return [];
    return data.data;
}

// --- Admin Posts ---

export interface AdminPostType {
  id: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  source: string;
  externalId: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  artistId: string;
  artist: {
    id: string;
    name: string;
    photoUrl: string | null;
  } | null;
  likesCount: number;
  commentsCount: number;
}

export async function getAdminPosts(limit = 20, page = 1): Promise<{ posts: AdminPostType[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const data = await fetchAdminData('/v1/admin/posts', { limit, page });
  if (!data || !data.success) return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
  return data.data;
}

export async function getAdminPostsCount() {
  const data = await fetchAdminData('/v1/admin/posts', { limit: 1, page: 1 });
  return data?.data?.pagination?.total || 0;
}

export const prisma = {};
export async function getRecommendations(token: string) {
    if (!token) return { data: null };
    try {
        const res = await fetch(`${API_URL}/v1/recommendations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!res.ok) return { data: null };
        return await res.json();
    } catch (error: any) {
        const isNetworkError =
            error?.cause?.code === "ECONNREFUSED" ||
            error?.message === "fetch failed";
        if (isNetworkError) {
            console.warn(`[API] Backend not reachable — recommendations unavailable.`);
        } else {
            console.error("Error fetching recommendations:", error?.message ?? error);
        }
        return { data: null };
    }
}

export async function getUserPreferences(token: string) {
    if (!token) return null;
    try {
        const res = await fetch(`${API_URL}/auth/preferences`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error: any) {
        const isNetworkError =
            error?.cause?.code === "ECONNREFUSED" ||
            error?.message === "fetch failed";
        if (isNetworkError) {
            console.warn(`[API] Backend not reachable — user preferences unavailable.`);
        } else {
            console.error("Error fetching user preferences:", error?.message ?? error);
        }
        return null;
    }
}
