import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBottomMenuConstraints1705000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add CHECK constraint for sort_order (must be >= 0)
    await queryRunner.query(`
      ALTER TABLE "bottom_menus"
      ADD CONSTRAINT "CHK_bottom_menus_sort_order_positive"
      CHECK ("sort_order" >= 0)
    `);

    // Add index on sort_order for faster ordering queries
    await queryRunner.query(`
      CREATE INDEX "IDX_bottom_menus_sort_order"
      ON "bottom_menus" ("sort_order")
    `);

    // Add index on is_active for faster filtering of active menus
    await queryRunner.query(`
      CREATE INDEX "IDX_bottom_menus_is_active"
      ON "bottom_menus" ("is_active")
    `);

    // Add composite index for common query pattern (active menus ordered by sort_order)
    await queryRunner.query(`
      CREATE INDEX "IDX_bottom_menus_active_sort"
      ON "bottom_menus" ("is_active", "sort_order")
      WHERE "is_active" = true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bottom_menus_active_sort"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bottom_menus_is_active"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bottom_menus_sort_order"`
    );

    // Drop constraint
    await queryRunner.query(`
      ALTER TABLE "bottom_menus"
      DROP CONSTRAINT IF EXISTS "CHK_bottom_menus_sort_order_positive"
    `);
  }
}

