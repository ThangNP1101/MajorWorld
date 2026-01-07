# 🎯 Quick Install Instructions

Follow these steps to get your project running in **15 minutes**!

---

## Step 1: Install Prerequisites (5 min)

### Required:
- [Node.js 18+](https://nodejs.org/) - JavaScript runtime
- [pnpm](https://pnpm.io/) - Fast package manager
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - For PostgreSQL

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version    # Should show v18.x or higher
pnpm --version    # Should show 8.x or higher
docker --version  # Should show Docker version
```

### Optional (for mobile development):
- **Mac users**: [Xcode](https://apps.apple.com/app/xcode/id497799835) (from App Store)
- **Everyone**: [Android Studio](https://developer.android.com/studio)

---

## Step 2: Clone & Install (3 min)

```bash
# Navigate to your projects folder
cd ~/Developer  # or wherever you keep projects

# Clone the project (you're already here!)
cd MajorWorld

# Install all dependencies (backend, admin, mobile)
pnpm install
```

**⏳ Wait time:** 2-3 minutes (pnpm is fast!)

---

## Step 3: Start Database (1 min)

```bash
# Start PostgreSQL and Redis in Docker
pnpm docker:up
```

**✅ Success check:**
```bash
docker ps
```

You should see 3 containers running:
- `majorworld-postgres` (port 5432)
- `majorworld-redis` (port 6379)
- `majorworld-adminer` (port 8080)

---

## Step 4: Setup Database Schema (1 min)

```bash
# Create tables
pnpm db:migrate

# Insert sample data
pnpm db:seed
```

**✅ Success check:** Visit http://localhost:8080
- System: `PostgreSQL`
- Server: `postgres`
- Username: `majorworld`
- Password: `majorworld123`
- Database: `majorworld`

You should see 7 tables!

---

## Step 5: Create Environment Files (2 min)

### Backend

Create `apps/backend/.env`:

```bash
# Copy and paste this entire block:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=majorworld
DATABASE_PASSWORD=majorworld123
DATABASE_NAME=majorworld

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key-change-in-production

# These can be dummy values for now:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase@example.com
FIREBASE_PRIVATE_KEY="dummy-key"

AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=majorworld-assets

MOBILE_WEBVIEW_URL=https://example.com
```

### Admin

Create `apps/admin/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Step 6: Start Everything (3 min)

Open **3 terminal windows**:

### Terminal 1: Backend
```bash
pnpm dev:backend
```

**✅ Wait for:** `🚀 Backend running on: http://localhost:3001`

### Terminal 2: Admin Panel
```bash
pnpm dev:admin
```

**✅ Wait for:** `▲ Next.js 14... ready started server on http://localhost:3000`

### Terminal 3: Mobile (Optional - skip for now)
```bash
# We'll set this up later
```

---

## ✅ Step 7: Test It Works!

### Test 1: Check API

Open in browser: http://localhost:3001/api/v1/app/config

**Expected result:** JSON with colors and menus
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

### Test 2: Admin Panel

1. Open http://localhost:3000
2. You'll be redirected to **"Set up your app design"**
3. See the color picker and phone preview
4. Change **"Tap menu background color"** to any color
5. Click **"Save your settings"**
6. Check the phone mockup updates!

### Test 3: API Updated

1. Refresh http://localhost:3001/api/v1/app/config
2. See your new color in the JSON! 🎉

---

## 🎉 Success!

**You now have:**
- ✅ Backend API running with database
- ✅ Admin panel with working UI
- ✅ Database with sample data
- ✅ End-to-end data flow (admin → backend → database)

---

## 🚀 What's Next?

### Option A: Continue with Mobile App
Follow `GETTING_STARTED.md` → Step 8 (Setup Firebase & Mobile)

### Option B: Enhance Admin Panel
Start implementing the remaining pages:
- Push message management
- Splash image uploader
- Push statistics

### Option C: Learn the Codebase
Read `PROJECT_SUMMARY.md` to understand what's been built

---

## 🐛 Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "Docker is not running"
- Start Docker Desktop application
- Wait for Docker icon to show "running"

### Backend shows database error
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
pnpm docker:down
pnpm docker:up
pnpm db:migrate
```

### Admin shows "Network Error"
- Check backend is running (Terminal 1 should show no errors)
- Visit http://localhost:3001 to verify

### Port already in use
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

---

## 📞 Need Help?

1. Check if all terminals are running (no errors shown)
2. Verify Docker containers are up: `docker ps`
3. Check environment files are created correctly
4. Read `GETTING_STARTED.md` for detailed troubleshooting

---

## 🎯 Quick Command Reference

```bash
# Start services
pnpm docker:up       # Database
pnpm dev:backend     # Backend API
pnpm dev:admin       # Admin panel

# Database
pnpm db:migrate      # Create tables
pnpm db:seed         # Insert data

# Stop services
Ctrl+C in each terminal
pnpm docker:down     # Stop database
```

---

**Estimated total time: 15 minutes** ⏱️

**Next step:** Open http://localhost:3000 and start exploring! 🎨

