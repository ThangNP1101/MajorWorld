"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserTokenVersion1709100000000 = void 0;
class AddUserTokenVersion1709100000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "token_version" INTEGER NOT NULL DEFAULT 0
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "token_version"
    `);
    }
}
exports.AddUserTokenVersion1709100000000 = AddUserTokenVersion1709100000000;
//# sourceMappingURL=1709100000000-AddUserTokenVersion.js.map