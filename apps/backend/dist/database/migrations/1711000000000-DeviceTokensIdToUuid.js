"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokensIdToUuid1711000000000 = void 0;
class DeviceTokensIdToUuid1711000000000 {
    constructor() {
        this.name = 'DeviceTokensIdToUuid1711000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`ALTER TABLE "push_statistics" DROP CONSTRAINT IF EXISTS "push_statistics_device_token_id_fkey"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_push_statistics_device_token_id"`);
        await queryRunner.query(`ALTER TABLE "push_statistics" DROP COLUMN "device_token_id"`);
        await queryRunner.query(`ALTER TABLE "push_statistics" ADD COLUMN "device_token_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP CONSTRAINT IF EXISTS "device_tokens_pkey"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid()`);
        await queryRunner.query(`
      ALTER TABLE "push_statistics"
      ADD CONSTRAINT "push_statistics_device_token_id_fkey"
      FOREIGN KEY ("device_token_id") REFERENCES "device_tokens" ("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`CREATE INDEX "IDX_push_statistics_device_token_id" ON "push_statistics" ("device_token_id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "push_statistics" DROP CONSTRAINT IF EXISTS "push_statistics_device_token_id_fkey"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_push_statistics_device_token_id"`);
        await queryRunner.query(`ALTER TABLE "push_statistics" DROP COLUMN "device_token_id"`);
        await queryRunner.query(`ALTER TABLE "push_statistics" ADD COLUMN "device_token_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP CONSTRAINT IF EXISTS "device_tokens_pkey"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" ADD COLUMN "id" SERIAL PRIMARY KEY`);
        await queryRunner.query(`
      ALTER TABLE "push_statistics"
      ADD CONSTRAINT "push_statistics_device_token_id_fkey"
      FOREIGN KEY ("device_token_id") REFERENCES "device_tokens" ("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`CREATE INDEX "IDX_push_statistics_device_token_id" ON "push_statistics" ("device_token_id")`);
    }
}
exports.DeviceTokensIdToUuid1711000000000 = DeviceTokensIdToUuid1711000000000;
//# sourceMappingURL=1711000000000-DeviceTokensIdToUuid.js.map