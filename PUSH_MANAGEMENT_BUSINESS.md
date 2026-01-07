# Push Message Management - Business Documentation

## Overview

The Push Message Management system enables administrators to create, schedule, and send push notifications to mobile app users. The system supports platform-specific messaging (Android and iOS), scheduling, test dispatching, and comprehensive tracking.

---

## Core Functionality

### 1. Message Composition

#### Target Audience Selection
- **All Users**: Send to all active device tokens regardless of platform
- **Android Only**: Send exclusively to Android devices
- **iOS Only**: Send exclusively to iOS devices

The system displays real-time device counts for each target option:
- Total active devices
- Android device count
- iOS device count

#### Message Content
- **Title** (Required, max 100 characters): The notification title displayed to users
- **Android Message**: Primary message content for Android notifications
- **Android BigText** (Optional): Expanded content shown when Android users expand the notification
- **iOS Message**: Message content for iOS notifications
- **Image Attachment** (Optional, 800x464 recommended): Visual content attached to the notification
- **Landing URL** (Optional): Deep link or web URL that opens when the notification is tapped
  - Supports deep links: `myapp://products/123`
  - Supports web URLs: `https://example.com/product/123`

#### Business Rules
- At least one message (Android or iOS) must be provided
- Title is mandatory for all notifications
- Image dimensions are recommended but not enforced (800x464 for optimal display)
- Landing URLs can be deep links or standard web URLs

---

### 2. Delivery Options

#### Immediate Dispatch
- Message is sent immediately upon creation
- Status transitions: `DRAFT` → `SENDING` → `SENT`
- Real-time delivery to target devices

#### Scheduled Dispatch
- Message is created with a future date/time
- Status is set to `SCHEDULED` until the scheduled time arrives
- System processes scheduled messages automatically
- Status transitions: `DRAFT` → `SCHEDULED` → `SENDING` → `SENT`

#### Nightly Notification Restrictions
- **Warning Period**: 9:00 PM - 8:00 AM
- System displays a warning when attempting immediate dispatch during this period
- Notifications may be limited based on user's device notification settings
- Scheduled messages can still be created for future delivery

---

### 3. Test Dispatch

#### Purpose
- Allows administrators to test notifications before sending to all users
- Validates message content, formatting, and deep link functionality
- Tests on registered test devices

#### Test Device Management
- Test devices are registered separately from production devices
- Administrators can select multiple test devices for testing
- Test dispatch sends notifications only to selected test devices
- Test dispatches do not affect production statistics

#### Business Rules
- At least one test device must be selected
- Test devices must be active (isActive = true)
- Test dispatch uses the same message content as production

---

### 4. Scheduled Messages Management

#### View Scheduled Messages
- Lists all messages with `SCHEDULED` status
- Displays:
  - Message title
  - Target audience (All/Android/iOS)
  - Scheduled date and time
  - Current status (Booked)

#### Delete Scheduled Messages
- Administrators can delete scheduled messages before they are sent
- Only messages with `SCHEDULED` or `DRAFT` status can be deleted
- Sent messages cannot be deleted (for audit purposes)
- Deletion is permanent and cannot be undone

---

## Data Flow

### 1. Message Creation Flow

```
Admin Panel → Create Push Message API → Validation → Database (push_messages table)
                                                      ↓
                                              Status: DRAFT or SCHEDULED
```

**Steps:**
1. Administrator fills out the compose form
2. Form validation ensures required fields are present
3. If image is uploaded, it's stored in S3 and URL is saved
4. Message is saved to database with appropriate status:
   - `IMMEDIATE` → Status: `DRAFT`
   - `SCHEDULED` → Status: `SCHEDULED`
5. If immediate, message is queued for sending

---

### 2. Message Sending Flow

```
Push Message (DRAFT/SCHEDULED) → Send API → Status: SENDING
                                              ↓
                                    Get Target Device Tokens
                                              ↓
                                    Filter by Platform (if needed)
                                              ↓
                                    Firebase Cloud Messaging (FCM)
                                              ↓
                                    Batch Send to Devices
                                              ↓
                                    Update Statistics
                                              ↓
                                    Status: SENT
```

