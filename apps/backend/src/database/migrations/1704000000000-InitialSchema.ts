import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1704000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create app_configs table
    await queryRunner.query(`
      CREATE TABLE "app_configs" (
        "id" SERIAL PRIMARY KEY,
        "tap_menu_bg" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
        "status_bar_bg" VARCHAR(7) NOT NULL DEFAULT '#000000',
        "title_bar_bg" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create bottom_menus table
    await queryRunner.query(`
      CREATE TABLE "bottom_menus" (
        "id" SERIAL PRIMARY KEY,
        "menu_name" VARCHAR(50) NOT NULL,
        "connection_url" VARCHAR(255) NOT NULL,
        "icon_active" VARCHAR(255),
        "icon_inactive" VARCHAR(255),
        "sort_order" INTEGER NOT NULL DEFAULT 0,
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create splash_images table
    await queryRunner.query(`
      CREATE TABLE "splash_images" (
        "id" SERIAL PRIMARY KEY,
        "aspect_ratio" VARCHAR(10) NOT NULL,
        "device_type" VARCHAR(50),
        "dimensions" VARCHAR(20),
        "image_url" VARCHAR(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create app_features table
    await queryRunner.query(`
      CREATE TABLE "app_features" (
        "id" SERIAL PRIMARY KEY,
        "splash_duration" INTEGER NOT NULL DEFAULT 2,
        "popup_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
        "popup_cycle_days" INTEGER NOT NULL DEFAULT 7,
        "popup_image_url" VARCHAR(255),
        "popup_button_text" VARCHAR(50),
        "popup_button_text_color" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
        "popup_button_bg_color" VARCHAR(7) NOT NULL DEFAULT '#000000',
        "instagram_url" VARCHAR(255),
        "kakaotalk_url" VARCHAR(255),
        "youtube_url" VARCHAR(255),
        "network_error_message" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create device_tokens table
    await queryRunner.query(`
      CREATE TYPE "device_tokens_platform_enum" AS ENUM('android', 'ios');
      
      CREATE TABLE "device_tokens" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER,
        "fcm_token" VARCHAR(255) NOT NULL UNIQUE,
        "platform" "device_tokens_platform_enum" NOT NULL,
        "app_version" VARCHAR(20),
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "last_seen_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX "IDX_device_tokens_fcm_token" ON "device_tokens" ("fcm_token");
    `);

    // Create push_messages table
    await queryRunner.query(`
      CREATE TYPE "push_messages_target_enum" AS ENUM('all', 'android', 'ios');
      CREATE TYPE "push_messages_status_enum" AS ENUM('draft', 'scheduled', 'sending', 'sent');
      CREATE TYPE "push_messages_send_type_enum" AS ENUM('immediate', 'scheduled');
      
      CREATE TABLE "push_messages" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(100) NOT NULL,
        "android_message" TEXT,
        "android_bigtext" TEXT,
        "ios_message" TEXT,
        "image_url" VARCHAR(255),
        "landing_url" VARCHAR(255),
        "target" "push_messages_target_enum" NOT NULL DEFAULT 'all',
        "status" "push_messages_status_enum" NOT NULL DEFAULT 'draft',
        "send_type" "push_messages_send_type_enum" NOT NULL DEFAULT 'immediate',
        "scheduled_at" TIMESTAMP,
        "sent_at" TIMESTAMP,
        "total_sent" INTEGER NOT NULL DEFAULT 0,
        "total_views" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create push_statistics table
    await queryRunner.query(`
      CREATE TYPE "push_statistics_event_type_enum" AS ENUM('sent', 'delivered', 'opened', 'clicked');
      
      CREATE TABLE "push_statistics" (
        "id" SERIAL PRIMARY KEY,
        "push_message_id" INTEGER NOT NULL,
        "device_token_id" INTEGER NOT NULL,
        "event_type" "push_statistics_event_type_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("push_message_id") REFERENCES "push_messages" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("device_token_id") REFERENCES "device_tokens" ("id") ON DELETE CASCADE
      );
      
      CREATE INDEX "IDX_push_statistics_push_message_id" ON "push_statistics" ("push_message_id");
      CREATE INDEX "IDX_push_statistics_device_token_id" ON "push_statistics" ("device_token_id");
      CREATE INDEX "IDX_push_statistics_event_type" ON "push_statistics" ("event_type");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "push_statistics" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "push_messages" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "device_tokens" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "app_features" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "splash_images" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bottom_menus" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "app_configs" CASCADE`);

    await queryRunner.query(
      `DROP TYPE IF EXISTS "push_statistics_event_type_enum"`
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "push_messages_send_type_enum"`
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "push_messages_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "push_messages_target_enum"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "device_tokens_platform_enum"`
    );
  }
}
