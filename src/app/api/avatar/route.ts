import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'User';
  
  // Fetch the avatar image from UI Avatars and return it directly
  // (Next.js Image optimization doesn't follow redirects)
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=200`;

  const response = await fetch(avatarUrl);
  const imageBuffer = await response.arrayBuffer();

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
