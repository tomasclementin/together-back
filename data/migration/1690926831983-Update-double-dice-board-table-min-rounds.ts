import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDoubleDiceBoardTableMinRounds1690926831983
  implements MigrationInterface
{
  name = 'UpdateDoubleDiceBoardTableMinRounds1690926831983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD \`double_dice_board_min_rounds\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP COLUMN \`double_dice_board_min_rounds\``,
    );
  }
}
