import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateTestDeviceTokens1712000000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
