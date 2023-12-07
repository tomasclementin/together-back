import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserBoxGameconfigTables1688664326649
  implements MigrationInterface
{
  name = 'CreateUserBoxGameconfigTables1688664326649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`box\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game_config\` (\`id\` int NOT NULL AUTO_INCREMENT, \`config_type\` varchar(255) NOT NULL, \`game_name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`box_id\` int NULL, INDEX \`IDX_f04a53f4cf757d123cd70861c2\` (\`config_type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`external_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`phone_number\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_d9479cbc9c65660b7cf9b65795\` (\`external_id\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`who_is_card\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`who_is_cards\` (\`game_config_id\` int NOT NULL, \`who_is_card_id\` int NOT NULL, INDEX \`IDX_043f2e2a666b509c070f607b37\` (\`game_config_id\`), INDEX \`IDX_ccc7ff9998c964fdd67d1987ac\` (\`who_is_card_id\`), PRIMARY KEY (\`game_config_id\`, \`who_is_card_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD CONSTRAINT \`FK_d106bbdeb481190491b3feddec7\` FOREIGN KEY (\`box_id\`) REFERENCES \`box\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`who_is_cards\` ADD CONSTRAINT \`FK_043f2e2a666b509c070f607b374\` FOREIGN KEY (\`game_config_id\`) REFERENCES \`game_config\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE \`who_is_cards\` DROP FOREIGN KEY \`FK_043f2e2a666b509c070f607b374\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP FOREIGN KEY \`FK_d106bbdeb481190491b3feddec7\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ccc7ff9998c964fdd67d1987ac\` ON \`who_is_cards\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_043f2e2a666b509c070f607b37\` ON \`who_is_cards\``,
    );
    await queryRunner.query(`DROP TABLE \`who_is_cards\``);
    await queryRunner.query(`DROP TABLE \`who_is_card\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d9479cbc9c65660b7cf9b65795\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f04a53f4cf757d123cd70861c2\` ON \`game_config\``,
    );
    await queryRunner.query(`DROP TABLE \`game_config\``);
    await queryRunner.query(`DROP TABLE \`box\``);
  }
}
