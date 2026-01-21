"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSplashImageConstraints1714000000000 = void 0;
class AddSplashImageConstraints1714000000000 {
    constructor() {
        this.name = 'AddSplashImageConstraints1714000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "splash_images" ADD CONSTRAINT "UQ_splash_images_aspect_ratio" UNIQUE ("aspect_ratio")`);
        await queryRunner.query(`CREATE INDEX "IDX_splash_images_aspect_ratio" ON "splash_images" ("aspect_ratio")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_splash_images_aspect_ratio"`);
        await queryRunner.query(`ALTER TABLE "splash_images" DROP CONSTRAINT IF EXISTS "UQ_splash_images_aspect_ratio"`);
    }
}
exports.AddSplashImageConstraints1714000000000 = AddSplashImageConstraints1714000000000;
//# sourceMappingURL=1714000000000-AddSplashImageConstraints.js.map