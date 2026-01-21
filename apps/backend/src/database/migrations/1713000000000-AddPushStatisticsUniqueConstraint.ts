import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPushStatisticsUniqueConstraint1713000000000
  implements MigrationInterface
{
  name = 'AddPushStatisticsUniqueConstraint1713000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraint to prevent duplicate event tracking
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_push_statistics_unique_event"
      ON "push_statistics" ("push_message_id", "device_token_id", "event_type")
    `);

    // Add index for faster queries by push_message_id
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_push_statistics_push_message_id"
      ON "push_statistics" ("push_message_id")
    `);

    // Add index for faster queries by event_type
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_push_statistics_event_type"
      ON "push_statistics" ("event_type")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_push_statistics_event_type"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_push_statistics_push_message_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_push_statistics_unique_event"`,
    );
  }
}
