/**
 * Tool Executor - Registry Pattern Implementation
 * Provides flexible, scalable tool execution with middleware support
 */

export interface ToolExecutor {
  name: string;
  execute(args: Record<string, unknown>, context: ExecutionContext): Promise<unknown>;
}

export interface ExecutionContext {
  baseUrl: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export class ToolRegistry {
  private executors: Map<string, ToolExecutor> = new Map();
  
  register(executor: ToolExecutor): void {
    this.executors.set(executor.name, executor);
  }
  
  get(name: string): ToolExecutor | undefined {
    return this.executors.get(name);
  }
  
  has(name: string): boolean {
    return this.executors.has(name);
  }
  
  list(): string[] {
    return Array.from(this.executors.keys());
  }
}

// Individual tool executors
export class GetProductsExecutor implements ToolExecutor {
  name = 'get_products';
  
  async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<unknown> {
    const { category, minPrice, maxPrice, inStock } = args;
    
    const url = new URL('/api/products', context.baseUrl);
    if (category) url.searchParams.set('category', String(category));
    if (minPrice) url.searchParams.set('minPrice', String(minPrice));
    if (maxPrice) url.searchParams.set('maxPrice', String(maxPrice));
    if (inStock) url.searchParams.set('inStock', String(inStock));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('API request timeout after 5000ms');
      }
      throw error;
    }
  }
}

export class CreateProductExecutor implements ToolExecutor {
  name = 'create_product';
  
  async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<unknown> {
    const { name, price, category, stock, description } = args;
    
    const url = new URL('/api/products', context.baseUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({ name, price, category, stock, description })
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('API request timeout after 5000ms');
      }
      throw error;
    }
  }
}

// Tool middleware support
export type ToolMiddleware = (
  executor: ToolExecutor,
  args: Record<string, unknown>,
  context: ExecutionContext,
  next: () => Promise<unknown>
) => Promise<unknown>;

export class ToolExecutionPipeline {
  private middlewares: ToolMiddleware[] = [];
  
  use(middleware: ToolMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }
  
  async execute(
    executor: ToolExecutor,
    args: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<unknown> {
    let index = 0;
    
    const next = async (): Promise<unknown> => {
      if (index >= this.middlewares.length) {
        return executor.execute(args, context);
      }
      
      const middleware = this.middlewares[index++];
      return middleware(executor, args, context, next);
    };
    
    return next();
  }
}

// Example middlewares
export const loggingMiddleware: ToolMiddleware = async (executor, args, context, next) => {
  console.log(`[Tool] Executing ${executor.name}`, { args, requestId: context.requestId });
  const start = Date.now();
  
  try {
    const result = await next();
    const duration = Date.now() - start;
    console.log(`[Tool] Completed ${executor.name} in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[Tool] Failed ${executor.name} after ${duration}ms`, error);
    throw error;
  }
};

export const cachingMiddleware: ToolMiddleware = async (executor, args, context, next) => {
  // Only cache read operations
  if (!executor.name.startsWith('get_') && !executor.name.startsWith('list_')) {
    return next();
  }
  
  const cacheKey = `${executor.name}:${JSON.stringify(args)}`;
  // In production, use Redis or similar
  // const cached = await cache.get(cacheKey);
  // if (cached) return cached;
  
  const result = await next();
  // await cache.set(cacheKey, result, { ttl: 300 });
  return result;
};
