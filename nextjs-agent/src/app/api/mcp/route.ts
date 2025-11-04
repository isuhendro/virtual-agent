import { NextRequest, NextResponse } from 'next/server';
import { MCPServer, MCPRequest } from '@/lib/mcp/server';
import { MCPTool, listTools } from '@/lib/mcp/tools';

/**
 * POST /api/mcp
 * MCP (Model Context Protocol) Server Endpoint
 * Handles MCP protocol requests and maps them to internal REST APIs
 * 
 * Supports JSON-RPC 2.0 notifications (requests with id: null) which return 204 No Content
 * Implements comprehensive JSON-RPC 2.0 error handling with proper status codes
 */
export async function POST(request: NextRequest) {
  let body: any;
  
  // Handle parse errors with proper JSON-RPC error code
  try {
    body = await request.json();
  } catch (parseError) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error',
        data: parseError instanceof Error ? parseError.message : 'Invalid JSON'
      }
    }, { status: 200 });  // JSON-RPC errors use HTTP 200
  }
  
  // Handle batch requests
  if (Array.isArray(body)) {
    return handleBatchRequest(body, request);
  }
  
  // Validate request structure
  const validationError = validateRequest(body);
  if (validationError) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body?.id ?? null,
      error: validationError
    }, { status: 200 });
  }
  
  // Get the base URL for internal API calls
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || 'localhost:3001';
  const baseUrl = `${protocol}://${host}`;
  
  // Initialize MCP server
  const mcpServer = new MCPServer(baseUrl);
  
  // Handle the MCP request
  const mcpRequest: MCPRequest = {
    jsonrpc: body.jsonrpc,
    id: body.id,
    method: body.method,
    params: body.params
  };
  
  const response = await mcpServer.handleRequest(mcpRequest);
  
  // Return null for notifications (no response needed)
  if (response === null) {
    return new NextResponse(null, { status: 204 });  // No content
  }
  
  return NextResponse.json(response, { status: 200 });
}

/**
 * GET /api/mcp
 * Returns MCP server information and available tools
 */
