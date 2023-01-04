import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { envConfig } from './common/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public/'),
    }),
    MongooseModule.forRoot(process.env.MONGO_DB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
