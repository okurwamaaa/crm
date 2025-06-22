import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
export interface CacheProxyOptions {
  ttl?: number; 
  key?: string; 
  prefix?: string; 
}
export const CACHE_MANAGER_KEY = 'CACHE_MANAGER';
export const CacheProxy = (options: CacheProxyOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const { ttl = 300, key, prefix = 'cache' } = options; 
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const cacheManager = (this as any)[CACHE_MANAGER_KEY] || 
                          (this as any).cacheManager || 
                          (this as any).cache;
      if (!cacheManager) {
        console.warn(`Cache manager not found for ${target.constructor.name}.${propertyKey}`);
        return originalMethod.apply(this, args);
      }
      const cacheKey = key || `${prefix}:${target.constructor.name}:${propertyKey}`;
      const dynamicKey = generateCacheKey(cacheKey, args);
      try {
        const cachedValue = await cacheManager.get(dynamicKey);
        if (cachedValue !== undefined && cachedValue !== null) {
          return cachedValue;
        }
        const result = await originalMethod.apply(this, args);
        if (result !== null && result !== undefined) {
          await cacheManager.set(dynamicKey, result, ttl * 1000); 
        }
        return result;
      } catch (error) {
        console.error(`Cache proxy error for ${target.constructor.name}.${propertyKey}:`, error);
        return originalMethod.apply(this, args);
      }
    };
    return descriptor;
  };
};
function generateCacheKey(baseKey: string, args: any[]): string {
  if (!args || args.length === 0) {
    return baseKey;
  }
  const argsHash = JSON.stringify(args);
  return `${baseKey}:${Buffer.from(argsHash).toString('base64').slice(0, 16)}`;
} 
