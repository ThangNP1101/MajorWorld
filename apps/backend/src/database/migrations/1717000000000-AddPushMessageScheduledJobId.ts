import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPushMessageScheduledJobId1717000000000
  implements MigrationInterface
{
  name = 'AddPushMessageScheduledJobId1717000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add scheduled_job_id column to push_messages
    await queryRunner.query(
      `ALTER TABLE "push_messages" ADD COLUMN IF NOT EXISTS "scheduled_job_id" VARCHAR(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "push_messages" DROP COLUMN IF EXISTS "scheduled_job_id"`,
    );
  }
}
