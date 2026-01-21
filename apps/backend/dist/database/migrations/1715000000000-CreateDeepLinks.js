"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeepLinks1715000000000 = void 0;
class CreateDeepLinks1715000000000 {
    constructor() {
        this.name = 'CreateDeepLinks1715000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`CREATE TYPE "deep_links_connectivity_type_enum" AS ENUM ('store_only', 'app_or_store', 'app_or_web')`);
        await queryRunner.query(`
      CREATE TABLE "deep_links" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "original_url" varchar(2048) NOT NULL,
        "connectivity_type" "deep_links_connectivity_type_enum" NOT NULL,
        "short_code" varchar(16) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_deep_links_short_code" ON "deep_links" ("short_code")`);
        await queryRunner.query(`CREATE INDEX "IDX_deep_links_created_at" ON "deep_links" ("created_at")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_deep_links_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "UQ_deep_links_short_code"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "deep_links"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "deep_links_connectivity_type_enum"`);
    }
}
exports.CreateDeepLinks1715000000000 = CreateDeepLinks1715000000000;
//# sourceMappingURL=1715000000000-CreateDeepLinks.js.map