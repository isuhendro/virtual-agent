import { NextRequest, NextResponse } from 'next/server';
import { MCPServer, MCPRequest } from '@/lib/mcp/server';
import { MCPTool, listTools } from '@/lib/mcp/tools';

/**
 * POST /api/mcp
 * MCP (Model Context Protocol) Server Endpoint
 * Handles MCP protocol requests and maps them to internal REST APIs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate MCP request format
    if (!body.jsonrpc || body.jsonrpc !== '2.0') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request: jsonrpc must be "2.0"'
        }
      }, { status: 400 });
    }

    if (!body.method) {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request: method is required'
        }
      }, { status: 400 });
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

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('MCP Server Error:', error);
    
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      }
    }, { status: 500 });
  }
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
      description: 'Model Context Protocol server wrapping REST APIs',
      capabilities: {
        tools: true,
        ping: true
      },
      endpoints: {
        products: '/api/products'
      },
      tools: tools.map((tool: MCPTool) => ({
        name: tool.name,
        description: tool.description
      })),
      usage: {
        list_tools: {
          method: 'POST',
          body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list'
          }
        },
        call_tool: {
          method: 'POST',
          body: {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'get_products',
              arguments: { category: 'Electronics' }
            }
          }
        },
        ping: {
          method: 'POST',
          body: {
            jsonrpc: '2.0',
            id: 3,
            method: 'ping'
          }
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
