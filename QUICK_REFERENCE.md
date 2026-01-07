# ⚡ Quick Reference Card

## 🚀 Common Commands

### Setup (First Time Only)

```bash
pnpm install                  # Install all dependencies
pnpm docker:up               # Start PostgreSQL + Redis
pnpm db:migrate              # Create database tables
pnpm db:seed                 # Insert initial data
```

### Daily Development

```bash
# Terminal 1: Backend
pnpm dev:backend

# Terminal 2: Admin
pnpm dev:admin

# Terminal 3: Mobile
pnpm dev:mobile
pnpm ios                     # Run on iOS simulator
pnpm android                 # Run on Android emulator
```

### Database Operations

```bash
pnpm db:migrate              # Run migrations
pnpm db:seed                 # Seed data
pnpm docker:up               # Start database
pnpm docker:down             # Stop database
```

### Build for Production

```bash
pnpm build:backend           # Build backend API
pnpm build:admin             # Build admin panel
pnpm build:mobile            # Build mobile apps
```

---

## 📍 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:3001 | REST API |
| API Docs | http://localhost:3001/api | Swagger UI |
| Admin Panel | http://localhost:3000 | Admin dashboard |
| Adminer (DB UI) | http://localhost:8080 | Database viewer |

---

## 🔑 Key Endpoints

### Mobile API
```
GET  /api/v1/app/config              # Get app configuration
POST /api/v1/device/register         # Register FCM token
POST /api/v1/push/opened             # Track push opened
```

### Admin API
```
GET  /api/admin/app-design           # Get theme colors
PUT  /api/admin/app-design/colors    # Update colors
```

---

## 📂 Project Structure

```
apps/
├── backend/        # NestJS API
├── admin/          # Next.js Admin
└── mobile/         # React Native App
```

---

## 🐛 Quick Fixes

### Backend won't start
```bash
# Check database is running
docker ps

# Restart database
pnpm docker:down && pnpm docker:up

# Check environment variables
cat apps/backend/.env
```

### Admin shows errors
```bash
# Check backend is running
curl http://localhost:3001/api/v1/app/config

# Clear cache and restart
cd apps/admin
rm -rf .next
pnpm dev
```

### Mobile app won't connect
```bash
# iOS Simulator
Use: http://localhost:3001

# Android Emulator
Use: http://10.0.2.2:3001

# Physical Device
Use: http://192.168.x.x:3001 (your local IP)
```

### Database issues
```bash
# Reset everything
pnpm docker:down
docker volume rm majorworld_postgres_data
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

---

## 🔧 Environment Variables

### Backend (.env)
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=majorworld
DATABASE_PASSWORD=majorworld123
DATABASE_NAME=majorworld
```

### Admin (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📦 Package Manager (pnpm)

```bash
pnpm install                 # Install deps (root)
pnpm add <pkg>               # Add to root
pnpm --filter backend add <pkg>  # Add to specific app
pnpm run <script>            # Run root script
```

---

## 🧪 Testing Flow

1. **Change color in admin** → http://localhost:3000
2. **Check API response** → http://localhost:3001/api/v1/app/config
3. **Reload mobile app** → See new color

---

## 📱 Mobile Development

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

### Reload App
- iOS: `Cmd + R`
- Android: `RR` (double R)

### Open Developer Menu
- iOS: `Cmd + D`
- Android: `Cmd + M`

---

## 🗄️ Database Access

### Using Adminer (GUI)
1. Visit http://localhost:8080
2. System: **PostgreSQL**
3. Server: **postgres**
4. Username: **majorworld**
5. Password: **majorworld123**
6. Database: **majorworld**

### Using CLI
```bash
docker exec -it majorworld-postgres psql -U majorworld -d majorworld
```

---

## 🔄 Git Workflow

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

---

## 📝 File Locations

### Configuration
- Backend env: `apps/backend/.env`
- Admin env: `apps/admin/.env.local`
- Mobile env: `apps/mobile/.env`

### Key Files
- Database schema: `apps/backend/src/database/migrations/`
- App design page: `apps/admin/src/app/app-design/page.tsx`
- Mobile config: `apps/mobile/src/services/api.ts`

---

## 💡 Pro Tips

1. **Use Adminer** to quickly check database state
2. **Check Swagger** for API endpoint documentation
3. **Enable hot reload** in mobile for faster development
4. **Use React Query DevTools** in admin for debugging
5. **Check terminal logs** when something breaks

---

## 🎯 Common Tasks

### Add a new admin page
1. Create `apps/admin/src/app/[page-name]/page.tsx`
2. Add route to `Sidebar.tsx`
3. Create API endpoint in backend
4. Use React Query to fetch data

### Add a new API endpoint
1. Create module in `apps/backend/src/modules/`
2. Add controller, service, entity
3. Import in `app.module.ts`
4. Test at http://localhost:3001/api

### Update database schema
1. Modify entity in `apps/backend/src/modules/*/entities/`
2. Generate migration: `pnpm --filter backend migration:generate`
3. Run migration: `pnpm db:migrate`

---

## 📞 Need Help?

See full documentation:
- `README.md` - Project overview
- `GETTING_STARTED.md` - Detailed setup
- `PROJECT_SUMMARY.md` - What's implemented

---

**Keep this file handy for daily development!** 📌

