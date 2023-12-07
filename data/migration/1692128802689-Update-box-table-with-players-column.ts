import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBoxTableWithPlayersColumn1692128802689
  implements MigrationInterface
{
  name = 'UpdateBoxTableWithPlayersColumn1692128802689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP COLUMN \`max_players\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`box\` ADD \`max_players\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`box\` DROP COLUMN \`max_players\``);
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD \`max_players\` int NOT NULL`,
    );
  }
}
