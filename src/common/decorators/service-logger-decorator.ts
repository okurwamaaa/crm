import { Logger } from '@nestjs/common';
export interface ServiceComponent {
  execute(...args: any[]): Promise<any>;
}
export abstract class BaseServiceComponent implements ServiceComponent {
  abstract execute(...args: any[]): Promise<any>;
}
export abstract class ServiceDecorator implements ServiceComponent {
  constructor(protected component: ServiceComponent) {}
  execute(...args: any[]): Promise<any> {
    return this.component.execute(...args);
  }
}
export class LoggerDecorator extends ServiceDecorator {
  private logger: Logger;
  private options: LoggerDecoratorOptions;
  constructor(
    component: ServiceComponent,
    options: LoggerDecoratorOptions = {}
  ) {
    super(component);
    this.options = {
      level: 'log',
      includeParams: true,
      includeResult: false,
      includeExecutionTime: true,
      logErrors: true,
      ...options
    };
    this.logger = new Logger(`${component.constructor.name}:Logger`);
  }
  async execute(...args: any[]): Promise<any> {
    const startTime = Date.now();
    const methodName = `${this.component.constructor.name}.execute`;
    const message = this.options.customMessage || `Executing ${methodName}`;
    this.logger[this.options.level!](message);
    if (this.options.includeParams && args.length > 0) {
      this.logger[this.options.level!](`Parameters: ${JSON.stringify(args, null, 2)}`);
    }
    try {
      const result = await super.execute(...args);
      const executionTime = Date.now() - startTime;
      if (this.options.includeExecutionTime) {
        this.logger[this.options.level!](`${methodName} completed in ${executionTime}ms`);
      }
      if (this.options.includeResult) {
        this.logger[this.options.level!](`Result: ${JSON.stringify(result, null, 2)}`);
      }
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      if (this.options.logErrors) {
        this.logger.error(`Error in ${methodName} after ${executionTime}ms: ${error.message}`);
        this.logger.error(`Stack trace: ${error.stack}`);
      }
      throw error;
    }
  }
}
export interface LoggerDecoratorOptions {
  level?: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  includeParams?: boolean;
  includeResult?: boolean;
  includeExecutionTime?: boolean;
  customMessage?: string;
  logErrors?: boolean;
}
export class LoggerDecoratorFactory {
  static create(
    component: ServiceComponent,
    options: LoggerDecoratorOptions = {}
  ): LoggerDecorator {
    return new LoggerDecorator(component, options);
  }
} 
