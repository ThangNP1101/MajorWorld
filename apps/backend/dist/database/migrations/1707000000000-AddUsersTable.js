"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUsersTable1707000000000 = void 0;
class AddUsersTable1707000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM('admin', 'super_admin');
    `);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'admin',
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email");
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
    }
}
exports.AddUsersTable1707000000000 = AddUsersTable1707000000000;
//# sourceMappingURL=1707000000000-AddUsersTable.js.map