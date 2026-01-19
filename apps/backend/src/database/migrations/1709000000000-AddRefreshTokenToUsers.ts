import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUsers1709000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "refresh_token" VARCHAR(500),
      ADD COLUMN "refresh_token_expires_at" TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "refresh_token_expires_at",
      DROP COLUMN IF EXISTS "refresh_token"
    `);
  }
}