**Steps:**
1. Administrator triggers send (or scheduled job triggers)
2. System queries `device_tokens` table for active tokens matching target
3. Tokens are filtered by platform if target is Android/iOS only
4. Messages are formatted for each platform:
   - **Android**: Uses FCM Android format with BigText support
   - **iOS**: Uses FCM APNs format with rich media support
5. FCM sends notifications in batches
6. System updates:
   - `status` → `SENT`
   - `sentAt` → Current timestamp
   - `totalSent` → Number of successful deliveries

---

### 3. Scheduled Message Processing Flow

```
Scheduled Job (Cron/Queue) → Query Scheduled Messages
                                    ↓
                            Filter: scheduledAt <= now
                                    ↓
                            For each message:
                                    ↓
                            Call Send Flow
                                    ↓
                            Update Status
```

**Steps:**
1. Background job runs periodically (e.g., every minute)
2. Queries messages where:
   - `status` = `SCHEDULED`
   - `sendType` = `SCHEDULED`
   - `scheduledAt` <= current time
3. For each message, executes the send flow
4. Handles errors gracefully (logs but continues processing)

---

### 4. Test Dispatch Flow

```
Test Dispatch Request → Validate Test Devices
                              ↓
                      Get Selected Device Tokens
                              ↓
                      Send via FCM (same as production)
                              ↓
                      No Statistics Update (test only)
```

**Steps:**
1. Administrator selects test devices
2. System validates devices are active
3. Sends notifications using same FCM flow
4. Does not update production statistics
5. Returns success/failure status

---

### 5. Device Statistics Flow

```
Statistics Request → Query device_tokens table
                            ↓
                    Count by Platform
                            ↓
                    Return: { total, android, ios }
```

**Steps:**
1. Query counts active device tokens (`isActive = true`)
2. Total: All active tokens
3. Android: Active tokens with `platform = 'android'`
4. iOS: Active tokens with `platform = 'ios'`
5. Return real-time counts

---

## Business Rules

### Message Status Lifecycle

```
DRAFT → SCHEDULED → SENDING → SENT
  ↓         ↓
  └─────────┘ (can be deleted)
```

- **DRAFT**: Message created but not scheduled or sent
- **SCHEDULED**: Message scheduled for future delivery
- **SENDING**: Message is currently being sent (prevents duplicate sends)
- **SENT**: Message has been successfully sent (final state)

### Validation Rules

1. **Title**
   - Required
   - Maximum 100 characters
   - Cannot be empty or whitespace only

2. **Messages**
   - At least one message (Android or iOS) must be provided
   - Messages can be empty strings if not targeting that platform
   - BigText is optional (Android only)

3. **Scheduled Time**
   - Required when `sendType = 'scheduled'`
   - Must be in the future
   - Stored as ISO 8601 timestamp

4. **Image**
   - Optional
   - Recommended dimensions: 800x464
   - Stored in S3, URL saved in database
   - Supports common image formats (JPEG, PNG, etc.)

5. **Landing URL**
   - Optional
   - Maximum 255 characters
   - Can be deep link or web URL
   - No validation of URL format (flexibility for deep links)

### Update Restrictions

- **Sent messages** cannot be updated (immutable for audit)
- **Sending messages** cannot be updated (prevents conflicts)
- **Scheduled messages** can be updated until they are sent
- **Draft messages** can be freely updated

### Deletion Restrictions

- **Sent messages** cannot be deleted (audit trail)
- **Sending messages** cannot be deleted (prevents data loss)
- **Scheduled messages** can be deleted
- **Draft messages** can be deleted

### Platform-Specific Behavior

#### Android
- Supports BigText (expanded content)
- Supports image attachments
- Uses FCM Android notification format
- Priority: High

#### iOS
- Supports rich media (images)
- Uses APNs format via FCM
- Sound: Default
- Mutable content enabled when image is present

---

## Data Models

### PushMessage Entity

