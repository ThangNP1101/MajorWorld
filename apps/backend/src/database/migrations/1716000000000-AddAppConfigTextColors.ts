import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppConfigTextColors1716000000000
  implements MigrationInterface
{
  name = 'AddAppConfigTextColors1716000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add tap_menu_text_color column to app_configs
    await queryRunner.query(
      `ALTER TABLE "app_configs" ADD COLUMN IF NOT EXISTS "tap_menu_text_color" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF'`,
    );
    
    // Add title_text_color column to app_configs
    await queryRunner.query(
      `ALTER TABLE "app_configs" ADD COLUMN IF NOT EXISTS "title_text_color" VARCHAR(7) NOT NULL DEFAULT '#000000'`,
    );
    
    // Add tap_menu_text_color column to app_config_history
    await queryRunner.query(
      `ALTER TABLE "app_config_history" ADD COLUMN IF NOT EXISTS "tap_menu_text_color" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF'`,
    );
    
    // Add title_text_color column to app_config_history
    await queryRunner.query(
      `ALTER TABLE "app_config_history" ADD COLUMN IF NOT EXISTS "title_text_color" VARCHAR(7) NOT NULL DEFAULT '#000000'`,
    );

    // Set default text colors for existing configs
    // White text for menu (as menu background is typically dark: #9f7575)
    // Black text for title (as title background is typically light: #FFFFFF)
    await queryRunner.query(
      `UPDATE "app_configs" SET "tap_menu_text_color" = '#FFFFFF', "title_text_color" = '#000000'`,
    );

    // Set default text colors for existing history records
    await queryRunner.query(
      `UPDATE "app_config_history" SET "tap_menu_text_color" = '#FFFFFF', "title_text_color" = '#000000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app_config_history" DROP COLUMN IF EXISTS "title_text_color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_config_history" DROP COLUMN IF EXISTS "tap_menu_text_color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "title_text_color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "tap_menu_text_color"`,
    );
  }
}
