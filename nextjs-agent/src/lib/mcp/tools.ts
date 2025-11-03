/**
 * MCP (Model Context Protocol) Tool Definitions
 * Maps REST API endpoints to MCP tools with proper schemas
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export const MCP_TOOLS: MCPTool[] = [
  {
    name: "get_products",
    description: "Fetch products with optional filtering by category, price range, and stock availability",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter products by category (e.g., Electronics, Home & Kitchen)"
        },
        minPrice: {
          type: "number",
          description: "Minimum price filter",
          minimum: 0
        },
        maxPrice: {
          type: "number",
          description: "Maximum price filter",
          minimum: 0
        },
        inStock: {
          type: "boolean",
          description: "Filter to only show products in stock"
        }
      }
    }
  },
  {
    name: "create_product",
    description: "Create a new product in the catalog",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the product"
        },
        price: {
          type: "number",
          description: "Price of the product",
          minimum: 0
        },
        category: {
          type: "string",
          description: "Product category"
        },
        stock: {
          type: "number",
          description: "Number of items in stock",
          minimum: 0,
          default: 0
        },
        description: {
          type: "string",
          description: "Product description"
        }
      },
      required: ["name", "price", "category"]
    }
  }
];

/**
 * Get tool by name
 */
export function getTool(name: string): MCPTool | undefined {
  return MCP_TOOLS.find(tool => tool.name === name);
}

/**
 * List all available tools
 */
export function listTools(): MCPTool[] {
  return MCP_TOOLS;
}