export async function GET() {
  try {
    const tools = listTools();

    return NextResponse.json({
      server: 'NextJS MCP Server',
      version: '1.0.0',
      protocol: 'MCP/2.0',
      description: 'Model Context Protocol server wrapping REST APIs with comprehensive metadata support',
      capabilities: {
        tools: true,
        resources: false,  // Not implemented yet
        prompts: false,    // Not implemented yet
        logging: false,    // Not implemented yet
        ping: true
      },
      endpoints: {
        products: '/api/products'
      },
      tools: tools.map((tool: MCPTool) => ({
        name: tool.name,
        description: tool.description,
        category: tool.name.startsWith('get_') ? 'query' : 
                 tool.name.startsWith('create_') ? 'create' : 'utility',
        outputContentTypes: tool.outputContentTypes || ['text']
      })),
      usage: {
        initialize: {
          method: 'POST',
          description: 'Initialize server connection and discover capabilities - Required first step for MCP clients',
          body: {
            jsonrpc: '2.0',
            id: 0,
            method: 'initialize',
            params: {
              clientInfo: {
                name: 'MyClient',
                version: '1.0.0'
              },
              capabilities: {
                experimental: {},
                sampling: {}
              }
            }
          },
          response: {
            serverInfo: {
              name: 'NextJS MCP Server',
              version: '1.0.0',
              protocolVersion: '2.0',
              capabilities: {
                tools: true,
                resources: false,
                prompts: false,
                logging: false
              }
            },
            capabilities: {
              tools: true,
              resources: false,
              prompts: false,
              logging: false
            }
          }
        },
        list_tools: {
          method: 'POST',
          description: 'List all available tools with comprehensive metadata and categorization',
          body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list'
          },
          response: {
            tools: [
              {
                name: 'get_products',
                description: 'Fetch products with optional filtering by category, price range, and stock availability',
                inputSchema: {
                  type: 'object',
                  properties: {
                    category: { type: 'string', enum: ['Electronics', 'Home & Kitchen', 'Office Supplies'] },
                    minPrice: { type: 'number', minimum: 0 },
                    maxPrice: { type: 'number', minimum: 0 },
                    inStock: { type: 'boolean' }
                  },
                  additionalProperties: false
                },
                category: 'query',
                version: '1.0.0',
                deprecated: false,
                outputContentTypes: ['text'],
                rateLimit: { requests: 100, window: '1m' },
                metadata: {
                  complexity: 'low',
                  estimatedResponseTime: '< 500ms',
                  requiresAuth: false,
                  cost: 'free'
                }
              },
              {
                name: 'create_product',
                description: 'Create a new product in the catalog',
                category: 'create',
                version: '1.0.0',
                deprecated: false,
                outputContentTypes: ['text'],
                rateLimit: { requests: 100, window: '1m' },
                metadata: {
                  complexity: 'medium',
                  estimatedResponseTime: '500ms - 2s',
                  requiresAuth: false,
                  cost: 'free'
                }
              }
            ]
          }
        },
        call_tool: {
          method: 'POST',
          description: 'Execute a tool with arguments and get results',
          body: {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'get_products',
              arguments: { 
                category: 'Electronics',
                maxPrice: 100
              }
            }
          },
          response: {
            content: [
              {
                type: 'text',
                text: 'JSON response data'
              }
            ],
            isError: false,
            _meta: {
              tool: 'get_products',
              executionTimeMs: 45,
              timestamp: '2025-11-04T10:00:00.000Z'
            }
          }
        },
        ping: {
          method: 'POST',
          description: 'Health check endpoint',
          body: {
            jsonrpc: '2.0',
            id: 3,
            method: 'ping'
          },
          response: {
            message: 'pong',
            timestamp: '2025-11-04T10:00:00.000Z'
          }
        },
        notification_example: {
          method: 'POST',
          description: 'Fire-and-forget notification (no response)',
          body: {
            jsonrpc: '2.0',
            method: 'ping'
            // Note: No 'id' field = notification
          },
          response: 'HTTP 204 No Content'
        },
        batch_request: {
          method: 'POST',
          description: 'Execute multiple requests in a single call',
          body: [
            {
              jsonrpc: '2.0',
              id: 1,
              method: 'tools/list'
            },
            {
              jsonrpc: '2.0',
              id: 2,
              method: 'ping'
            }
          ],
          response: [
            { /* tools/list response */ },
            { /* ping response */ }
          ]
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to get MCP server info',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Validate JSON-RPC request structure
 */
function validateRequest(body: any): { code: number; message: string; data?: any } | null {
  if (!body || typeof body !== 'object') {
    return {
      code: -32600,
      message: 'Invalid Request',
      data: 'Request body must be an object'
    };
  }
  
  if (!body.jsonrpc || body.jsonrpc !== '2.0') {
    return {
      code: -32600,
      message: 'Invalid Request',
      data: 'jsonrpc must be "2.0"'
    };
  }
  
  if (!body.method || typeof body.method !== 'string') {
    return {
      code: -32600,
      message: 'Invalid Request',
      data: 'method is required and must be a string'
    };
  }
  
  if (body.params !== undefined && typeof body.params !== 'object') {
    return {
      code: -32600,
      message: 'Invalid Request',
      data: 'params must be an object or array if provided'
    };
  }
  
  return null;
}

/**
 * Handle batch requests (array of requests)
 */
async function handleBatchRequest(
  requests: any[], 
  request: NextRequest
): Promise<NextResponse> {
  if (requests.length === 0) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32600,
        message: 'Invalid Request',
        data: 'Batch request must contain at least one request'
      }
    }, { status: 200 });
  }
  
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || 'localhost:3001';
  const baseUrl = `${protocol}://${host}`;
  const mcpServer = new MCPServer(baseUrl);
  
  const responses = await Promise.all(
    requests.map(async (req) => {
      const validationError = validateRequest(req);
      if (validationError) {
        return {
          jsonrpc: '2.0',
          id: req?.id ?? null,
          error: validationError
        };
      }
      
      return await mcpServer.handleRequest(req);
    })
  );
  
  // Filter out null responses (notifications)
  const filteredResponses = responses.filter(r => r !== null);
  
  // If all were notifications, return 204
  if (filteredResponses.length === 0) {
    return new NextResponse(null, { status: 204 });
  }
  
  return NextResponse.json(filteredResponses, { status: 200 });
}
