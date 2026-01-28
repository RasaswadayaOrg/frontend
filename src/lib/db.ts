const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
  } catch (error) {
    if (!silent) {
      console.error(`Fetch error for ${endpoint}:`, error);
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

export async function getEvents(limit = 4, page = 1, city?: string, search?: string, category?: string) {
  const params: any = { limit, page };
  if (city) params.city = city;
  if (search) params.search = search;
  if (category) params.category = category;
  
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

export async function getEventsCount(search?: string, category?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (category) params.category = category;

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

export async function getArtists(limit = 3, page = 1, search?: string, genre?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (genre) params.genre = genre;

    const data = await fetchData('/artists', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getArtistsCount(search?: string, genre?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (genre) params.genre = genre;

    const data = await fetchData('/artists', params);
    return data?.pagination?.total || 0;
}

export async function getArtist(id: string) {
    const data = await fetchData(`/artists/${id}`);
    if (!data || !data.success) return null;
    return data.data;
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

export async function getProducts(limit = 6, page = 1, search?: string, category?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (category) params.category = category;

    const data = await fetchData('/products', params);
    if (!data || !data.success) return [];

    return data.data.map((p: any) => ({
        ...p,
        price: Number(p.price),
        storeName: p.storeName || p.store?.name || "Unknown Store"
    }));
}

export async function getProductsCount(search?: string, category?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (category) params.category = category;

    const data = await fetchData('/products', params);
    return data?.pagination?.total || 0;
}

export async function getProduct(id: string) {
    const data = await fetchData(`/products/${id}`);
    if (!data || !data.success) return null;
    
    const product = data.data;
    return {
        ...product,
        price: Number(product.price),
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
        { id: 'cat-1', name: 'Handloom', iconUrl: '🧵' },
        { id: 'cat-2', name: 'Masks', iconUrl: '🎭' },
        { id: 'cat-3', name: 'Woodwork', iconUrl: '🪵' },
        { id: 'cat-4', name: 'Brassware', iconUrl: '🏺' },
        { id: 'cat-5', name: 'Batik', iconUrl: '🎨' },
    ];
}

// --- Admin Dashboard Stats ---

export async function getAdminStats() {
    try {
        const data = await fetchData('/admin/stats');
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
                totalRevenue: 0,
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
            totalRevenue: 0,
            totalStores: 0
        };
    }
}

// --- Users (Admin) ---

export async function getUsers(limit = 20, page = 1, search?: string, role?: string) {
    const params: any = { limit, page };
    if (search) params.search = search;
    if (role) params.role = role;

    const data = await fetchData('/admin/users', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getUsersCount(search?: string, role?: string) {
    const params: any = { limit: 1 };
    if (search) params.search = search;
    if (role) params.role = role;

    const data = await fetchData('/admin/users', params);
    return data?.pagination?.total || 0;
}

export async function getUser(id: string) {
    const data = await fetchData(`/users/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}

// --- Orders (Admin) ---

export async function getAdminOrders(limit = 20, page = 1, status?: string) {
    const params: any = { limit, page };
    if (status) params.status = status;

    // Use admin endpoint
    const data = await fetchData('/admin/orders', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getAdminOrdersCount(status?: string) {
    const params: any = { limit: 1 };
    if (status) params.status = status;

    // Use admin endpoint
    const data = await fetchData('/admin/orders', params);
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
        const adminActivity = await fetchData('/admin/activity', { limit });
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

    const data = await fetchData('/admin/ads', params);
    if (!data || !data.success) return [];
    return data.data;
}

export async function getSponsoredAdsCount(placement?: string, isActive?: boolean) {
    const params: any = { limit: 1 };
    if (placement) params.placement = placement;
    if (isActive !== undefined) params.isActive = isActive;

    const data = await fetchData('/admin/ads', params);
    return data?.pagination?.total || 0;
}

export async function getSponsoredAd(id: string) {
    const data = await fetchData(`/admin/ads/${id}`);
    if (!data || !data.success) return null;
    return data.data;
}

export async function getActiveAdsForPlacement(placement: string) {
    // Silent mode - ads endpoint may not exist yet
    const data = await fetchData(`/admin/ads/placement/${placement}`, {}, true);
    if (!data || !data.success) return [];
    return data.data;
}

export const prisma = {};
