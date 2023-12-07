import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhaseTableAndRelations1692289421553
  implements MigrationInterface
{
  name = 'AddPhaseTableAndRelations1692289421553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP FOREIGN KEY \`FK_d106bbdeb481190491b3feddec7\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`phase\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`box_id\` int NULL, \`game_config_id\` int NULL, UNIQUE INDEX \`REL_c81529a003bdbc943bbd4f1a43\` (\`game_config_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` DROP COLUMN \`box_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`phase\` ADD CONSTRAINT \`FK_c3ad4b2d307787d927d1ed6b1fa\` FOREIGN KEY (\`box_id\`) REFERENCES \`box\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`phase\` ADD CONSTRAINT \`FK_c81529a003bdbc943bbd4f1a438\` FOREIGN KEY (\`game_config_id\`) REFERENCES \`game_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`phase\` DROP FOREIGN KEY \`FK_c81529a003bdbc943bbd4f1a438\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`phase\` DROP FOREIGN KEY \`FK_c3ad4b2d307787d927d1ed6b1fa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD \`box_id\` int NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_c81529a003bdbc943bbd4f1a43\` ON \`phase\``,
    );
    await queryRunner.query(`DROP TABLE \`phase\``);
    await queryRunner.query(
      `ALTER TABLE \`game_config\` ADD CONSTRAINT \`FK_d106bbdeb481190491b3feddec7\` FOREIGN KEY (\`box_id\`) REFERENCES \`box\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
