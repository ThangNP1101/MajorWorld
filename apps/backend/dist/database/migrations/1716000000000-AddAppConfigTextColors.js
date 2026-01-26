"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAppConfigTextColors1716000000000 = void 0;
class AddAppConfigTextColors1716000000000 {
    constructor() {
        this.name = 'AddAppConfigTextColors1716000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "app_configs" ADD COLUMN IF NOT EXISTS "tap_menu_text_color" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF'`);
        await queryRunner.query(`ALTER TABLE "app_configs" ADD COLUMN IF NOT EXISTS "title_text_color" VARCHAR(7) NOT NULL DEFAULT '#000000'`);
        await queryRunner.query(`ALTER TABLE "app_config_history" ADD COLUMN IF NOT EXISTS "tap_menu_text_color" VARCHAR(7) NOT NULL DEFAULT '#FFFFFF'`);
        await queryRunner.query(`ALTER TABLE "app_config_history" ADD COLUMN IF NOT EXISTS "title_text_color" VARCHAR(7) NOT NULL DEFAULT '#000000'`);
        await queryRunner.query(`UPDATE "app_configs" SET "tap_menu_text_color" = '#FFFFFF', "title_text_color" = '#000000'`);
        await queryRunner.query(`UPDATE "app_config_history" SET "tap_menu_text_color" = '#FFFFFF', "title_text_color" = '#000000'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "app_config_history" DROP COLUMN IF EXISTS "title_text_color"`);
        await queryRunner.query(`ALTER TABLE "app_config_history" DROP COLUMN IF EXISTS "tap_menu_text_color"`);
        await queryRunner.query(`ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "title_text_color"`);
        await queryRunner.query(`ALTER TABLE "app_configs" DROP COLUMN IF EXISTS "tap_menu_text_color"`);
    }
}
exports.AddAppConfigTextColors1716000000000 = AddAppConfigTextColors1716000000000;
//# sourceMappingURL=1716000000000-AddAppConfigTextColors.js.map