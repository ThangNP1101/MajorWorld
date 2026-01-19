import { MigrationInterface, QueryRunner } from "typeorm";

export class AppConfigVersioning1706000000000 implements MigrationInterface {
  name = "AppConfigVersioning1706000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure we keep only a single app_config row (old schema allowed multiple)
    await queryRunner.query(`
      DELETE FROM "app_configs"
      WHERE "id" NOT IN (SELECT MIN("id") FROM "app_configs")
    `);

    // Add new columns for key and version
    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ADD COLUMN IF NOT EXISTS "key" VARCHAR(50) DEFAULT 'default'
    `);

    await queryRunner.query(`
      UPDATE "app_configs"
      SET "key" = 'default'
      WHERE "key" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ALTER COLUMN "key" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1
    `);

    // Replace primary key from id -> key
    await queryRunner.query(`
      ALTER TABLE "app_configs"
      DROP CONSTRAINT IF EXISTS "app_configs_pkey"
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ADD CONSTRAINT "PK_app_configs_key" PRIMARY KEY ("key")
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      DROP COLUMN IF EXISTS "id"
    `);

    // Create history table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "app_config_history" (
        "id" SERIAL PRIMARY KEY,
        "config_key" VARCHAR(50) NOT NULL,
        "version" INTEGER NOT NULL,
        "tap_menu_bg" VARCHAR(7) NOT NULL,
        "status_bar_bg" VARCHAR(7) NOT NULL,
        "title_bar_bg" VARCHAR(7) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_app_config_history_key_version" UNIQUE ("config_key", "version")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop history table
    await queryRunner.query(`DROP TABLE IF EXISTS "app_config_history"`);

    // Restore primary key to id
    await queryRunner.query(`
      ALTER TABLE "app_configs"
      DROP CONSTRAINT IF EXISTS "PK_app_configs_key"
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      DROP COLUMN IF EXISTS "version"
    `);

    // Recreate id column with sequence
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS "app_configs_id_seq"
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ADD COLUMN IF NOT EXISTS "id" INTEGER
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ALTER COLUMN "id"
      SET DEFAULT nextval('"app_configs_id_seq"')
    `);

    await queryRunner.query(`
      UPDATE "app_configs"
      SET "id" = nextval('"app_configs_id_seq"')
      WHERE "id" IS NULL
    `);

    await queryRunner.query(`
      SELECT setval('"app_configs_id_seq"', COALESCE((SELECT MAX("id") FROM "app_configs"), 1))
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ALTER COLUMN "id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      ADD CONSTRAINT "app_configs_pkey" PRIMARY KEY ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "app_configs"
      DROP COLUMN IF EXISTS "key"
    `);
  }
}
