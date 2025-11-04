/**
 * MCP Server Implementation
 * Handles MCP protocol communication and executes tools with full content type support
 */

import { MCPTool, getTool, validateToolArguments, listTools } from './tools';
import { 
  ToolRegistry, 
  GetProductsExecutor, 
  CreateProductExecutor,
  ToolExecutionPipeline,
  loggingMiddleware,
  ExecutionContext
} from './tool-executor';

// Content type definitions according to MCP specification
export type MCPContentType = 'text' | 'image' | 'resource';

// Server capabilities interface
export interface MCPServerCapabilities {
  tools: boolean;
  resources?: boolean;
  prompts?: boolean;
  logging?: boolean;
}

export interface MCPServerInfo {
  name: string;
  version: string;
  protocolVersion: string;
  capabilities: MCPServerCapabilities;
}

export interface MCPTextContent {
  type: 'text';
  text: string;
}

export interface MCPImageContent {
  type: 'image';
  data: string;  // base64 or URL
  mimeType: string;
}

export interface MCPResourceContent {
  type: 'resource';
  uri: string;
  mimeType?: string;
}

export type MCPContent = MCPTextContent | MCPImageContent | MCPResourceContent;

export interface MCPToolResult {
  content: MCPContent[];
  isError?: boolean;
  _meta?: {
    tool: string;
    executionTimeMs: number;
    timestamp: string;
  };
}

export interface MCPRequest {
  jsonrpc: '2.0';  // Literal type ensures only valid version
  id: string | number | null;  // Allow null for notifications
  method: string;
  params?: Record<string, unknown> | unknown[];  // More specific than any
}

export interface MCPNotification extends Omit<MCPRequest, 'id'> {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown> | unknown[];
}

export interface MCPResponse {
  jsonrpc: '2.0';  // Consistent literal type
  id: string | number | null;  // Match request id type
  result?: MCPToolResult | unknown;  // Support tool results and other response types
  error?: {
    code: number;
    message: string;
    data?: unknown;  // More specific than any
  };
}

export interface MCPToolCallResponse {
  jsonrpc: '2.0';
  id: string | number;
  result: MCPToolResult;
}

// Updated tool call interface (removed unused interface and made it more specific)
export interface MCPToolCallRequest {
  name: string;
  arguments: Record<string, unknown>;  // More specific than any
}

export class MCPServer {
  private baseUrl: string;
  private serverInfo: MCPServerInfo;
  private toolRegistry: ToolRegistry;
  private executionPipeline: ToolExecutionPipeline;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.toolRegistry = new ToolRegistry();
    this.executionPipeline = new ToolExecutionPipeline();
    
    // Register tools
    this.toolRegistry.register(new GetProductsExecutor());
    this.toolRegistry.register(new CreateProductExecutor());
    
    // Add middlewares
    this.executionPipeline.use(loggingMiddleware);
    
