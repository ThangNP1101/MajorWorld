export const DEVICE_TOKEN_QUEUE = {
  QUEUE_NAME: 'device-token-sync',
  JOB: {
    SYNC_TOKEN: 'sync-token',
    SYNC_PENDING: 'sync-pending',
  },
} as const;
