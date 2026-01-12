# Rasaswadaya Backend Development Guide

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Frontend Architecture Summary](#2-frontend-architecture-summary)
3. [Page Routes & Navigation Flow](#3-page-routes--navigation-flow)
4. [Data Models & Database Schema](#4-data-models--database-schema)
5. [API Endpoints Required](#5-api-endpoints-required)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [User Flows & Business Logic](#7-user-flows--business-logic)
8. [Integration Points](#8-integration-points)
9. [Recommended Tech Stack](#9-recommended-tech-stack)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. Project Overview

**Rasaswadaya** is a Sri Lankan cultural arts platform that connects:
- **Users** (general audience) with cultural events, artists, and handicraft products
- **Artists** with fans and performance opportunities
- **Organizers** with event management tools
- **Artisans** with a marketplace to sell handicrafts

### Core Modules
| Module | Description |
|--------|-------------|
| **Events** | Cultural events, festivals, performances with ticket booking |
| **Artists** | Artist profiles, performances, followers |
| **Academies** | Music/Dance schools with course listings |
| **Marketplace** | Handicraft products from artisan stores |
| **Authentication** | User registration, login, role-based access |
| **Dashboard** | Role-specific dashboards (Organizer, Artist, User) |

---

## 2. Frontend Architecture Summary

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context (AuthContext)
- **Icons**: Lucide React
- **Image Handling**: Next.js Image with fallback component

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── events/            # Events listing & detail
│   ├── artists/           # Artists listing & detail
│   ├── academies/         # Academies listing & detail
│   ├── marketplace/       # Products & stores
│   ├── products/          # Product detail
│   ├── profile/           # User profile
│   ├── dashboard/         # Role-based dashboards
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── auth/              # Alternative auth routes
│   └── actions/           # Server Actions
├── components/            # Reusable UI components
├── context/               # React Context providers
└── lib/                   # Utilities, DB mock, auth helpers
```

### Current Data Layer
The frontend currently uses **mock data** in `src/lib/db.ts` simulating a Prisma client. This needs to be replaced with real API calls.

---

## 3. Page Routes & Navigation Flow

### Public Routes (No Auth Required)

| Route | Page | Description | Data Needed |
|-------|------|-------------|-------------|
| `/` | Home | Landing page with featured content | Events, Artists, Products, Trending |
| `/events` | Events List | Paginated events grid | Events (paginated), Categories |
| `/events/[id]` | Event Detail | Single event with booking | Event by ID, Organizer info |
| `/artists` | Artists List | Paginated artists grid | Artists (paginated), Genres |
| `/artists/[id]` | Artist Profile | Artist with performances | Artist by ID, Performances |
| `/academies` | Academies List | Schools listing | Academies (paginated), Types |
| `/academies/[id]` | Academy Detail | School with courses | Academy by ID |
| `/marketplace` | Products List | Handicraft products | Products (paginated), Categories |
| `/products/[id]` | Product Detail | Single product | Product by ID, Store info |
| `/marketplace/stores/[id]` | Store Detail | Artisan store page | Store by ID, Products |
| `/about` | About Page | Platform information | Static content |
| `/login` | Login | User authentication | - |
| `/signup` | Sign Up | User registration | - |

### Protected Routes (Auth Required)

| Route | Page | Role | Description |
|-------|------|------|-------------|
| `/profile` | User Profile | All Users | User settings, interests, reminders |
| `/dashboard` | Dashboard Home | All Users | Overview based on role |
| `/dashboard/organizer` | Organizer Dashboard | ORGANIZER | Event management |
| `/dashboard/organizer/create` | Create Event | ORGANIZER | New event form |
| `/dashboard/artist` | Artist Dashboard | ARTIST | Artist profile management |
| `/dashboard/orders` | My Orders | All Users | Purchase history |

### Navigation Components

**Header Navigation** (`/components/Header.tsx`):
- Logo → `/`
- Events → `/events`
- Artists → `/artists`
- Academies → `/academies`
- Marketplace → `/marketplace`
- About → `/about`
- Profile (authenticated) → `/profile`
- Sign Up/Login (guest) → Opens AuthModal

**Action Buttons & Their Behaviors**:

| Button | Location | Guest Behavior | Auth Behavior |
|--------|----------|----------------|---------------|
| Get Tickets | Event Detail | Opens AuthModal | Proceeds to booking |
| Interested | Event Detail | Opens AuthModal | Toggles interest |
| Follow | Artist Profile | Opens AuthModal | Toggles follow |
| Contact | Artist Profile | Opens AuthModal | Shows contact info |
| Add to Cart | Marketplace/Product | Opens AuthModal | Adds to cart |
| Enquire Now | Academy Detail | Opens AuthModal | Opens enquiry form |
| Create Event | Organizer Dashboard | N/A (protected) | Opens create form |

---

## 4. Data Models & Database Schema

### Entity Relationship Diagram (Conceptual)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│   Event     │───────│   Ticket    │
│             │       │             │       │             │
│ id          │       │ id          │       │ id          │
│ email       │  org  │ title       │       │ eventId     │
│ password    │◄──────│ description │       │ userId      │
│ fullName    │       │ eventDate   │       │ purchaseDate│
│ role        │       │ location    │       │ quantity    │
│ createdAt   │       │ venue       │       │ totalPrice  │
└─────────────┘       │ city        │       │ status      │
      │               │ price       │       └─────────────┘
      │               │ category    │
      │               │ capacity    │
      │               │ imageUrl    │
      │               │ organizerId │
      │               │ ticketLink  │
      │               └─────────────┘
      │
      │         ┌─────────────┐       ┌─────────────┐
      │ artist  │   Artist    │───────│ Performance │
      └────────►│             │       │             │
                │ id          │       │ id          │
                │ name        │       │ artistId    │
                │ profession  │       │ eventId     │
                │ genre       │       │ role        │
                │ bio         │       └─────────────┘
                │ photoUrl    │
                │ userId      │◄──── Links to User
                └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Store     │───────│  Product    │───────│   Order     │
│             │       │             │       │             │
│ id          │       │ id          │       │ id          │
│ name        │       │ name        │       │ userId      │
│ description │       │ description │       │ productId   │
│ imageUrl    │       │ price       │       │ quantity    │
│ location    │       │ imageUrl    │       │ totalPrice  │
│ ownerId     │       │ storeId     │       │ status      │
│ rating      │       │ category    │       │ createdAt   │
│ reviewCount │       │ stock       │       │ address     │
└─────────────┘       └─────────────┘       └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Academy    │───────│   Course    │       │   Enquiry   │
│             │       │             │       │             │
│ id          │       │ id          │       │ id          │
│ name        │       │ name        │       │ academyId   │
│ type        │       │ academyId   │       │ userId      │
│ location    │       │ description │       │ message     │
│ description │       │ duration    │       │ status      │
│ imageUrl    │       │ fee         │       │ createdAt   │
│ phone       │       └─────────────┘       └─────────────┘
│ email       │
│ website     │
└─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Interest   │       │  Follower   │       │  CartItem   │
│             │       │             │       │             │
│ id          │       │ id          │       │ id          │
│ userId      │       │ userId      │       │ userId      │
│ eventId     │       │ artistId    │       │ productId   │
│ createdAt   │       │ createdAt   │       │ quantity    │
└─────────────┘       └─────────────┘       │ createdAt   │
                                            └─────────────┘
```

### Prisma Schema (Recommended)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ARTIST
  ORGANIZER
  STORE_OWNER
  ADMIN
}

enum TicketStatus {
  PENDING
  CONFIRMED
  CANCELLED
  USED
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

enum EnquiryStatus {
  PENDING
  RESPONDED
  CLOSED
}

// ============ USERS ============

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  fullName  String
  firstName String?
  lastName  String?
  phone     String?
  city      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  artist         Artist?
  organizedEvents Event[]      @relation("OrganizerEvents")
  tickets        Ticket[]
  interests      Interest[]
  follows        Follower[]
  orders         Order[]
  cartItems      CartItem[]
  enquiries      Enquiry[]
  store          Store?
  reminders      Reminder[]
}

// ============ EVENTS ============

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  eventDate   DateTime
  endDate     DateTime?
  startTime   DateTime?
  endTime     DateTime?
  location    String
  venue       String
  city        String
  category    String
  imageUrl    String?
  price       Float    @default(0)
  capacity    Int?
  ticketLink  String?
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  organizerId  String
  organizer    User          @relation("OrganizerEvents", fields: [organizerId], references: [id])
  tickets      Ticket[]
  interests    Interest[]
  performances Performance[]
}

model Ticket {
  id           String       @id @default(cuid())
  quantity     Int          @default(1)
  totalPrice   Float
  status       TicketStatus @default(PENDING)
  purchaseDate DateTime     @default(now())
  
  userId  String
  user    User   @relation(fields: [userId], references: [id])
  eventId String
  event   Event  @relation(fields: [eventId], references: [id])
}

model Interest {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  userId  String
  user    User   @relation(fields: [userId], references: [id])
  eventId String
  event   Event  @relation(fields: [eventId], references: [id])

  @@unique([userId, eventId])
}

// ============ ARTISTS ============

model Artist {
  id         String   @id @default(cuid())
  name       String
  profession String
  genre      String
  bio        String?
  photoUrl   String?
  coverUrl   String?
  location   String?
  website    String?
  instagram  String?
  facebook   String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Optional link to User
  userId String? @unique
  user   User?   @relation(fields: [userId], references: [id])

  // Relations
  followers    Follower[]
  performances Performance[]
}

model Follower {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  userId   String
  user     User   @relation(fields: [userId], references: [id])
  artistId String
  artist   Artist @relation(fields: [artistId], references: [id])

  @@unique([userId, artistId])
}

model Performance {
  id       String  @id @default(cuid())
  role     String? // e.g., "Headliner", "Guest"
  
  artistId String
  artist   Artist @relation(fields: [artistId], references: [id])
  eventId  String
  event    Event  @relation(fields: [eventId], references: [id])

  @@unique([artistId, eventId])
}

// ============ ACADEMIES ============

model Academy {
  id          String   @id @default(cuid())
  name        String
  type        String   // Dance School, Music Academy, etc.
  location    String
  description String?
  imageUrl    String?
  phone       String?
  email       String?
  website     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  courses   Course[]
  enquiries Enquiry[]
}

model Course {
  id          String  @id @default(cuid())
  name        String
  description String?
  duration    String?
  fee         Float?

  academyId String
  academy   Academy @relation(fields: [academyId], references: [id])
}

model Enquiry {
  id        String        @id @default(cuid())
  message   String
  status    EnquiryStatus @default(PENDING)
  response  String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  userId    String
  user      User    @relation(fields: [userId], references: [id])
  academyId String
  academy   Academy @relation(fields: [academyId], references: [id])
}

// ============ MARKETPLACE ============

model Store {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  coverUrl    String?
  location    String?
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  ownerId String @unique
  owner   User   @relation(fields: [ownerId], references: [id])

  products Product[]
}

model Product {
  id          String  @id @default(cuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  images      String[] // Array of image URLs
  category    String?
  stock       Int     @default(0)
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  storeId String
  store   Store  @relation(fields: [storeId], references: [id])

  cartItems  CartItem[]
  orderItems OrderItem[]
}

model Category {
  id      String  @id @default(cuid())
  name    String  @unique
  iconUrl String?
}

model CartItem {
  id        String   @id @default(cuid())
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User    @relation(fields: [userId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model Order {
  id            String      @id @default(cuid())
  totalPrice    Float
  status        OrderStatus @default(PENDING)
  shippingAddress String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id])

  items OrderItem[]
}

model OrderItem {
  id        String @id @default(cuid())
  quantity  Int
  unitPrice Float

  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
}

// ============ USER PREFERENCES ============

model Reminder {
  id        String   @id @default(cuid())
  title     String
  eventDate DateTime
  createdAt DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

---

## 5. API Endpoints Required

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/register` | User registration | `{ email, password, fullName, firstName?, role? }` | `{ user, token }` |
| POST | `/api/auth/login` | User login | `{ email, password }` | `{ user, token }` |
| POST | `/api/auth/logout` | User logout | - | `{ success }` |
| GET | `/api/auth/me` | Get current user | - | `{ user }` |
| POST | `/api/auth/google` | Google OAuth | `{ credential }` | `{ user, token }` |
| POST | `/api/auth/refresh` | Refresh token | `{ refreshToken }` | `{ token }` |
| POST | `/api/auth/forgot-password` | Password reset request | `{ email }` | `{ success }` |
| POST | `/api/auth/reset-password` | Reset password | `{ token, password }` | `{ success }` |

### Events Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/events` | List events | `page, limit, category, city, search, dateFrom, dateTo` | `{ events[], total, page }` |
| GET | `/api/events/:id` | Get single event | - | `{ event }` |
| POST | `/api/events` | Create event (Organizer) | - | `{ event }` |
| PUT | `/api/events/:id` | Update event (Organizer) | - | `{ event }` |
| DELETE | `/api/events/:id` | Delete event (Organizer) | - | `{ success }` |
| GET | `/api/events/trending` | Trending events | `limit` | `{ events[] }` |
| GET | `/api/events/featured` | Featured events | `limit` | `{ events[] }` |
| GET | `/api/events/categories` | Event categories | - | `{ categories[] }` |

### Event Interactions

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/events/:id/interest` | Toggle interest | - | `{ interested: boolean }` |
| GET | `/api/events/:id/interest` | Check if interested | - | `{ interested: boolean }` |
| POST | `/api/events/:id/tickets` | Purchase tickets | `{ quantity, paymentMethod }` | `{ ticket }` |
| GET | `/api/events/:id/tickets` | Get event's tickets (Organizer) | - | `{ tickets[] }` |

### Artists Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/artists` | List artists | `page, limit, genre, search` | `{ artists[], total }` |
| GET | `/api/artists/:id` | Get single artist | - | `{ artist }` |
| PUT | `/api/artists/:id` | Update artist profile | - | `{ artist }` |
| GET | `/api/artists/:id/performances` | Artist's performances | - | `{ performances[] }` |
| GET | `/api/artists/genres` | Available genres | - | `{ genres[] }` |

### Artist Interactions

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/artists/:id/follow` | Toggle follow | - | `{ following: boolean }` |
| GET | `/api/artists/:id/follow` | Check if following | - | `{ following: boolean }` |
| GET | `/api/artists/:id/followers` | Get follower count | - | `{ count, followers[]? }` |

### Academies Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/academies` | List academies | `page, limit, type, search` | `{ academies[], total }` |
| GET | `/api/academies/:id` | Get single academy | - | `{ academy }` |
| GET | `/api/academies/:id/courses` | Academy courses | - | `{ courses[] }` |
| POST | `/api/academies/:id/enquiry` | Submit enquiry | `{ message }` | `{ enquiry }` |
| GET | `/api/academies/types` | Academy types | - | `{ types[] }` |

### Marketplace Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/products` | List products | `page, limit, category, storeId, search, priceMin, priceMax` | `{ products[], total }` |
| GET | `/api/products/:id` | Get single product | - | `{ product }` |
| GET | `/api/products/categories` | Product categories | - | `{ categories[] }` |
| GET | `/api/stores` | List stores | `page, limit, search` | `{ stores[], total }` |
| GET | `/api/stores/:id` | Get single store | - | `{ store }` |
| GET | `/api/stores/:id/products` | Store's products | `page, limit` | `{ products[], total }` |

### Cart & Orders

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/cart` | Get user's cart | - | `{ items[], total }` |
| POST | `/api/cart` | Add to cart | `{ productId, quantity }` | `{ cartItem }` |
| PUT | `/api/cart/:itemId` | Update quantity | `{ quantity }` | `{ cartItem }` |
| DELETE | `/api/cart/:itemId` | Remove from cart | - | `{ success }` |
| DELETE | `/api/cart` | Clear cart | - | `{ success }` |
| POST | `/api/orders` | Create order | `{ shippingAddress, paymentMethod }` | `{ order }` |
| GET | `/api/orders` | Get user's orders | `page, limit, status` | `{ orders[], total }` |
| GET | `/api/orders/:id` | Get order details | - | `{ order }` |

### User Profile

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/users/me` | Get current user profile | - | `{ user }` |
| PUT | `/api/users/me` | Update profile | `{ fullName, phone, city, interests[] }` | `{ user }` |
| GET | `/api/users/me/interests` | Get user interests | - | `{ eventInterests[], genres[] }` |
| PUT | `/api/users/me/interests` | Update interests | `{ categories[] }` | `{ success }` |
| GET | `/api/users/me/reminders` | Get reminders | - | `{ reminders[] }` |
| POST | `/api/users/me/reminders` | Add reminder | `{ eventId }` | `{ reminder }` |
| DELETE | `/api/users/me/reminders/:id` | Remove reminder | - | `{ success }` |

### Dashboard (Organizer)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/dashboard/organizer/events` | My events | `{ events[], stats }` |
| GET | `/api/dashboard/organizer/stats` | Dashboard stats | `{ totalEvents, totalTickets, revenue }` |
| GET | `/api/dashboard/organizer/events/:id/analytics` | Event analytics | `{ views, tickets, revenue }` |

### Dashboard (Artist)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/dashboard/artist/profile` | My artist profile | `{ artist }` |
| PUT | `/api/dashboard/artist/profile` | Update artist profile | `{ artist }` |
| GET | `/api/dashboard/artist/stats` | Dashboard stats | `{ followers, performances, views }` |

### Search & Recommendations

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/search` | Global search | `q, type?` | `{ events[], artists[], products[] }` |
| GET | `/api/recommendations` | AI recommendations | - | `{ events[], artists[], products[] }` |

---

## 6. Authentication & Authorization

### Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │   Database   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │  POST /auth/login  │                    │
       │  {email, password} │                    │
       │───────────────────>│                    │
       │                    │  Find User         │
       │                    │───────────────────>│
       │                    │                    │
       │                    │  User + Hash       │
       │                    │<───────────────────│
       │                    │                    │
       │                    │  Verify Password   │
       │                    │  Generate JWT      │
       │                    │                    │
       │   { token, user }  │                    │
       │<───────────────────│                    │
       │                    │                    │
       │  Store in Cookie   │                    │
       │  & LocalStorage    │                    │
       │                    │                    │
```

### JWT Token Structure

```javascript
{
  header: { alg: "HS256", typ: "JWT" },
  payload: {
    sub: "user_id",
    email: "user@example.com",
    role: "USER" | "ARTIST" | "ORGANIZER" | "STORE_OWNER" | "ADMIN",
    iat: 1234567890,
    exp: 1234654290  // 24 hours
  }
}
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| `USER` | View all public content, buy tickets, shop, follow artists, express interest |
| `ARTIST` | All USER permissions + manage artist profile, view performance stats |
| `ORGANIZER` | All USER permissions + create/manage events, view ticket sales |
| `STORE_OWNER` | All USER permissions + manage store, add/edit products |
| `ADMIN` | Full access to all features and admin panel |

### Middleware Implementation

```typescript
// middleware.ts example
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const protectedRoutes = ['/dashboard', '/profile'];
const roleBasedRoutes = {
  '/dashboard/organizer': ['ORGANIZER', 'ADMIN'],
  '/dashboard/artist': ['ARTIST', 'ADMIN'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check role-based access
    for (const [route, roles] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(route) && !roles.includes(user.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}
```

---

## 7. User Flows & Business Logic

### 7.1 Guest User Flow

```
Home Page
    │
    ├──► Browse Events ──► Event Detail ──► "Get Tickets" ──► Auth Modal ──► Login/Signup
    │
    ├──► Browse Artists ──► Artist Profile ──► "Follow" ──► Auth Modal ──► Login/Signup
    │
    ├──► Browse Academies ──► Academy Detail ──► "Enquire Now" ──► Auth Modal ──► Login/Signup
    │
    └──► Browse Marketplace ──► Product Detail ──► "Add to Cart" ──► Auth Modal ──► Login/Signup
```

### 7.2 Registered User Flow

```
Login
    │
    └──► Home Page
            │
            ├──► Browse & Book Events ──► Select Tickets ──► Payment ──► Confirmation
            │
            ├──► Follow Artists ──► Get Notifications (future)
            │
            ├──► Shop Handicrafts ──► Add to Cart ──► Checkout ──► Order Confirmation
            │
            ├──► Enquire at Academies ──► Receive Response
            │
            └──► Profile Management
                    ├── Update Info
                    ├── Set Interests
                    ├── View Reminders
                    └── Sign Out
```

### 7.3 Organizer Flow

```
Login (ORGANIZER role)
    │
    └──► Dashboard
            │
            ├──► Overview (Stats)
            │       ├── Total Events
            │       ├── Tickets Sold
            │       └── Revenue
            │
            ├──► My Events
            │       ├── View All Events
            │       ├── Edit Event
            │       ├── View Ticket Sales
            │       └── Delete Event
            │
            └──► Create Event
                    ├── Fill Event Details
                    ├── Set Pricing
                    ├── Upload Image
                    └── Publish
```

### 7.4 Artist Flow

```
Login (ARTIST role)
    │
    └──► Dashboard
            │
            ├──► Overview
            │       ├── Follower Count
            │       ├── Profile Views
            │       └── Upcoming Performances
            │
            └──► Artist Profile
                    ├── Edit Bio
                    ├── Update Photos
                    ├── Manage Social Links
                    └── View Performance History
```

### 7.5 Ticket Booking Flow

```
Event Detail Page
    │
    └──► Click "Get Tickets"
            │
            ├── (Guest) ──► Auth Modal ──► Login/Signup ──► Return to Event
            │
            └── (Logged In)
                    │
                    └──► Ticket Selection Modal
                            │
                            ├── Select Ticket Type
                            ├── Choose Quantity
                            ├── View Total Price
                            │
                            └──► Proceed to Payment
                                    │
                                    ├── Enter Payment Details
                                    │   (Card, Bank, Mobile Wallet)
                                    │
                                    └──► Payment Processing
                                            │
                                            ├── (Success) ──► Confirmation Page
                                            │                   ├── Order Summary
                                            │                   ├── E-Ticket/QR
                                            │                   └── Email Confirmation
                                            │
                                            └── (Failed) ──► Error Message ──► Retry
```

### 7.6 Shopping Flow

```
Marketplace
    │
    └──► Browse Products ──► Product Detail
                                    │
                                    └──► Click "Add to Cart"
                                            │
                                            ├── (Guest) ──► Auth Modal
                                            │
                                            └── (Logged In) ──► Added to Cart
                                                                    │
                                                                    └──► View Cart
                                                                            │
                                                                            ├── Update Quantities
                                                                            ├── Remove Items
                                                                            │
                                                                            └──► Checkout
                                                                                    │
                                                                                    ├── Shipping Address
                                                                                    ├── Payment Method
                                                                                    │
                                                                                    └──► Confirm Order
                                                                                            │
                                                                                            └──► Order Confirmation
                                                                                                    ├── Order Number
                                                                                                    ├── Estimated Delivery
                                                                                                    └── Email Receipt
```

---

## 8. Integration Points

### 8.1 Frontend to Backend Integration

**Replace Mock Data in `src/lib/db.ts`:**

```typescript
// Before (Mock)
export async function getEvents(limit = 4, page = 1) {
  const skip = (page - 1) * limit;
  return await prisma.event.findMany({ take: limit, skip });
}

// After (Real API)
export async function getEvents(limit = 4, page = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=${limit}&page=${page}`,
    { next: { revalidate: 60 } } // ISR: revalidate every 60 seconds
  );
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}
```

**Create API Client Utility:**

```typescript
// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'API request failed');
    }

    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: RegisterData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Events
  async getEvents(params?: EventsParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/events?${query}`);
  }

  async getEvent(id: string) {
    return this.request(`/api/events/${id}`);
  }

  // ... more methods
}

export const api = new ApiClient();
```

### 8.2 Server Actions Migration

**Current Server Action (`src/app/actions/auth.ts`):**

The existing server action uses the mock Prisma client. Update to use real API:

```typescript
// src/app/actions/auth.ts
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    fullName: formData.get("fullName") as string,
    firstName: formData.get("firstName") as string,
    role: formData.get("role") as string || "USER",
  };

  const response = await api.register(data);
  
  // Set session cookie
  (await cookies()).set("session", response.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  redirect("/dashboard");
}

export async function signin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await api.login(email, password);
  
  (await cookies()).set("session", response.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  redirect("/dashboard");
}
```

### 8.3 AuthContext Integration

**Update `src/context/AuthContext.tsx`:**

```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    api.setToken(response.token);
    setUser(response.user);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    await api.logout();
    api.clearToken();
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    const response = await api.register(data);
    api.setToken(response.token);
    setUser(response.user);
    setIsAuthModalOpen(false);
  };

  // ... rest of the context
}
```

### 8.4 Environment Variables

Create `.env.local` for development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database (if using Prisma directly)
DATABASE_URL=postgresql://user:password@localhost:5432/rasaswadaya

# OAuth (future)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payment Gateway (future)
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Image Upload (future)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 9. Recommended Tech Stack

### Backend Framework Options

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Next.js API Routes** | Same codebase, easy deployment | Limited for complex APIs | ✅ Quick start |
| **Express.js** | Mature, flexible, large ecosystem | Separate deployment | ✅ Recommended |
| **NestJS** | TypeScript-first, structured, scalable | Learning curve | ✅ Enterprise-ready |
| **Fastify** | Very fast, TypeScript support | Smaller ecosystem | Good alternative |

### Recommended Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Next.js 14+ (App Router) + React + Tailwind CSS            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                               │
│  Next.js API Routes OR Express.js/NestJS                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   PostgreSQL │  │    Redis     │  │  Cloudinary  │
│   (Prisma)   │  │   (Cache)    │  │   (Images)   │
└──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 External Services                            │
│  • Stripe/PayHere (Payments)                                │
│  • SendGrid/Resend (Email)                                  │
│  • Google OAuth (Social Login)                              │
│  • Twilio (SMS - optional)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Database

**PostgreSQL** with **Prisma ORM**
- Type-safe queries
- Migrations
- Relations support
- Works perfectly with Next.js

### Caching

**Redis** for:
- Session storage
- Rate limiting
- Caching frequently accessed data
- Real-time features (future)

### File Storage

**Cloudinary** or **AWS S3** for:
- Event images
- Artist photos
- Product images
- Store covers

### Payments (Sri Lanka Focused)

| Provider | For | Integration |
|----------|-----|-------------|
| **PayHere** | Local payments (Card, Bank, Mobile) | REST API |
| **Stripe** | International cards | Stripe SDK |
| **iPay** | Mobile wallets (Dialog, Mobitel) | REST API |

---

## 10. Implementation Roadmap

### Phase 1: Core Backend Setup (Week 1-2)

- [ ] Initialize backend project (Express.js or NestJS)
- [ ] Set up PostgreSQL database
- [ ] Configure Prisma with schema
- [ ] Implement authentication (JWT)
  - [ ] Register endpoint
  - [ ] Login endpoint
  - [ ] Session management
  - [ ] Middleware
- [ ] Create basic CRUD for:
  - [ ] Users
  - [ ] Events
  - [ ] Artists
  - [ ] Academies
  - [ ] Products/Stores

### Phase 2: Frontend Integration (Week 3)

- [ ] Create API client utility
- [ ] Replace mock data calls with real API calls
- [ ] Update AuthContext to use API
- [ ] Update server actions
- [ ] Test all pages with real data

### Phase 3: User Features (Week 4)

- [ ] Implement Interest/Follow system
- [ ] Create Cart functionality
- [ ] Build Order system
- [ ] Add Academy Enquiry system
- [ ] User profile management

### Phase 4: Dashboard Features (Week 5)

- [ ] Organizer Dashboard
  - [ ] Event management
  - [ ] Ticket sales view
  - [ ] Analytics
- [ ] Artist Dashboard
  - [ ] Profile editing
  - [ ] Stats view
- [ ] Admin Panel (basic)

### Phase 5: Advanced Features (Week 6+)

- [ ] Payment integration
- [ ] Email notifications
- [ ] Image upload
- [ ] Search optimization
- [ ] Caching layer
- [ ] Rate limiting
- [ ] API documentation (Swagger)

### Phase 6: Production Readiness

- [ ] Security audit
- [ ] Performance optimization
- [ ] Error handling & logging
- [ ] Monitoring setup
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## Quick Reference: File-to-API Mapping

| Frontend File | Needs API | Endpoint |
|---------------|-----------|----------|
| `page.tsx` (Home) | Events, Artists, Products, Trending | Multiple GET endpoints |
| `events/page.tsx` | Events list | `GET /api/events` |
| `events/[slug]/page.tsx` | Event detail | `GET /api/events/:id` |
| `artists/page.tsx` | Artists list | `GET /api/artists` |
| `artists/[slug]/page.tsx` | Artist detail | `GET /api/artists/:id` |
| `academies/page.tsx` | Academies list | `GET /api/academies` |
| `academies/[id]/page.tsx` | Academy detail | `GET /api/academies/:id` |
| `marketplace/page.tsx` | Products list | `GET /api/products` |
| `products/[id]/page.tsx` | Product detail | `GET /api/products/:id` |
| `profile/page.tsx` | User profile | `GET /api/users/me` |
| `dashboard/page.tsx` | Dashboard stats | `GET /api/dashboard/stats` |
| `dashboard/organizer/page.tsx` | Organizer events | `GET /api/dashboard/organizer/events` |
| `actions/auth.ts` | Auth actions | `POST /api/auth/*` |
| `actions/event.ts` | Create event | `POST /api/events` |
| `EventActions.tsx` | Interest toggle | `POST /api/events/:id/interest` |
| `ArtistActions.tsx` | Follow toggle | `POST /api/artists/:id/follow` |
| `AddToCartButton.tsx` | Add to cart | `POST /api/cart` |
| `AcademyActions.tsx` | Enquiry | `POST /api/academies/:id/enquiry` |

---

## Appendix: Component Dependencies

### Components Requiring Authentication

| Component | Required Auth | Action When Not Authenticated |
|-----------|---------------|-------------------------------|
| `EventActions` | Yes | Opens AuthModal |
| `ArtistActions` | Yes | Opens AuthModal |
| `AddToCartButton` | Yes | Opens AuthModal |
| `AcademyActions` | Yes | Opens AuthModal |
| `ProtectedButton` | Yes | Opens AuthModal |

### Protected Routes

| Route | Required Role | Redirect If Unauthorized |
|-------|---------------|-------------------------|
| `/profile` | Any authenticated | `/login` |
| `/dashboard` | Any authenticated | `/login` |
| `/dashboard/organizer` | ORGANIZER | `/dashboard` |
| `/dashboard/organizer/create` | ORGANIZER | `/dashboard` |
| `/dashboard/artist` | ARTIST | `/dashboard` |
| `/dashboard/orders` | Any authenticated | `/login` |

---

*This guide was generated from the Rasaswadaya frontend codebase. Last updated: January 2026*
