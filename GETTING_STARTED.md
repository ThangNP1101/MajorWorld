# 🚀 Getting Started Guide

This guide will help you set up and run the MajorWorld Hybrid App project for the first time.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (Install: `npm install -g pnpm`)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

### For Mobile Development:

**iOS (Mac only):**

- **Xcode** 14+ (from App Store)
- **CocoaPods** (Install: `sudo gem install cocoapods`)

**Android:**

- **Android Studio** ([Download](https://developer.android.com/studio))
- **Java Development Kit (JDK)** 17

---

## 🏁 Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd MajorWorld

# Install all dependencies
pnpm install
```

---

## 🗄️ Step 2: Setup Database

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis containers
pnpm docker:up

# Verify containers are running
docker ps
```

You should see:

- `majorworld-postgres` on port 5432
- `majorworld-redis` on port 6379
- `majorworld-adminer` on port 8080 (Database UI)

### Option B: Local Installation

If you prefer to install PostgreSQL locally:

1. Install PostgreSQL 15+
2. Create database:

```sql
CREATE DATABASE majorworld;
CREATE USER majorworld WITH PASSWORD 'majorworld123';
GRANT ALL PRIVILEGES ON DATABASE majorworld TO majorworld;
```

---

## 🔧 Step 3: Configure Environment Variables

### Backend (.env)

Create `apps/backend/.env`:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=majorworld
DATABASE_PASSWORD=majorworld123
DATABASE_NAME=majorworld

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Firebase (get from Firebase Console)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=majorworld-assets

# App Config
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
MOBILE_WEBVIEW_URL=https://your-shopping-mall.com
```

### Admin Panel (.env.local)

Create `apps/admin/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Mobile App (.env)

Create `apps/mobile/.env`:

```bash
API_URL=http://localhost:3001/api
MOBILE_WEBVIEW_URL=https://your-shopping-mall.com
```

---

## 📦 Step 4: Run Database Migrations

```bash
# Run migrations to create tables
pnpm db:migrate

# Seed initial data (default colors, menus, etc.)
pnpm db:seed
```

✅ **Verify**: Visit http://localhost:8080 (Adminer) and login:

- System: **PostgreSQL**
- Server: **postgres**
- Username: **majorworld**
- Password: **majorworld123**
- Database: **majorworld**

You should see 7 tables: `app_configs`, `bottom_menus`, `splash_images`, etc.

---

## 🎯 Step 5: Run the Applications

Open **3 separate terminal windows**:

### Terminal 1: Backend API

```bash
pnpm dev:backend
```

✅ Backend running at: **http://localhost:3001**  
✅ API Docs (Swagger): **http://localhost:3001/api**

### Terminal 2: Admin Panel

```bash
pnpm dev:admin
```

✅ Admin Panel running at: **http://localhost:3000**

### Terminal 3: Mobile App (choose one)

**For iOS Simulator (Mac only):**

```bash
cd apps/mobile
pod install --project-directory=ios
cd ../..
pnpm dev:mobile

# In another terminal:
pnpm ios
```

**For Android Emulator:**

```bash
pnpm dev:mobile

# In another terminal:
pnpm android
```

---

## 🧪 Step 6: Test the Flow

### Test 1: Admin → Backend

1. Open Admin Panel: http://localhost:3000
2. Go to **"Set up your app design"**
3. Change the **"Tap menu background color"** to a different color
4. Click **"Save your settings"**
5. Verify in terminal that the API call succeeded

### Test 2: Backend → Mobile

1. Open API endpoint in browser: http://localhost:3001/api/v1/app/config
2. You should see JSON with your saved colors:

```json
{
  "theme": {
    "tapMenuBg": "#9f7575",
    "statusBarBg": "#000000",
    "titleBarBg": "#FFFFFF"
  },
  "menus": [...]
}
```

### Test 3: Mobile App

1. If mobile app is running, **reload it** (Cmd+R on iOS, RR on Android)
2. You should see the **bottom tab bar** with the color you set
3. Tap each menu item - it should load your website in WebView

---

## 🔥 Step 7: Setup Firebase (for Push Notifications)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: **"MajorWorld"**
3. Add iOS app:
   - Bundle ID: `com.majorworld.app`
   - Download `GoogleService-Info.plist`
   - Place in `apps/mobile/ios/`
4. Add Android app:
   - Package name: `com.majorworld.app`
   - Download `google-services.json`
   - Place in `apps/mobile/android/app/`

### 2. Get Firebase Admin SDK Credentials

1. In Firebase Console → Project Settings → Service Accounts
2. Click **"Generate new private key"**
3. Download JSON file
4. Copy credentials to `apps/backend/.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

### 3. Test Push Notification

```bash
# Run backend
pnpm dev:backend

# In Firebase Console → Cloud Messaging → Send test message
# Target: Your device FCM token (check mobile app logs)
```

---

## 📱 Step 8: Build Mobile App for Testing

### iOS (TestFlight)

```bash
cd apps/mobile/ios
open MajorWorld.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device (arm64)"
# 2. Product → Archive
# 3. Distribute App → App Store Connect
# 4. Upload to TestFlight
```

### Android (Play Console)

```bash
cd apps/mobile/android
./gradlew bundleRelease

# Upload to Google Play Console:
# Release → Testing → Internal testing → Create release
# Upload: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🎨 Next Steps

Now that everything is running, you can:

1. **Customize the Admin Panel**

   - Implement remaining pages (Push Management, Statistics)
   - Add image upload functionality
   - Build drag-and-drop menu builder

2. **Enhance the Mobile App**

   - Add Firebase push notification handling
   - Implement deep link routing
   - Add Airbridge SDK for deferred deep links
   - Create native splash screen

3. **Improve Backend**
   - Implement push notification queue system (Bull)
   - Add authentication & authorization
   - Create image upload endpoints (S3)
   - Build push statistics aggregation

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if PostgreSQL is running
docker ps

# Check database connection
psql -h localhost -U majorworld -d majorworld
```

### Admin panel shows API errors

```bash
# Check backend is running
curl http://localhost:3001/api/v1/app/config

# Check CORS settings in apps/backend/src/main.ts
```

### Mobile app won't connect to API

**iOS Simulator:**

- Use `http://localhost:3001`

**Android Emulator:**

- Use `http://10.0.2.2:3001` (Android emulator host IP)

**Physical Device:**

- Use your computer's local IP: `http://192.168.x.x:3001`
- Ensure device is on same WiFi network

### Database migration fails

```bash
# Reset database
pnpm docker:down
pnpm docker:up

# Run migrations again
pnpm db:migrate
pnpm db:seed
```

---

## 📚 Additional Resources

- **NestJS Docs**: https://docs.nestjs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **Firebase Setup**: https://rnfirebase.io/
- **TypeORM Migrations**: https://typeorm.io/migrations

---

## 💡 Tips for Development

1. **Use Adminer** (http://localhost:8080) to inspect database tables
2. **Check Swagger docs** (http://localhost:3001/api) for API endpoints
3. **Enable React Native debugging**: Cmd+D (iOS) or Cmd+M (Android) → Enable Debug
4. **Hot reload**: Edit code and see changes instantly (both admin & mobile)
5. **Check logs**: All terminal windows show helpful logs

---

## 🤝 Need Help?

If you encounter issues:

1. Check terminal logs for error messages
2. Verify all environment variables are set
3. Ensure Docker containers are running
4. Try restarting all services

Good luck building your hybrid app! 🚀
