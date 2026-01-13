const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper to fetch data
async function fetchData(endpoint: string, params: Record<string, any> = {}) {
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
      console.error(`Error fetching ${endpoint}:`, res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
}

// --- Events ---

export async function getEvents(limit = 4, page = 1, city?: string, search?: string, category?: string) {
  const params: any = { limit, page };
  if (city) params.city = city;
  if (search) params.search = search;
  if (category) params.category = category;
  
  const data = await fetchData('/events', params);
  if (!data || !data.success) return [];
  
  return data.data.map((event: any) => ({
    ...event,
    eventDate: new Date(event.eventDate),
    startTime: event.startTime ? event.startTime : undefined,
    endTime: event.endTime ? event.endTime : undefined
  }));
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
    return {
        ...data.data,
        eventDate: new Date(data.data.eventDate),
        startTime: data.data.startTime ? data.data.startTime : undefined,
        endTime: data.data.endTime ? data.data.endTime : undefined
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
   return data.data.map((event: any) => ({
    ...event,
    eventDate: new Date(event.eventDate),
    startTime: event.startTime,
    endTime: event.endTime
  }));
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
        store: product.store
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

export const prisma = {};
