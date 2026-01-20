"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRefreshTokenToUsers1709000000000 = void 0;
class AddRefreshTokenToUsers1709000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "refresh_token" VARCHAR(500),
      ADD COLUMN "refresh_token_expires_at" TIMESTAMP
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "refresh_token_expires_at",
      DROP COLUMN IF EXISTS "refresh_token"
    `);
    }
}
exports.AddRefreshTokenToUsers1709000000000 = AddRefreshTokenToUsers1709000000000;
//# sourceMappingURL=1709000000000-AddRefreshTokenToUsers.js.map