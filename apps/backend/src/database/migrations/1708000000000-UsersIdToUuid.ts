import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersIdToUuid1708000000000 implements MigrationInterface {
  name = 'UsersIdToUuid1708000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "id" DROP DEFAULT,
      ALTER COLUMN "id" TYPE uuid USING gen_random_uuid(),
      ALTER COLUMN "id" SET DEFAULT gen_random_uuid()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "id" DROP DEFAULT,
      ALTER COLUMN "id" TYPE integer USING ("id"::text)::integer,
      ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq'::regclass)
    `);
  }
}
