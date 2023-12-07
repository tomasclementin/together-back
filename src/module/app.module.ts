import { DataSource } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import { BoxModule } from './box/box.module';
import { GameConfigModule } from './game-config/game-config.module';
import { GameModule } from './game/game.module';
import { LobbyModule } from './lobby/lobby.module';
import { PhaseModule } from './phase/phase.module';
import { UserModule } from './user/user.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { datasourceOptions } from '@root/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    LobbyModule,
    AuthModule,
    UserModule,
    BoxModule,
    GameConfigModule,
    GameModule,
    PhaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
