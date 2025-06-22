import { Logger } from '@nestjs/common';
export interface LoggerDecoratorOptions {
  level?: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  includeParams?: boolean;
  includeResult?: boolean;
  includeExecutionTime?: boolean;
  customMessage?: string;
  logErrors?: boolean;
}
export const LoggerDecorator = (options: LoggerDecoratorOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const {
      level = 'log',
      includeParams = true,
      includeResult = false,
      includeExecutionTime = true,
      customMessage,
      logErrors = true
    } = options;
    const originalMethod = descriptor.value;
    const logger = new Logger(`${target.constructor.name}:${propertyKey}`);
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const methodName = `${target.constructor.name}.${propertyKey}`;
      const message = customMessage || `Executing ${methodName}`;
      logger[level](message);
      if (includeParams && args.length > 0) {
        logger[level](`Parameters: ${JSON.stringify(args, null, 2)}`);
      }
      try {
        const result = await originalMethod.apply(this, args);
        const executionTime = Date.now() - startTime;
        if (includeExecutionTime) {
          logger[level](`${methodName} completed in ${executionTime}ms`);
        }
        if (includeResult) {
          logger[level](`Result: ${JSON.stringify(result, null, 2)}`);
        }
        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;
        if (logErrors) {
          logger.error(`Error in ${methodName} after ${executionTime}ms: ${error.message}`);
          logger.error(`Stack trace: ${error.stack}`);
        }
        throw error;
      }
    };
    return descriptor;
  };
}; 
