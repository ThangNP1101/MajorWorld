import { MigrationInterface, QueryRunner } from 'typeorm';

/** Adds topic sync fields to device tokens. */
export class AddDeviceTokenTopicSync1718000000000 implements MigrationInterface {
  name = 'AddDeviceTokenTopicSync1718000000000';

  /** Applies schema changes. */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN
        CREATE TYPE "device_tokens_topics_sync_status_enum" AS ENUM ('pending', 'synced', 'failed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN IF NOT EXISTS "topics_sync_status" "device_tokens_topics_sync_status_enum" NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN IF NOT EXISTS "topics_synced_list" JSONB NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN IF NOT EXISTS "topics_sync_attempted_at" TIMESTAMP NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN IF NOT EXISTS "topics_sync_retry_count" INT NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN IF NOT EXISTS "topics_sync_error" VARCHAR(500) NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_device_tokens_topics_sync" ON "device_tokens" ("topics_sync_status", "topics_sync_retry_count", "topics_sync_attempted_at") WHERE "topics_sync_status" IN ('pending', 'failed')`,
    );
  }

  /** Reverts schema changes. */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_device_tokens_topics_sync"`);
    await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN IF EXISTS "topics_sync_error"`);
    await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN IF EXISTS "topics_sync_retry_count"`);
    await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN IF EXISTS "topics_sync_attempted_at"`);
    await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN IF EXISTS "topics_synced_list"`);
    await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN IF EXISTS "topics_sync_status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "device_tokens_topics_sync_status_enum"`);
  }
}
