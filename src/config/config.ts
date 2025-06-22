import { ConfigModuleOptions } from "@nestjs/config"
import { configValidationSchema } from "./config.schema"

const getEnvFilePath = (env: string | undefined) => {
    if (env === "test") {
      return "../.env.test"
    } else if (env === "development") {
      return "../.env.dev"
    }
  
    return "../.env"
  }
export const config: ConfigModuleOptions = {
    envFilePath: getEnvFilePath(process.env.NODE_ENV),
    isGlobal: true,
    validationSchema: configValidationSchema,
    validationOptions: {
      abortEarly: true,
      allowUnknown: true
    }
  }