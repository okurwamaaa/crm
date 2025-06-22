import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { ConfigService } from "@nestjs/config"
export const getSequelizeConfig = (
  configService: ConfigService
): SequelizeModuleOptions => ({
  dialect: "postgres",
  host: configService.get<string>("POSTGRES_HOST"),
  port: Number(configService.get<number>("POSTGRES_PORT")),
  username: configService.get<string>("POSTGRES_USER"),
  password: configService.get<string>("POSTGRES_PASSWORD"),
  database: configService.get<string>("POSTGRES_DB"),
  autoLoadModels: true,
  synchronize: configService.get<string>("NODE_ENV") !== "production",
  logging: configService.get<string>("NODE_ENV") === "production"
})