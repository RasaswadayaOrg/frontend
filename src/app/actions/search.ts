'use server'

import { getEvents, getArtists, getProducts, getAcademies } from "@/lib/db";

export type SearchSuggestion = {
  id: string;
  title: string;
  type: 'event' | 'artist' | 'product' | 'academy';
  url: string;
  image?: string;
  subtitle?: string;
};

export type SearchSuggestionsResult = {
  events: SearchSuggestion[];
  artists: SearchSuggestion[];
  products: SearchSuggestion[];
  academies: SearchSuggestion[];
};

export async function getSearchSuggestions(query: string): Promise<SearchSuggestionsResult | null> {
  if (!query || query.trim().length < 2) return null;

  try {
    const [events, artists, products, academies] = await Promise.all([
      getEvents(3, 1, undefined, query),
      getArtists(3, 1, query),
      getProducts(3, 1, query),
      getAcademies(3, 1, query),
    ]);

    return {
      events: events.map((e: any) => ({ 
        id: e.id, 
        title: e.title, 
        type: 'event', 
        url: `/events/${e.id}`,
        image: e.imageUrl,
        subtitle: new Date(e.eventDate).toLocaleDateString()
      })),
      artists: artists.map((a: any) => ({ 
        id: a.id, 
        title: a.name, 
        type: 'artist', 
        url: `/artists/${a.id}`,
        image: a.photoUrl || undefined,
        subtitle: a.genre || a.category
      })),
      products: products.map((p: any) => ({ 
        id: p.id, 
        title: p.name, 
        type: 'product', 
        url: `/products/${p.id}`,
        image: p.images?.[0],
        subtitle: `LKR ${p.price}`
      })),
      academies: academies.map((a: any) => ({ 
        id: a.id, 
        title: a.name, 
        type: 'academy', 
        url: `/academies/${a.id}`,
        image: a.imageUrl,
        subtitle: a.location
      })),
    };
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return null;
  }
}