    this.serverInfo = {
      name: 'NextJS MCP Server',
      version: '1.0.0',
      protocolVersion: '2.0',
      capabilities: {
        tools: true,
        resources: false,  // Not implemented yet
        prompts: false,    // Not implemented yet
        logging: false     // Not implemented yet
      }
    };
  }

  /**
   * Handle MCP request with proper notification support
   * Returns null for notifications (requests with id: null), responses for regular requests
   */
  async handleRequest(request: MCPRequest): Promise<MCPResponse | null> {
    const isNotification = request.id === null || request.id === undefined;
    
    try {
      let result: any;
      
      switch (request.method) {
        case 'initialize':  // Add initialize method
          result = this.handleInitialize(request);
          break;
        case 'tools/list':
          result = this.handleToolsList(request);
          break;
        case 'tools/call':
          result = await this.handleToolCall(request);
          break;
        case 'ping':
          result = this.handlePing(request);
          break;
        default:
          if (isNotification) return null;  // No response for notification errors
          return this.createErrorResponse(
            request.id, 
            -32601, 
            `Method not found: ${request.method}`
          );
      }
      
      // Notifications don't get responses, even on success
      if (isNotification) return null;
      
      return result;
    } catch (error: unknown) {
      if (isNotification) return null;  // No error response for notifications
      
      const errorMessage = error instanceof Error ? error.message : 'Internal error';
      return this.createErrorResponse(request.id, -32603, errorMessage);
    }
  }

  /**
   * Handle initialize request - returns server info and capabilities
   */
  private handleInitialize(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        serverInfo: this.serverInfo,
        capabilities: this.serverInfo.capabilities
      }
    };
  }

  /**
   * Handle tools/list request with enhanced metadata
   */
  private handleToolsList(request: MCPRequest): MCPResponse {
    const tools = listTools();

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools: tools.map((tool: MCPTool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          // Add enhanced metadata
          category: this.getToolCategory(tool.name),
          version: '1.0.0',
          deprecated: false,
          outputContentTypes: tool.outputContentTypes || ['text'],
          // Add rate limit info for production readiness
          rateLimit: {
            requests: 100,
            window: '1m'
          },
          // Add tool-specific metadata
          metadata: {
            complexity: this.getToolComplexity(tool.name),
            estimatedResponseTime: this.getEstimatedResponseTime(tool.name),
            requiresAuth: false,
            cost: 'free'
          }
        }))
      }
    };
  }

  /**
   * Handle tools/call request
   */
  private async handleToolCall(request: MCPRequest): Promise<MCPResponse> {
    // Safe parameter extraction with proper validation
    if (!request.params || typeof request.params !== 'object') {
      return this.createErrorResponse(request.id, -32602, 'Invalid params: expected object');
    }
    
    const params = request.params as { name?: string; arguments?: Record<string, unknown> };
    const { name, arguments: args } = params;
    
    if (!name || typeof name !== 'string') {
      return this.createErrorResponse(request.id, -32602, 'Tool name is required and must be a string');
    }

    const tool = getTool(name);
    if (!tool) {
      return this.createErrorResponse(request.id, -32602, `Unknown tool: ${name}`);
    }

    // Validate tool arguments against schema
    const validation = validateToolArguments(name, args || {});
    if (!validation.valid) {
      return this.createErrorResponse(
        request.id, 
        -32602, 
        `Invalid tool arguments: ${validation.errors?.join(', ')}`
      );
    }

    try {
      const startTime = Date.now();
      const result = await this.executeTool(name, args || {}, request.id?.toString());
      const executionTime = Date.now() - startTime;
      
      // Determine content type based on result structure
      let content: MCPContent[];
      
      if (this.isImageResult(result)) {
        content = [{
          type: 'image',
          data: result.data,
          mimeType: result.mimeType || 'image/png'
        }];
      } else if (this.isResourceResult(result)) {
        content = [{
          type: 'resource',
          uri: result.uri,
          mimeType: result.mimeType
        }];
      } else {
        // Default to text content
        let serializedResult: string;
        try {
          serializedResult = typeof result === 'string' 
            ? result 
            : JSON.stringify(result, null, 2);
        } catch (serializationError) {
          serializedResult = JSON.stringify({
            error: 'Result serialization failed',
            message: serializationError instanceof Error ? serializationError.message : 'Unknown error'
          });
        }
        
        content = [{
          type: 'text',
          text: serializedResult
        }];
      }
      
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content,
          isError: false,
          _meta: {
            tool: name,
            executionTimeMs: executionTime,
            timestamp: new Date().toISOString()
          }
        }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Tool execution failed';
      
      // Return errors as content with isError flag
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [{
            type: 'text',
            text: errorMessage
          }],
          isError: true,
          _meta: {
            tool: name,
            executionTimeMs: 0,
            timestamp: new Date().toISOString()
          }
        }
      };
    }
  }

  /**
   * Handle ping request
   */
  private handlePing(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        status: 'pong',
        timestamp: new Date().toISOString(),
        server: 'NextJS MCP Server'
      }
    };
  }

  /**
   * Execute a tool by calling the corresponding REST API
   * Note: Tool existence is validated in handleToolCall before reaching here
   */
  private async executeTool(
    toolName: string, 
    args: Record<string, unknown>,
    requestId?: string
  ): Promise<unknown> {
    const executor = this.toolRegistry.get(toolName);
    
    if (!executor) {
      throw new Error(`Tool not implemented: ${toolName}`);
    }
    
    const context: ExecutionContext = {
      baseUrl: this.baseUrl,
      requestId: requestId || crypto.randomUUID(),
      metadata: {}
    };
    
    return this.executionPipeline.execute(executor, args, context);
  }

  /**
   * Create error response
   */
  private createErrorResponse(id: string | number | null, code: number, message: string): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message
      }
    };
  }

  /**
   * Check if result is an image content type
   */
  private isImageResult(result: unknown): result is { data: string; mimeType?: string; type: 'image' } {
    return (
      result !== null &&
      typeof result === 'object' &&
      'type' in result &&
      (result as any).type === 'image' &&
      'data' in result &&
      typeof (result as any).data === 'string'
    );
  }

  /**
   * Check if result is a resource content type
   */
  private isResourceResult(result: unknown): result is { uri: string; mimeType?: string; type: 'resource' } {
    return (
      result !== null &&
      typeof result === 'object' &&
      'type' in result &&
      (result as any).type === 'resource' &&
      'uri' in result &&
      typeof (result as any).uri === 'string'
    );
  }

  /**
   * Categorize tools for better organization
   */
  private getToolCategory(toolName: string): string {
    if (toolName.startsWith('get_') || toolName.startsWith('list_') || toolName.startsWith('search_')) {
      return 'query';
    }
    if (toolName.startsWith('create_') || toolName.startsWith('add_')) {
      return 'create';
    }
    if (toolName.startsWith('update_') || toolName.startsWith('modify_') || toolName.startsWith('edit_')) {
      return 'update';
    }
    if (toolName.startsWith('delete_') || toolName.startsWith('remove_')) {
      return 'delete';
    }
    if (toolName.includes('export') || toolName.includes('download')) {
      return 'export';
    }
    if (toolName.includes('import') || toolName.includes('upload')) {
      return 'import';
    }
    return 'utility';
  }

  /**
   * Determine tool complexity for client optimization
   */
  private getToolComplexity(toolName: string): 'low' | 'medium' | 'high' {
    // Simple getter operations
    if (toolName.startsWith('get_') || toolName.startsWith('list_')) {
      return 'low';
    }
    // Creation and updates typically more complex
    if (toolName.startsWith('create_') || toolName.startsWith('update_')) {
      return 'medium';
    }
    // Bulk operations, exports, complex queries
    if (toolName.includes('bulk') || toolName.includes('export') || toolName.includes('search')) {
      return 'high';
    }
    return 'medium';
  }

  /**
   * Estimate response time for client optimization
   */
  private getEstimatedResponseTime(toolName: string): string {
    const complexity = this.getToolComplexity(toolName);
    
    switch (complexity) {
      case 'low':
        return '< 500ms';
      case 'medium':
        return '500ms - 2s';
      case 'high':
        return '2s - 10s';
      default:
        return '< 2s';
    }
  }

  /**
   * Enhanced API call method with proper error handling, timeout, and type safety
   */
  private async callAPI<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: Record<string, unknown>,
    queryParams?: Record<string, unknown>
  ): Promise<T> {
    // Build URL with query parameters (works for all methods)
    const url = new URL(endpoint, this.baseUrl);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle arrays and objects properly
          if (Array.isArray(value)) {
            value.forEach(item => url.searchParams.append(key, String(item)));
          } else if (typeof value === 'object') {
            url.searchParams.append(key, JSON.stringify(value));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        ...(body && method !== 'GET' && { body: JSON.stringify(body) })
      });
      
      clearTimeout(timeoutId);
      
      // Get response text first for better error messages
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}. Body: ${responseText.substring(0, 200)}`
        );
      }
      
      // Validate JSON response
      try {
        return JSON.parse(responseText) as T;
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }
      
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`API request timeout after 5000ms: ${method} ${endpoint}`);
        }
        throw error;
      }
      
      throw new Error('Unknown error during API call');
    }
  }
}