```typescript
{
  id: number
  title: string (max 100)
  androidMessage?: string
  androidBigtext?: string
  iosMessage?: string
  imageUrl?: string (max 255)
  landingUrl?: string (max 255)
  target: 'all' | 'android' | 'ios'
  status: 'draft' | 'scheduled' | 'sending' | 'sent'
  sendType: 'immediate' | 'scheduled'
  scheduledAt?: Date
  sentAt?: Date
  totalSent: number (default: 0)
  totalViews: number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

### DeviceToken Entity

```typescript
{
  id: number
  userId?: number
  fcmToken: string (unique)
  platform: 'android' | 'ios'
  appVersion?: string
  isActive: boolean (default: true)
  lastSeenAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## API Endpoints

### Message Management
- `GET /admin/push-messages` - List all messages
- `GET /admin/push-messages/scheduled` - List scheduled messages
- `GET /admin/push-messages/stats` - Get device statistics
- `GET /admin/push-messages/:id` - Get message by ID
- `POST /admin/push-messages` - Create new message
- `PUT /admin/push-messages/:id` - Update message
- `DELETE /admin/push-messages/:id` - Delete message

### Message Actions
- `POST /admin/push-messages/:id/send` - Send message immediately
- `POST /admin/push-messages/:id/test` - Send test push
- `POST /admin/push-messages/:id/upload/image` - Upload image

---

## Error Handling

### Common Errors

1. **Validation Errors**
   - Missing required fields
   - Invalid date/time format
   - Scheduled time in the past
   - Returns 400 Bad Request with error message

2. **Business Logic Errors**
   - Cannot update sent message
   - Cannot delete sending message
   - No active devices for target
   - Returns 400 Bad Request with descriptive message

3. **Firebase Errors**
   - Firebase not initialized
   - Invalid FCM tokens
   - Network errors
   - Returns 500 Internal Server Error (logged for debugging)

4. **Not Found Errors**
   - Message ID doesn't exist
   - Returns 404 Not Found

---

## Security Considerations

1. **Authentication**: All admin endpoints require authentication
2. **Authorization**: Only administrators can access push management
3. **Rate Limiting**: Consider implementing rate limits for send operations
4. **Input Validation**: All inputs are validated before processing
5. **File Upload**: Image uploads are validated and stored securely in S3

---

## Performance Considerations

1. **Batch Sending**: FCM supports batch sending (up to 500 tokens per batch)
2. **Async Processing**: Scheduled messages are processed asynchronously
3. **Database Indexing**: Device tokens are indexed for fast queries
4. **Caching**: Device statistics can be cached (with TTL) for better performance

---

## Future Enhancements

1. **A/B Testing**: Support for multiple message variants
2. **Segmentation**: Advanced user segmentation (by app version, last seen, etc.)
3. **Analytics**: Detailed delivery and engagement analytics
4. **Templates**: Reusable message templates
5. **Rich Media**: Support for videos and interactive notifications
6. **Time Zones**: Schedule messages in user's local timezone
7. **Retry Logic**: Automatic retry for failed deliveries
8. **Webhooks**: Notify external systems on delivery events

---

## Monitoring & Alerts

### Key Metrics to Monitor
- Message send success rate
- Average delivery time
- Failed delivery count
- Scheduled message queue size
- Firebase API quota usage

### Alerts
- High failure rate (>5%)
- Scheduled message processing errors
- Firebase quota approaching limit
- No active devices for extended period

---

## Support & Troubleshooting

### Common Issues

1. **Messages not sending**
   - Check Firebase configuration
   - Verify device tokens are active
   - Check Firebase quota/limits
   - Review error logs

2. **Scheduled messages not processing**
   - Verify background job is running
   - Check scheduled time is correct
   - Review job logs

3. **Test devices not receiving**
   - Verify test devices are registered
   - Check device tokens are active
   - Verify FCM configuration

---

## Appendix

### FCM Message Format Examples

#### Android
```json
{
  "notification": {
    "title": "Push notification title",
    "body": "Android message content"
  },
  "data": {
    "landingUrl": "myapp://products/123",
    "pushMessageId": "1"
  },
  "android": {
    "priority": "high",
    "notification": {
      "body": "BigText content",
      "imageUrl": "https://..."
    }
  }
}
```

#### iOS
```json
{
  "notification": {
    "title": "Push notification title",
    "body": "iOS message content"
  },
  "data": {
    "landingUrl": "myapp://products/123",
    "pushMessageId": "1"
  },
  "apns": {
    "payload": {
      "aps": {
        "alert": {
          "title": "Push notification title",
          "body": "iOS message content"
        },
        "sound": "default",
        "mutableContent": true
      }
    },
    "fcmOptions": {
      "imageUrl": "https://..."
    }
  }
}
```

---

*Last Updated: 2025-01-15*

