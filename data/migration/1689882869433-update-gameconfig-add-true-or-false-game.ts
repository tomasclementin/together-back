import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameconfigAddTrueOrFalseGame1689882869433
  implements MigrationInterface
{
  name = 'UpdateGameconfigAddTrueOrFalseGame1689882869433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` DROP FOREIGN KEY \`FK_ccc7ff9998c964fdd67d1987ac0\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`true_or_false_tile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`true_or_false_tiles\` (\`game_config_id\` int NOT NULL, \`true_or_false_tile_id\` int NOT NULL, INDEX \`IDX_3b7f19c0b9157dd2ec5ec1ced5\` (\`game_config_id\`), INDEX \`IDX_5272c218acdfc65e0019c6cad4\` (\`true_or_false_tile_id\`), PRIMARY KEY (\`game_config_id\`, \`true_or_false_tile_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD \`title\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD \`max_players\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` ADD CONSTRAINT \`FK_3b7f19c0b9157dd2ec5ec1ced5e\` FOREIGN KEY (\`game_config_id\`) REFERENCES \`game_config\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` ADD CONSTRAINT \`FK_5272c218acdfc65e0019c6cad46\` FOREIGN KEY (\`true_or_false_tile_id\`) REFERENCES \`true_or_false_tile\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` ADD CONSTRAINT \`FK_ccc7ff9998c964fdd67d1987ac0\` FOREIGN KEY (\`who_is_card_id\`) REFERENCES \`who_is_card\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` DROP FOREIGN KEY \`FK_ccc7ff9998c964fdd67d1987ac0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` DROP FOREIGN KEY \`FK_5272c218acdfc65e0019c6cad46\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` DROP FOREIGN KEY \`FK_3b7f19c0b9157dd2ec5ec1ced5e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP COLUMN \`max_players\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP COLUMN \`title\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5272c218acdfc65e0019c6cad4\` ON \`true_or_false_tiles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3b7f19c0b9157dd2ec5ec1ced5\` ON \`true_or_false_tiles\``,
    );
    await queryRunner.query(`DROP TABLE \`true_or_false_tiles\``);
    await queryRunner.query(`DROP TABLE \`true_or_false_tile\``);
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` ADD CONSTRAINT \`FK_ccc7ff9998c964fdd67d1987ac0\` FOREIGN KEY (\`who_is_card_id\`) REFERENCES \`who_is_card\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
