import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddUserTokenVersion1709100000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
