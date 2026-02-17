'use server'

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function verifyAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.has("admin_session");
}

// Events
export async function deleteEvent(eventId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/events/${eventId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/events');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete event' };
    }
  } catch (error) {
    console.error('Delete event error:', error);
    return { success: false, message: 'Failed to delete event' };
  }
}

export async function createEvent(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const eventData = {
    title: formData.get('title'),
    description: formData.get('description'),
    eventDate: formData.get('eventDate'),
    location: formData.get('location'),
    venue: formData.get('venue'),
    city: formData.get('city'),
    category: formData.get('category'),
    imageUrl: formData.get('imageUrl'),
    capacity: formData.get('capacity') ? Number(formData.get('capacity')) : null,
    ticketLink: formData.get('ticketLink'),
  };

  try {
    const res = await fetch(`${API_URL}/admin/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      revalidatePath('/admin/events');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to create event' };
    }
  } catch (error) {
    console.error('Create event error:', error);
    return { success: false, message: 'Failed to create event' };
  }
}

export async function updateEvent(eventId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const eventData = {
    title: formData.get('title'),
    description: formData.get('description'),
    eventDate: formData.get('eventDate'),
    location: formData.get('location'),
    venue: formData.get('venue'),
    city: formData.get('city'),
    category: formData.get('category'),
    imageUrl: formData.get('imageUrl'),
    capacity: formData.get('capacity') ? Number(formData.get('capacity')) : null,
    ticketLink: formData.get('ticketLink'),
  };

  try {
    const res = await fetch(`${API_URL}/admin/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      revalidatePath('/admin/events');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update event' };
    }
  } catch (error) {
    console.error('Update event error:', error);
    return { success: false, message: 'Failed to update event' };
  }
}

export async function toggleEventFeatured(eventId: string, isFeatured: boolean) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured }),
    });

    if (res.ok) {
      revalidatePath('/admin/events');
      revalidatePath('/'); // Revalidate home page for hero slider
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update event' };
    }
  } catch (error) {
    console.error('Toggle featured error:', error);
    return { success: false, message: 'Failed to update event' };
  }
}

// Artists
export async function deleteArtist(artistId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/artists/${artistId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/artists');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete artist' };
    }
  } catch (error) {
    console.error('Delete artist error:', error);
    return { success: false, message: 'Failed to delete artist' };
  }
}

export async function createArtist(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const artistData = {
    name: formData.get('name'),
    profession: formData.get('profession'),
    genre: formData.get('genre'),
    bio: formData.get('bio'),
    location: formData.get('location'),
    photoUrl: formData.get('photoUrl'),
    coverUrl: formData.get('coverUrl') || null,
    website: formData.get('website') || null,
    instagram: formData.get('instagram') || null,
    facebook: formData.get('facebook') || null,
  };

  try {
    const res = await fetch(`${API_URL}/admin/artists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artistData),
    });

    if (res.ok) {
      revalidatePath('/admin/artists');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to create artist' };
    }
  } catch (error) {
    console.error('Create artist error:', error);
    return { success: false, message: 'Failed to create artist' };
  }
}

export async function updateArtist(artistId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const artistData = {
    name: formData.get('name'),
    profession: formData.get('profession'),
    genre: formData.get('genre'),
    bio: formData.get('bio'),
    location: formData.get('location'),
    photoUrl: formData.get('photoUrl'),
    coverUrl: formData.get('coverUrl') || null,
    website: formData.get('website') || null,
    instagram: formData.get('instagram') || null,
    facebook: formData.get('facebook') || null,
  };

  try {
    const res = await fetch(`${API_URL}/admin/artists/${artistId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artistData),
    });

    if (res.ok) {
      // Revalidate both the list and the detail page if it existed
      revalidatePath('/admin/artists');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update artist' };
    }
  } catch (error) {
    console.error('Update artist error:', error);
    return { success: false, message: 'Failed to update artist' };
  }
}

// Academies
export async function deleteAcademy(academyId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/academies/${academyId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/academies');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete academy' };
    }
  } catch (error) {
    console.error('Delete academy error:', error);
    return { success: false, message: 'Failed to delete academy' };
  }
}

