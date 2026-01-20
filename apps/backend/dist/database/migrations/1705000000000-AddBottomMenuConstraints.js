"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBottomMenuConstraints1705000000000 = void 0;
class AddBottomMenuConstraints1705000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "bottom_menus"
      ADD CONSTRAINT "CHK_bottom_menus_sort_order_positive"
      CHECK ("sort_order" >= 0)
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_bottom_menus_sort_order"
      ON "bottom_menus" ("sort_order")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_bottom_menus_is_active"
      ON "bottom_menus" ("is_active")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_bottom_menus_active_sort"
      ON "bottom_menus" ("is_active", "sort_order")
      WHERE "is_active" = true
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bottom_menus_active_sort"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bottom_menus_is_active"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bottom_menus_sort_order"`);
        await queryRunner.query(`
      ALTER TABLE "bottom_menus"
      DROP CONSTRAINT IF EXISTS "CHK_bottom_menus_sort_order_positive"
    `);
    }
}
exports.AddBottomMenuConstraints1705000000000 = AddBottomMenuConstraints1705000000000;
//# sourceMappingURL=1705000000000-AddBottomMenuConstraints.js.map