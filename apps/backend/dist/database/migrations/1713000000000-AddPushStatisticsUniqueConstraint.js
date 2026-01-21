"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPushStatisticsUniqueConstraint1713000000000 = void 0;
class AddPushStatisticsUniqueConstraint1713000000000 {
    constructor() {
        this.name = 'AddPushStatisticsUniqueConstraint1713000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_push_statistics_unique_event"
      ON "push_statistics" ("push_message_id", "device_token_id", "event_type")
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_push_statistics_push_message_id"
      ON "push_statistics" ("push_message_id")
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_push_statistics_event_type"
      ON "push_statistics" ("event_type")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_push_statistics_event_type"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_push_statistics_push_message_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_push_statistics_unique_event"`);
    }
}
exports.AddPushStatisticsUniqueConstraint1713000000000 = AddPushStatisticsUniqueConstraint1713000000000;
//# sourceMappingURL=1713000000000-AddPushStatisticsUniqueConstraint.js.map