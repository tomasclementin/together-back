import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWrittenWishesConfigSchema1691101981187
  implements MigrationInterface
{
  name = 'AddWrittenWishesConfigSchema1691101981187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD \`wishes_amount\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP COLUMN \`wishes_amount\``,
    );
  }
}
