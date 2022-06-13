import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import ormConfig from './config/orm.config';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [ormConfig, jwtConfig],
      expandVariables: true,
      ignoreEnvFile: Boolean(process.env.IGNORE_ENV_FILE || false) // when using docker env set to true
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    AuthModule,
    UsersModule,
    SharedModule,
  ],
})
export class AppModule { }
