-- Push Message Management Test Data Seed Script
-- Run this script to populate test data for push management testing

-- ============================================
-- 1. Device Tokens (for testing)
-- ============================================

-- Clear existing test tokens (optional - be careful in production!)
-- DELETE FROM device_tokens WHERE fcm_token LIKE 'test-%';

-- Insert Android test device tokens
INSERT INTO device_tokens (fcm_token, platform, is_active, app_version, created_at, updated_at)
VALUES
  ('test-android-token-001', 'android', true, '1.0.0', NOW(), NOW()),
  ('test-android-token-002', 'android', true, '1.0.0', NOW(), NOW()),
  ('test-android-token-003', 'android', true, '1.1.0', NOW(), NOW()),
  ('test-android-token-004', 'android', true, '1.0.0', NOW(), NOW()),
  ('test-android-token-005', 'android', true, '1.1.0', NOW(), NOW())
ON CONFLICT (fcm_token) DO NOTHING;

-- Insert iOS test device tokens
INSERT INTO device_tokens (fcm_token, platform, is_active, app_version, created_at, updated_at)
VALUES
  ('test-ios-token-001', 'ios', true, '1.0.0', NOW(), NOW()),
  ('test-ios-token-002', 'ios', true, '1.0.0', NOW(), NOW()),
  ('test-ios-token-003', 'ios', true, '1.1.0', NOW(), NOW()),
  ('test-ios-token-004', 'ios', true, '1.0.0', NOW(), NOW())
ON CONFLICT (fcm_token) DO NOTHING;

-- Insert inactive tokens (for testing filtering)
INSERT INTO device_tokens (fcm_token, platform, is_active, app_version, created_at, updated_at)
VALUES
  ('inactive-android-token', 'android', false, '1.0.0', NOW(), NOW()),
  ('inactive-ios-token', 'ios', false, '1.0.0', NOW(), NOW())
ON CONFLICT (fcm_token) DO NOTHING;

-- ============================================
-- 2. Push Messages (for testing)
-- ============================================

-- Draft message (immediate)
INSERT INTO push_messages (
  title, 
  android_message, 
  android_bigtext,
  ios_message, 
  target, 
  status, 
  send_type,
  created_at, 
  updated_at
)
VALUES (
  'Welcome to MajorWorld!',
  'Thank you for downloading our app. Explore amazing features!',
  'We are excited to have you on board. Check out our latest updates and exclusive offers available just for you.',
  'Thank you for downloading our app. Explore amazing features!',
  'all',
  'draft',
  'immediate',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Scheduled message (for tomorrow)
INSERT INTO push_messages (
  title, 
  android_message, 
  ios_message, 
  target, 
  status, 
  send_type,
  scheduled_at,
  created_at, 
  updated_at
)
VALUES (
  'Weekend Deals Alert',
  'Don''t miss our weekend special offers! Up to 50% off on selected items.',
  'Don''t miss our weekend special offers! Up to 50% off on selected items.',
  'all',
  'scheduled',
  'scheduled',
  NOW() + INTERVAL '1 day',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Another scheduled message (for next week)
INSERT INTO push_messages (
  title, 
  android_message, 
  ios_message, 
  target, 
  status, 
  send_type,
  scheduled_at,
  created_at, 
  updated_at
)
VALUES (
  'New Product Arrival Guide',
  'Check out our latest product collection. Limited stock available!',
  'Check out our latest product collection. Limited stock available!',
  'ios',
  'scheduled',
  'scheduled',
  NOW() + INTERVAL '7 days',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Android-only message
INSERT INTO push_messages (
  title, 
  android_message, 
  android_bigtext,
  target, 
  status, 
  send_type,
  created_at, 
  updated_at
)
VALUES (
  'Android Exclusive Update',
  'New Android features are now available! Update to the latest version.',
  'We''ve added new features specifically for Android users. Update now to enjoy improved performance and new capabilities.',
  'android',
  'draft',
  'immediate',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Sent message (for testing history)
INSERT INTO push_messages (
  title, 
  android_message, 
  ios_message, 
  target, 
  status, 
  send_type,
  sent_at,
  total_sent,
  total_views,
  created_at, 
  updated_at
)
VALUES (
  'Previous Campaign',
  'This message was already sent to all users.',
  'This message was already sent to all users.',
  'all',
  'sent',
  'immediate',
  NOW() - INTERVAL '2 days',
  9,
  5,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
) ON CONFLICT DO NOTHING;

-- Message with image and deep link
INSERT INTO push_messages (
  title, 
  android_message, 
  ios_message, 
  image_url,
  landing_url,
  target, 
  status, 
  send_type,
  created_at, 
  updated_at
)
VALUES (
  'Special Promotion',
  'Tap to view our special promotion!',
  'Tap to view our special promotion!',
  'https://example.com/images/promotion.jpg',
  'myapp://promotions/special',
  'all',
  'draft',
  'immediate',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ============================================
-- 3. Verify Data
-- ============================================

-- Check device token counts
SELECT 
  platform,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  COUNT(*) FILTER (WHERE is_active = false) as inactive
FROM device_tokens
GROUP BY platform;

-- Check push message counts by status
SELECT 
  status,
  send_type,
  COUNT(*) as count
FROM push_messages
GROUP BY status, send_type
ORDER BY status, send_type;

-- Check scheduled messages
SELECT 
  id,
  title,
  target,
  scheduled_at,
  status
FROM push_messages
WHERE status = 'scheduled'
ORDER BY scheduled_at ASC;

