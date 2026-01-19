# Push Management Testing Guide

## 📋 Table of Contents

1. [Testing Approach](#testing-approach)
2. [Testing Todos](#testing-todos)
3. [Firebase Setup](#firebase-setup)
4. [Mock Data Setup](#mock-data-setup)
5. [Step-by-Step Testing Procedures](#step-by-step-testing-procedures)
6. [API Testing with Swagger/Postman](#api-testing-with-swaggerpostman)
7. [Frontend Testing](#frontend-testing)
8. [End-to-End Testing](#end-to-end-testing)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Testing Approach

### Testing Strategy

1. **Unit Testing** (Backend Service Logic)

   - Test CRUD operations
   - Test validation logic
   - Test business rules
   - Mock Firebase Admin SDK

2. **Integration Testing** (API Endpoints)

   - Test all REST endpoints
   - Test request/response formats
   - Test error handling
   - Test authentication (if applicable)

3. **Frontend Testing** (UI Components)

   - Test form validation
   - Test user interactions
   - Test data fetching
   - Test error states

4. **End-to-End Testing** (Full Flow)

   - Create message → Send → Verify delivery
   - Schedule message → Process → Verify
   - Test with real/mock device tokens

5. **Firebase Integration Testing**
   - Test with Firebase test project
   - Verify FCM message format
   - Test with real device tokens (optional)

---

## ✅ Testing Todos

### Phase 1: Environment Setup

- [ ] Setup Firebase project
- [ ] Configure Firebase Admin SDK credentials
- [ ] Setup test database
- [ ] Create mock device tokens
- [ ] Verify backend can connect to Firebase

### Phase 2: Backend API Testing

- [ ] Test GET `/admin/push-messages` (list all)
- [ ] Test GET `/admin/push-messages/scheduled` (scheduled only)
- [ ] Test GET `/admin/push-messages/stats` (device counts)
- [ ] Test GET `/admin/push-messages/:id` (get by ID)
- [ ] Test POST `/admin/push-messages` (create)
- [ ] Test PUT `/admin/push-messages/:id` (update)
- [ ] Test DELETE `/admin/push-messages/:id` (delete)
- [ ] Test POST `/admin/push-messages/:id/send` (send immediately)
- [ ] Test POST `/admin/push-messages/:id/test` (test send)
- [ ] Test POST `/admin/push-messages/:id/upload/image` (image upload)

### Phase 3: Validation Testing

- [ ] Test title validation (required, max 100 chars)
- [ ] Test message validation (at least one required)
- [ ] Test scheduled time validation (must be future)
- [ ] Test target selection (all/android/ios)
- [ ] Test status transitions
- [ ] Test update restrictions (can't update sent messages)
- [ ] Test delete restrictions (can't delete sent messages)

### Phase 4: Frontend Testing

- [ ] Test compose form (all fields)
- [ ] Test target selection with device counts
- [ ] Test preview sidebar (Android & iOS)
- [ ] Test image upload and preview
- [ ] Test immediate vs scheduled dispatch
- [ ] Test scheduled messages list
- [ ] Test delete scheduled message
- [ ] Test form validation errors
- [ ] Test loading states
- [ ] Test error handling

### Phase 5: Firebase Integration Testing

- [ ] Test FCM message format (Android)
- [ ] Test FCM message format (iOS)
- [ ] Test BigText for Android
- [ ] Test image attachment
- [ ] Test deep link handling
- [ ] Test batch sending
- [ ] Test error handling (invalid tokens)

### Phase 6: End-to-End Testing

- [ ] Create and send immediate message
- [ ] Create and schedule message
- [ ] Verify scheduled message appears in list
- [ ] Delete scheduled message
- [ ] Test with real device (optional)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select existing project
3. Enter project name: `MajorWorld` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Cloud Messaging

1. In Firebase Console, go to **Build** → **Cloud Messaging**
2. If not enabled, click **"Enable"**
3. Note the **Server key** (for legacy API, not needed for Admin SDK)

### Step 3: Get Firebase Admin SDK Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. A JSON file will download (e.g., `majorworld-firebase-adminsdk-xxxxx.json`)

### Step 4: Configure Backend Environment

Add to `apps/backend/.env`:

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**

- `FIREBASE_PRIVATE_KEY` must include the full key with `\n` characters
- Wrap the entire key in double quotes
- The key should be on a single line with `\n` for newlines
- Example format:
  ```
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
  ```

### Step 5: Verify Firebase Connection

1. Start backend: `pnpm dev:backend`
2. Check console logs for:
   - ✅ "Firebase Admin initialized successfully" (if you add logging)
   - ❌ "Firebase Admin initialization failed" (if there's an error)

### Step 6: Test Firebase Connection (Optional)

You can test Firebase connection by checking if the service initializes:

```bash
# In backend terminal, you should see no Firebase errors
# If you see warnings, check your .env file
```

---

## 🎭 Mock Data Setup

### Option 1: Database Seeding (Recommended)

Create a seed script or use SQL to insert test data:

#### Mock Device Tokens
 
```sql
-- Insert test Android device tokens
INSERT INTO device_tokens (fcm_token, platform, is_active, created_at, updated_at)
VALUES
  ('test-android-token-1', 'android', true, NOW(), NOW()),
  ('test-android-token-2', 'android', true, NOW(), NOW()),
  ('test-android-token-3', 'android', true, NOW(), NOW());

-- Insert test iOS device tokens
INSERT INTO device_tokens (fcm_token, platform, is_active, created_at, updated_at)
VALUES
  ('test-ios-token-1', 'ios', true, NOW(), NOW()),
  ('test-ios-token-2', 'ios', true, NOW(), NOW()),
  ('test-ios-token-3', 'ios', true, NOW(), NOW());

-- Insert inactive tokens (for testing)
INSERT INTO device_tokens (fcm_token, platform, is_active, created_at, updated_at)
VALUES
  ('inactive-android-token', 'android', false, NOW(), NOW()),
  ('inactive-ios-token', 'ios', false, NOW(), NOW());
```

#### Mock Push Messages

```sql
-- Insert draft message
INSERT INTO push_messages (
  title, android_message, ios_message, target, status, send_type,
  created_at, updated_at
)
VALUES (
  'Test Draft Message',
  'This is a test Android message',
  'This is a test iOS message',
  'all',
  'draft',
  'immediate',
  NOW(),
  NOW()
);

-- Insert scheduled message
INSERT INTO push_messages (
  title, android_message, ios_message, target, status, send_type, scheduled_at,
  created_at, updated_at
)
VALUES (
  'Test Scheduled Message',
  'This is a scheduled Android message',
  'This is a scheduled iOS message',
  'android',
  'scheduled',
  'scheduled',
  NOW() + INTERVAL '1 day',
  NOW(),
  NOW()
);

-- Insert sent message (for testing history)
INSERT INTO push_messages (
  title, android_message, ios_message, target, status, send_type,
  sent_at, total_sent, created_at, updated_at
)
VALUES (
  'Test Sent Message',
  'This message was already sent',
  'This message was already sent',
  'all',
  'sent',
  'immediate',
  NOW() - INTERVAL '1 day',
  5,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day'
);
```

### Option 2: Using API to Create Test Data

You can use the API endpoints to create test data:

```bash
# Create a test push message
curl -X POST http://localhost:3001/api/admin/push-messages \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Message",
    "androidMessage": "Test Android message",
    "iosMessage": "Test iOS message",
    "target": "all",
    "sendType": "immediate"
  }'
```

### Option 3: Using Swagger UI

1. Open http://localhost:3001/api
2. Navigate to **Admin - Push Messages** section
3. Use the **POST /admin/push-messages** endpoint
4. Fill in the request body
5. Click **"Execute"**

---

## 📝 Step-by-Step Testing Procedures

### Test 1: Verify Device Statistics Endpoint

**Goal:** Verify device counts are returned correctly

**Steps:**

1. Ensure backend is running: `pnpm dev:backend`
2. Open browser or use curl:
   ```bash
   curl http://localhost:3001/api/admin/push-messages/stats
   ```
3. **Expected Response:**
   ```json
   {
     "total": 6,
     "android": 3,
     "ios": 3
   }
   ```
4. **Verify:** Counts match your mock data

---

### Test 2: Create a Draft Push Message

**Goal:** Create a push message without sending it

**Steps:**

1. Open Swagger UI: http://localhost:3001/api
2. Navigate to **POST /admin/push-messages**
3. Use this request body:
   ```json
   {
     "title": "Test Draft Message",
     "androidMessage": "This is a test message for Android users",
     "iosMessage": "This is a test message for iOS users",
     "target": "all",
     "sendType": "immediate"
   }
   ```
4. Click **"Execute"**
5. **Expected Response:** Status 201 with created message object
6. **Verify:**
   - Status is `"draft"`
   - All fields are saved correctly
   - `id` is generated

---

### Test 3: Create a Scheduled Push Message

**Goal:** Create a message scheduled for future delivery

**Steps:**

1. In Swagger UI, use **POST /admin/push-messages**
2. Use this request body:
   ```json
   {
     "title": "Scheduled Test Message",
     "androidMessage": "This will be sent later",
     "iosMessage": "This will be sent later",
     "target": "android",
     "sendType": "scheduled",
     "scheduledAt": "2025-12-31T10:00:00Z"
   }
   ```
3. **Expected Response:** Status 201
4. **Verify:**
   - Status is `"scheduled"`
   - `scheduledAt` is saved
   - Message appears in scheduled list

---

### Test 4: Get Scheduled Messages

**Goal:** Retrieve list of scheduled messages

**Steps:**

1. Use **GET /admin/push-messages/scheduled**
2. **Expected Response:** Array of scheduled messages
3. **Verify:**
   - Only scheduled messages are returned
   - Sorted by `scheduledAt` (ascending)

---

### Test 5: Update a Push Message

**Goal:** Modify an existing draft/scheduled message

**Steps:**

1. Create a message first (Test 2)
2. Note the `id` from response
3. Use **PUT /admin/push-messages/:id**
4. Update request body:
   ```json
   {
     "title": "Updated Title",
     "androidMessage": "Updated Android message"
   }
   ```
5. **Expected Response:** Updated message
6. **Verify:** Changes are saved

---

### Test 6: Delete a Scheduled Message

**Goal:** Remove a scheduled message

**Steps:**

1. Create a scheduled message (Test 3)
2. Note the `id`
3. Use **DELETE /admin/push-messages/:id**
4. **Expected Response:** Status 200
5. **Verify:** Message no longer appears in scheduled list

---

### Test 7: Send Immediate Push Message

**Goal:** Send a push message immediately

**Prerequisites:**

- Firebase is configured
- At least one active device token exists
- Message is in `draft` status

**Steps:**

1. Create a draft message (Test 2)
2. Note the `id`
3. Use **POST /admin/push-messages/:id/send**
4. **Expected Response:** Status 200 with updated message
5. **Verify:**
   - Status changed to `"sent"`
   - `sentAt` is set
   - `totalSent` is updated
   - Check Firebase Console → Cloud Messaging for delivery logs

**Note:** If Firebase is not configured, you'll get an error. This is expected.

---

### Test 8: Upload Image for Push Message

**Goal:** Attach an image to a push message

**Steps:**

1. Create a message first (Test 2)
2. Note the `id`
3. Use **POST /admin/push-messages/:id/upload/image**
4. Select an image file (800x464 recommended)
5. **Expected Response:** Status 200 with updated message
6. **Verify:**
   - `imageUrl` is set
   - Image is accessible at the URL

---

### Test 9: Test Send (Test Devices)

**Goal:** Send test push to specific devices

**Prerequisites:**

- Message exists
- Test device tokens are registered

**Steps:**

1. Get device token IDs from database:
   ```sql
   SELECT id, fcm_token, platform FROM device_tokens WHERE is_active = true;
   ```
2. Create a message (Test 2)
3. Use **POST /admin/push-messages/:id/test**
4. Request body:
   ```json
   {
     "deviceTokenIds": [1, 2, 3]
   }
   ```
5. **Expected Response:** Status 200
6. **Verify:** Test notifications are sent (check Firebase logs)

---

### Test 10: Validation Errors

**Goal:** Verify validation works correctly

**Test Cases:**

1. **Missing Title:**

   ```json
   {
     "androidMessage": "Test",
     "target": "all",
     "sendType": "immediate"
   }
   ```

   **Expected:** 400 Bad Request

2. **No Messages:**

   ```json
   {
     "title": "Test",
     "target": "all",
     "sendType": "immediate"
   }
   ```

   **Expected:** 400 Bad Request - "At least one message is required"

3. **Scheduled Without Time:**

   ```json
   {
     "title": "Test",
     "androidMessage": "Test",
     "sendType": "scheduled"
   }
   ```

   **Expected:** 400 Bad Request

4. **Past Scheduled Time:**

   ```json
   {
     "title": "Test",
     "androidMessage": "Test",
     "sendType": "scheduled",
     "scheduledAt": "2020-01-01T10:00:00Z"
   }
   ```

   **Expected:** 400 Bad Request - "Scheduled time must be in the future"

5. **Update Sent Message:**
   - Create and send a message
   - Try to update it
     **Expected:** 400 Bad Request - "Cannot update a message that has already been sent"

---

## 🌐 API Testing with Swagger/Postman

### Using Swagger UI

1. **Access Swagger:**

   - URL: http://localhost:3001/api
   - All endpoints are documented with examples

2. **Test Flow:**
   - Start with `GET /admin/push-messages/stats` to verify setup
   - Create a message with `POST /admin/push-messages`
   - View it with `GET /admin/push-messages/:id`
   - Update it with `PUT /admin/push-messages/:id`
   - Send it with `POST /admin/push-messages/:id/send`

### Using Postman

1. **Import Collection:**

   - Create a new collection: "Push Management"
   - Add requests for each endpoint
   - Set base URL: `http://localhost:3001/api`

2. **Environment Variables:**

   ```
   base_url: http://localhost:3001/api
   message_id: (set after creating a message)
   ```

3. **Test Scripts:**
   - Add tests to verify response status
   - Extract IDs for chained requests

---

## 🖥️ Frontend Testing

### Test 1: Load Push Management Page

**Steps:**

1. Start admin panel: `pnpm dev:admin`
2. Navigate to: http://localhost:3000/push-management
3. **Verify:**
   - Page loads without errors
   - Device stats are displayed
   - Tabs are visible (Compose / Scheduled)

### Test 2: Compose Form

**Steps:**

1. Fill in the compose form:
   - Title: "Test Notification"
   - Android Message: "Test Android"
   - iOS Message: "Test iOS"
   - Target: Select "All"
   - Send Type: "Immediate"
2. **Verify:**
   - Preview updates in real-time
   - Form validation works
   - Submit button is enabled

### Test 3: Image Upload

**Steps:**

1. Click "Upload an image"
2. Select an image file
3. **Verify:**
   - Image preview appears
   - File name is displayed
   - Image is shown in preview

### Test 4: Scheduled Message

**Steps:**

1. Select "Send a reservation"
2. Choose a future date/time
3. Fill in message details
4. Click "Shipping"
5. **Verify:**
   - Success message appears
   - Form resets
   - Message appears in "Scheduled" tab

### Test 5: Scheduled Messages List

**Steps:**

1. Click "Scheduled to be shipped" tab
2. **Verify:**
   - Scheduled messages are listed
   - Date/time is formatted correctly
   - Target is displayed
   - Delete button works

### Test 6: Form Validation

**Test Cases:**

1. Submit without title → Error message
2. Submit without any message → Error message
3. Schedule without date → Error message
4. **Verify:** Error messages are displayed

---

## 🔄 End-to-End Testing

### E2E Test 1: Create and Send Immediate Message

**Flow:**

1. Open admin panel
2. Navigate to Push Management
3. Fill compose form
4. Select "Immediate Dispatch"
5. Click "Shipping"
6. **Verify:**
   - Message is created
   - Message is sent immediately
   - Success notification appears
   - Check Firebase logs for delivery

### E2E Test 2: Create and Schedule Message

**Flow:**

1. Fill compose form
2. Select "Send a reservation"
3. Set future date/time
4. Click "Shipping"
5. Switch to "Scheduled" tab
6. **Verify:**
   - Message appears in scheduled list
   - Can delete it
   - Status is "Booked"

### E2E Test 3: Update Scheduled Message

**Flow:**

1. Create scheduled message
2. Note the ID
3. Use API to update it
4. **Verify:**
   - Changes are saved
   - Scheduled time can be updated

---

## 🐛 Troubleshooting

### Issue: Firebase Admin Not Initialized

**Symptoms:**

- Error: "Firebase Admin is not initialized"
- Warning in console logs

**Solutions:**

1. Check `.env` file exists and has correct values
2. Verify `FIREBASE_PRIVATE_KEY` includes `\n` characters
3. Ensure private key is wrapped in quotes
4. Restart backend server

### Issue: No Device Tokens Found

**Symptoms:**

- Error: "No active device tokens found"
- Device stats show 0

**Solutions:**

1. Insert mock device tokens (see Mock Data Setup)
2. Verify tokens have `is_active = true`
3. Check database connection

### Issue: Image Upload Fails

**Symptoms:**

- Error uploading image
- Image URL not saved

**Solutions:**

1. Check AWS S3 configuration
2. Verify `UploadModule` is imported
3. Check file size limits
4. Verify file format is supported

### Issue: Scheduled Messages Not Processing

**Symptoms:**

- Scheduled messages not sending at scheduled time

**Solutions:**

1. Implement cron job or queue processor
2. Call `processScheduledMessages()` periodically
3. Check scheduled time is in the future
4. Verify database timezone settings

### Issue: Frontend Not Loading Data

**Symptoms:**

- Empty lists
- Loading forever
- Network errors

**Solutions:**

1. Check backend is running
2. Verify API base URL in `.env`
3. Check CORS settings
4. Open browser console for errors
5. Check network tab for failed requests

### Issue: Validation Errors Not Showing

**Symptoms:**

- Form submits but fails silently
- No error messages

**Solutions:**

1. Check browser console
2. Verify error handling in mutations
3. Check API response format
4. Verify alert/notification system works

---

## 📊 Testing Checklist Summary

### Backend API

- [ ] All CRUD endpoints work
- [ ] Validation works correctly
- [ ] Error handling is proper
- [ ] Device stats are accurate
- [ ] Firebase integration works (if configured)

### Frontend UI

- [ ] Page loads correctly
- [ ] Forms work and validate
- [ ] Preview updates in real-time
- [ ] Image upload works
- [ ] Scheduled messages list works
- [ ] Delete functionality works
- [ ] Error messages display

### Integration

- [ ] Create → Send flow works
- [ ] Create → Schedule flow works
- [ ] Update → Save works
- [ ] Delete → Remove works
- [ ] Image upload → Save works

### Firebase (if configured)

- [ ] Messages are sent to FCM
- [ ] Android format is correct
- [ ] iOS format is correct
- [ ] BigText works for Android
- [ ] Images are attached
- [ ] Deep links are included

---

## 🎯 Next Steps After Testing

1. **Fix any bugs found**
2. **Document edge cases**
3. **Set up monitoring/alerts**
4. **Implement scheduled job processor**
5. **Add analytics tracking**
6. **Performance testing with large datasets**
7. **Security audit**

---

_Last Updated: 2025-01-15_
