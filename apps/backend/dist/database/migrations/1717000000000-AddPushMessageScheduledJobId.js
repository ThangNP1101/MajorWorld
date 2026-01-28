"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPushMessageScheduledJobId1717000000000 = void 0;
class AddPushMessageScheduledJobId1717000000000 {
    constructor() {
        this.name = 'AddPushMessageScheduledJobId1717000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "push_messages" ADD COLUMN IF NOT EXISTS "scheduled_job_id" VARCHAR(64)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "push_messages" DROP COLUMN IF EXISTS "scheduled_job_id"`);
    }
}
exports.AddPushMessageScheduledJobId1717000000000 = AddPushMessageScheduledJobId1717000000000;
//# sourceMappingURL=1717000000000-AddPushMessageScheduledJobId.js.map