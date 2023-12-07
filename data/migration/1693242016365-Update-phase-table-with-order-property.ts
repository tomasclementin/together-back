import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePhaseTableWithOrderProperty1693242016365
  implements MigrationInterface
{
  name = 'UpdatePhaseTableWithOrderProperty1693242016365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`phase\` ADD \`order\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`phase\` DROP COLUMN \`order\``);
  }
}
