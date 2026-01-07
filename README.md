# MajorWorld Hybrid App

A complete hybrid app solution with NestJS backend, Next.js admin panel, and React Native mobile app.

## 🏗️ Project Structure

```
majorworld/
├── apps/
│   ├── backend/          # NestJS API
│   ├── admin/            # Next.js Admin Panel
│   └── mobile/           # React Native App
├── packages/
│   └── shared/           # Shared types & utilities
├── docker-compose.yml    # PostgreSQL + Redis
└── pnpm-workspace.yaml   # Monorepo config
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 2. Installation

```bash
# Install dependencies
pnpm install

# Start database & Redis
pnpm docker:up

# Run migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed
```

### 3. Development

```bash
# Terminal 1: Run backend
pnpm dev:backend

# Terminal 2: Run admin panel
pnpm dev:admin

# Terminal 3: Run mobile app
pnpm dev:mobile
```

### 4. Access

- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:3000
- **Database UI**: http://localhost:8080 (Adminer)
- **API Docs**: http://localhost:3001/api

## 📱 Mobile App Setup

### iOS

```bash
cd apps/mobile
pod install --project-directory=ios
pnpm ios
```

### Android

```bash
cd apps/mobile
pnpm android
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` in each app directory and configure:

- Database credentials
- Firebase credentials (for push notifications)
- AWS S3 credentials (for image uploads)
- Airbridge token (for deep links)

## 📦 Tech Stack

### Backend (NestJS)
- **Framework**: NestJS
- **Database**: PostgreSQL + TypeORM
- **Queue**: Bull (Redis)
- **Auth**: JWT
- **Push**: Firebase Admin SDK
- **Storage**: AWS S3

### Admin Panel (Next.js)
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod
- **State**: React Query
- **Charts**: Recharts

### Mobile App (React Native)
- **Framework**: React Native
- **Navigation**: React Navigation
- **WebView**: react-native-webview
- **Push**: @react-native-firebase/messaging
- **Deep Links**: Airbridge SDK

## 🗄️ Database Schema

See `apps/backend/src/database/migrations/` for full schema.

Key tables:
- `app_configs`: Theme colors, UI settings
- `bottom_menus`: Navigation menu items
- `splash_images`: Device-specific splash screens
- `app_features`: Popup settings, social links
- `push_messages`: Push notification campaigns
- `device_tokens`: FCM tokens for push delivery
- `push_statistics`: Delivery & open tracking

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:3001/api
- Postman Collection: `apps/backend/postman/`

## 🧪 Testing

```bash
# Backend tests
pnpm --filter backend test

# Admin tests
pnpm --filter admin test

# E2E tests
pnpm --filter backend test:e2e
```

## 🚢 Deployment

### Backend (Railway/Render/AWS)
```bash
pnpm build:backend
```

### Admin Panel (Vercel)
```bash
pnpm build:admin
```

### Mobile App
```bash
# iOS: Upload to TestFlight
pnpm build:mobile

# Android: Upload to Play Console
cd apps/mobile/android
./gradlew bundleRelease
```

## 📖 Documentation

- [Backend API Docs](./apps/backend/README.md)
- [Admin Panel Guide](./apps/admin/README.md)
- [Mobile App Guide](./apps/mobile/README.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

Private - All rights reserved

