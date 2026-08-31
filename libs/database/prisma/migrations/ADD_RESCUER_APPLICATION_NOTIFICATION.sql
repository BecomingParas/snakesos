-- Safe, additive migration for the rescuer application notification event.
-- Run only after taking a database backup.
ALTER TYPE "NotificationType"
  ADD VALUE IF NOT EXISTS 'RESCUER_APPLICATION_SUBMITTED';