export async function createAcademy(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const academyData = {
    name: formData.get('name'),
    type: formData.get('type'),
    location: formData.get('location'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
  };

  try {
    const res = await fetch(`${API_URL}/admin/academies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(academyData),
    });

    if (res.ok) {
      revalidatePath('/admin/academies');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to create academy' };
    }
  } catch (error) {
    console.error('Create academy error:', error);
    return { success: false, message: 'Failed to create academy' };
  }
}

export async function updateAcademy(academyId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const academyData = {
    name: formData.get('name'),
    type: formData.get('type'),
    location: formData.get('location'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
  };

  try {
    const res = await fetch(`${API_URL}/admin/academies/${academyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(academyData),
    });

    if (res.ok) {
      revalidatePath('/admin/academies');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update academy' };
    }
  } catch (error) {
    console.error('Update academy error:', error);
    return { success: false, message: 'Failed to update academy' };
  }
}

// Products
export async function deleteProduct(productId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/marketplace');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete product' };
    }
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, message: 'Failed to delete product' };
  }
}

export async function createProduct(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const productData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl'),
    category: formData.get('category'),
    stock: parseInt(formData.get('stock') as string),
    storeId: formData.get('storeId'), // We will need to pass a storeId
  };

  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      revalidatePath('/admin/marketplace');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to create product' };
    }
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, message: 'Failed to create product' };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const productData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl'),
    category: formData.get('category'),
    stock: parseInt(formData.get('stock') as string),
    isActive: formData.get('isActive') === 'true',
  };

  try {
    const res = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      revalidatePath('/admin/marketplace');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update product' };
    }
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, message: 'Failed to update product' };
  }
}

// Users
export async function deleteUser(userId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/users');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete user' };
    }
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, message: 'Failed to delete user' };
  }
}

export async function updateUserRole(userId: string, role: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      revalidatePath('/admin/users');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update user role' };
    }
  } catch (error) {
    console.error('Update user role error:', error);
    return { success: false, message: 'Failed to update user role' };
  }
}

// ============ SPONSORED ADS ============

export async function createSponsoredAd(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const adData = {
    title: formData.get('title'),
    imageUrl: formData.get('imageUrl'),
    linkUrl: formData.get('linkUrl') || null,
    placement: formData.get('placement'),
    size: formData.get('size') || 'medium',
    isActive: formData.get('isActive') === 'true',
    startDate: formData.get('startDate') || null,
    endDate: formData.get('endDate') || null,
  };

  try {
    const res = await fetch(`${API_URL}/admin/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adData),
    });

    if (res.ok) {
      revalidatePath('/admin/sponsored');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to create sponsored ad' };
    }
  } catch (error) {
    console.error('Create sponsored ad error:', error);
    return { success: false, message: 'Failed to create sponsored ad' };
  }
}

export async function updateSponsoredAd(adId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const adData = {
    title: formData.get('title'),
    imageUrl: formData.get('imageUrl'),
    linkUrl: formData.get('linkUrl') || null,
    placement: formData.get('placement'),
    size: formData.get('size') || 'medium',
    isActive: formData.get('isActive') === 'true',
    startDate: formData.get('startDate') || null,
    endDate: formData.get('endDate') || null,
  };

  try {
    const res = await fetch(`${API_URL}/admin/ads/${adId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adData),
    });

    if (res.ok) {
      revalidatePath('/admin/sponsored');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to update sponsored ad' };
    }
  } catch (error) {
    console.error('Update sponsored ad error:', error);
    return { success: false, message: 'Failed to update sponsored ad' };
  }
}

export async function deleteSponsoredAd(adId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/ads/${adId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/sponsored');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete sponsored ad' };
    }
  } catch (error) {
    console.error('Delete sponsored ad error:', error);
    return { success: false, message: 'Failed to delete sponsored ad' };
  }
}

export async function toggleSponsoredAdStatus(adId: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/admin/ads/${adId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      revalidatePath('/admin/sponsored');
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to toggle ad status' };
    }
  } catch (error) {
    console.error('Toggle ad status error:', error);
    return { success: false, message: 'Failed to toggle ad status' };
  }
}

// Organizers
export async function createOrganizer(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const organizerData = {
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    avatarUrl: formData.get('avatarUrl')
  };

  try {
    const res = await fetch(`${API_URL}/admin/organizers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organizerData)
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath('/admin/organizers');
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Failed to create organizer' };
    }
  } catch (error) {
    console.error('Create organizer error:', error);
    return { success: false, message: 'Failed to create organizer' };
  }
}

export async function updateOrganizer(organizerId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const organizerData = {
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    avatarUrl: formData.get('avatarUrl')
  };

  try {
    const res = await fetch(`${API_URL}/admin/organizers/${organizerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organizerData)
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath('/admin/organizers');
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Failed to update organizer' };
    }
  } catch (error) {
    console.error('Update organizer error:', error);
    return { success: false, message: 'Failed to update organizer' };
  }
}
