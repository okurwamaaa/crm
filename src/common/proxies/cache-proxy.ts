import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
export interface ServiceInterface {
  execute(...args: any[]): Promise<any>;
}
export abstract class BaseService implements ServiceInterface {
  abstract execute(...args: any[]): Promise<any>;
}
@Injectable()
export class CacheProxy implements ServiceInterface {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private realSubject: ServiceInterface,
    private cacheOptions: CacheProxyOptions = {}
  ) {}
  async execute(...args: any[]): Promise<any> {
    const { ttl = 300, key, prefix = 'cache' } = this.cacheOptions;
    const cacheKey = key || `${prefix}:${this.realSubject.constructor.name}:execute`;
    const dynamicKey = this.generateCacheKey(cacheKey, args);
    try {
      const cachedValue = await this.cacheManager.get(dynamicKey);
      if (cachedValue !== undefined && cachedValue !== null) {
        return cachedValue;
      }
      const result = await this.realSubject.execute(...args);
      if (result !== null && result !== undefined) {
        await this.cacheManager.set(dynamicKey, result, ttl * 1000);
      }
      return result;
    } catch (error) {
      console.error(`Cache proxy error:`, error);
      return this.realSubject.execute(...args);
    }
  }
  private generateCacheKey(baseKey: string, args: any[]): string {
    if (!args || args.length === 0) {
      return baseKey;
    }
    const argsHash = JSON.stringify(args);
    return `${baseKey}:${Buffer.from(argsHash).toString('base64').slice(0, 16)}`;
  }
}
export interface CacheProxyOptions {
  ttl?: number;
  key?: string;
  prefix?: string;
}
export class CacheProxyFactory {
  static create(
    cacheManager: Cache,
    realSubject: ServiceInterface,
    options: CacheProxyOptions = {}
  ): CacheProxy {
    return new CacheProxy(cacheManager, realSubject, options);
  }
} 
