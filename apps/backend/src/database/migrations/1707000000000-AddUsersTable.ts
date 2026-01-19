import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1707000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users role enum
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM('admin', 'super_admin');
    `);

    // Create users table
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
  }
}
