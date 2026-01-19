import { MigrationInterface, QueryRunner } from "typeorm";

export class DeviceTokensIdToUuid1711000000000 implements MigrationInterface {
  name = 'DeviceTokensIdToUuid1711000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Drop FK constraint from push_statistics
    await queryRunner.query(
      `ALTER TABLE "push_statistics" DROP CONSTRAINT IF EXISTS "push_statistics_device_token_id_fkey"`
    );

    // Drop index
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_push_statistics_device_token_id"`
    );

    // Drop and recreate device_token_id as UUID in push_statistics
    await queryRunner.query(
      `ALTER TABLE "push_statistics" DROP COLUMN "device_token_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "push_statistics" ADD COLUMN "device_token_id" uuid NOT NULL`
    );

    // Drop PK and recreate id as UUID in device_tokens
    await queryRunner.query(
      `ALTER TABLE "device_tokens" DROP CONSTRAINT IF EXISTS "device_tokens_pkey"`
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" DROP COLUMN "id"`
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid()`
    );

    // Re-create FK constraint
    await queryRunner.query(`
      ALTER TABLE "push_statistics"
      ADD CONSTRAINT "push_statistics_device_token_id_fkey"
      FOREIGN KEY ("device_token_id") REFERENCES "device_tokens" ("id") ON DELETE CASCADE
    `);

    // Re-create index
    await queryRunner.query(
      `CREATE INDEX "IDX_push_statistics_device_token_id" ON "push_statistics" ("device_token_id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK constraint
    await queryRunner.query(
      `ALTER TABLE "push_statistics" DROP CONSTRAINT IF EXISTS "push_statistics_device_token_id_fkey"`
    );

    // Drop index
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_push_statistics_device_token_id"`
    );

    // Revert device_token_id to integer in push_statistics
    await queryRunner.query(
      `ALTER TABLE "push_statistics" DROP COLUMN "device_token_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "push_statistics" ADD COLUMN "device_token_id" integer NOT NULL`
    );

    // Revert id to serial in device_tokens
    await queryRunner.query(
      `ALTER TABLE "device_tokens" DROP CONSTRAINT IF EXISTS "device_tokens_pkey"`
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" DROP COLUMN "id"`
    );
    await queryRunner.query(
      `ALTER TABLE "device_tokens" ADD COLUMN "id" SERIAL PRIMARY KEY`
    );

    // Re-create FK constraint
    await queryRunner.query(`
      ALTER TABLE "push_statistics"
      ADD CONSTRAINT "push_statistics_device_token_id_fkey"
      FOREIGN KEY ("device_token_id") REFERENCES "device_tokens" ("id") ON DELETE CASCADE
    `);

    // Re-create index
    await queryRunner.query(
      `CREATE INDEX "IDX_push_statistics_device_token_id" ON "push_statistics" ("device_token_id")`
    );
  }
}
