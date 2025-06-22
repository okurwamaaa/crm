import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { config } from "./config/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { CacheModule } from "@nestjs/cache-manager";
import { getCacheConfig } from "./config/cache.config";
import { getSequelizeConfig } from "./config/database.config";
@Module({
  imports: [
    ConfigModule.forRoot(config),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: getCacheConfig,
      inject: [ConfigService]
    })
  ],
  exports: [ConfigModule]
})
export class AppModule {}
