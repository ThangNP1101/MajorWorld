"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersIdToUuid1708000000000 = void 0;
class UsersIdToUuid1708000000000 {
    constructor() {
        this.name = 'UsersIdToUuid1708000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "id" DROP DEFAULT,
      ALTER COLUMN "id" TYPE uuid USING gen_random_uuid(),
      ALTER COLUMN "id" SET DEFAULT gen_random_uuid()
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "id" DROP DEFAULT,
      ALTER COLUMN "id" TYPE integer USING ("id"::text)::integer,
      ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq'::regclass)
    `);
    }
}
exports.UsersIdToUuid1708000000000 = UsersIdToUuid1708000000000;
//# sourceMappingURL=1708000000000-UsersIdToUuid.js.map