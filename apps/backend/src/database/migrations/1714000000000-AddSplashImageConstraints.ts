import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSplashImageConstraints1714000000000
  implements MigrationInterface
{
  name = 'AddSplashImageConstraints1714000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraint on aspect_ratio
    await queryRunner.query(
      `ALTER TABLE "splash_images" ADD CONSTRAINT "UQ_splash_images_aspect_ratio" UNIQUE ("aspect_ratio")`,
    );

    // Add index on aspect_ratio for faster lookups
    await queryRunner.query(
      `CREATE INDEX "IDX_splash_images_aspect_ratio" ON "splash_images" ("aspect_ratio")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_splash_images_aspect_ratio"`,
    );

    // Drop unique constraint
    await queryRunner.query(
      `ALTER TABLE "splash_images" DROP CONSTRAINT IF EXISTS "UQ_splash_images_aspect_ratio"`,
    );
  }
}
