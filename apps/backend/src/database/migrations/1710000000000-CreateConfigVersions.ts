import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfigVersions1710000000000
  implements MigrationInterface
{
  name = "CreateConfigVersions1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "config_versions" (
        "module_name" VARCHAR(50) PRIMARY KEY,
        "version" INTEGER NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      INSERT INTO "config_versions" ("module_name", "version")
      VALUES
        ('global', 1),
        ('app_config', 1),
        ('bottom_menu', 1),
        ('splash_image', 1),
        ('app_features', 1)
      ON CONFLICT ("module_name") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "config_versions"`);
  }
}
