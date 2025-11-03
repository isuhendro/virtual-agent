/**
 * MCP Server Implementation
 * Handles MCP protocol communication and executes tools
 */

import { MCPTool, getTool } from './tools';

export interface MCPRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export class MCPServer {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Handle MCP request
   */
  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      switch (request.method) {
        case 'tools/list':
          return this.handleToolsList(request);
        case 'tools/call':
          return await this.handleToolCall(request);
        case 'ping':
          return this.handlePing(request);
        default:
          return this.createErrorResponse(request.id, -32601, `Method not found: ${request.method}`);
      }
    } catch (error: any) {
      return this.createErrorResponse(request.id, -32603, error.message || 'Internal error');
    }
  }

  /**
   * Handle tools/list request
   */
  private handleToolsList(request: MCPRequest): MCPResponse {
    const { listTools } = require('./tools');
    const tools = listTools();

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools: tools.map((tool: MCPTool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      }
    };
  }

  /**
   * Handle tools/call request
   */
  private async handleToolCall(request: MCPRequest): Promise<MCPResponse> {
    const { name, arguments: args } = request.params;

    if (!name) {
      return this.createErrorResponse(request.id, -32602, 'Tool name is required');
    }

    const tool = getTool(name);
    if (!tool) {
      return this.createErrorResponse(request.id, -32602, `Unknown tool: ${name}`);
    }

    try {
      const result = await this.executeTool(name, args || {});
      
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      };
    } catch (error: any) {
      return this.createErrorResponse(request.id, -32603, `Tool execution failed: ${error.message}`);
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
   */
  private async executeTool(toolName: string, args: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'get_products':
        return await this.callAPI('GET', '/api/products', null, args);
      
      case 'create_product':
        return await this.callAPI('POST', '/api/products', args);
      
      default:
        throw new Error(`Tool not implemented: ${toolName}`);
    }
  }

  /**
   * Call internal REST API
   */
  private async callAPI(
    method: 'GET' | 'POST', 
    endpoint: string, 
    body?: any, 
    queryParams?: Record<string, any>
  ): Promise<any> {
    let url = `${this.baseUrl}${endpoint}`;

    // Add query parameters for GET requests
    if (method === 'GET' && queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create error response
   */
  private createErrorResponse(id: string | number, code: number, message: string): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message
      }
    };
  }
}
