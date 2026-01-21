import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTestDeviceTokens1712000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE "test_device_tokens" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" INTEGER,
        "fcm_token" VARCHAR(255) NOT NULL UNIQUE,
        "platform" "device_tokens_platform_enum" NOT NULL,
        "app_version" VARCHAR(20),
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "last_seen_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX "IDX_test_device_tokens_fcm_token" ON "test_device_tokens" ("fcm_token");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "test_device_tokens" CASCADE`);
  }
}
