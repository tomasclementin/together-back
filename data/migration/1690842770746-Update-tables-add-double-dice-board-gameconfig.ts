import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTablesAddDoubleDiceBoardGameconfig1690842770746
  implements MigrationInterface
{
  name = 'UpdateTablesAddDoubleDiceBoardGameconfig1690842770746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` DROP FOREIGN KEY \`FK_5272c218acdfc65e0019c6cad46\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` DROP FOREIGN KEY \`FK_ccc7ff9998c964fdd67d1987ac0\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`double_dice_board_tile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`double_dice_board_tiles\` (\`game_config_id\` int NOT NULL, \`double_dice_board_tile_id\` int NOT NULL, INDEX \`IDX_2ca51fc0b6e8de27fd6aeb2307\` (\`game_config_id\`), INDEX \`IDX_53827169eebfe432a226ee3892\` (\`double_dice_board_tile_id\`), PRIMARY KEY (\`game_config_id\`, \`double_dice_board_tile_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`double_dice_board_tiles\` ADD CONSTRAINT \`FK_2ca51fc0b6e8de27fd6aeb2307f\` FOREIGN KEY (\`game_config_id\`) REFERENCES \`game_config\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`double_dice_board_tiles\` ADD CONSTRAINT \`FK_53827169eebfe432a226ee3892c\` FOREIGN KEY (\`double_dice_board_tile_id\`) REFERENCES \`double_dice_board_tile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` ADD CONSTRAINT \`FK_5272c218acdfc65e0019c6cad46\` FOREIGN KEY (\`true_or_false_tile_id\`) REFERENCES \`true_or_false_tile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` ADD CONSTRAINT \`FK_ccc7ff9998c964fdd67d1987ac0\` FOREIGN KEY (\`who_is_card_id\`) REFERENCES \`who_is_card\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`double_dice_board_tiles\` DROP FOREIGN KEY \`FK_53827169eebfe432a226ee3892c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`double_dice_board_tiles\` DROP FOREIGN KEY \`FK_2ca51fc0b6e8de27fd6aeb2307f\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_53827169eebfe432a226ee3892\` ON \`double_dice_board_tiles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2ca51fc0b6e8de27fd6aeb2307\` ON \`double_dice_board_tiles\``,
    );
    await queryRunner.query(`DROP TABLE \`double_dice_board_tiles\``);
    await queryRunner.query(`DROP TABLE \`double_dice_board_tile\``);
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` ADD CONSTRAINT \`FK_ccc7ff9998c964fdd67d1987ac0\` FOREIGN KEY (\`who_is_card_id\`) REFERENCES \`who_is_card\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`true_or_false_tiles\` ADD CONSTRAINT \`FK_5272c218acdfc65e0019c6cad46\` FOREIGN KEY (\`true_or_false_tile_id\`) REFERENCES \`true_or_false_tile\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
