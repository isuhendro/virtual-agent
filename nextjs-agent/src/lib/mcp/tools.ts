import Ajv from 'ajv';  // Add ajv for JSON Schema validation

/**
 * MCP (Model Context Protocol) Tool Definitions
 * Maps REST API endpoints to MCP tools with proper schemas and validation
 */

// Import content types from server
export type MCPContentType = 'text' | 'image' | 'resource';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;  // Add this field
  };
  outputContentTypes?: MCPContentType[];  // Add supported output content types
}

// Create validator instance
const ajv = new Ajv({ allErrors: true });

export const MCP_TOOLS: MCPTool[] = [
  {
    name: "get_products",
    description: "Fetch products with optional filtering by category, price range, and stock availability",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter products by category",
          enum: ["Electronics", "Home & Kitchen", "Office Supplies"],  // Add enum
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
      },
      additionalProperties: false  // Prevent unknown properties
    },
    outputContentTypes: ['text']  // Products API returns JSON/text data
  },
  {
    name: "create_product",
    description: "Create a new product in the catalog",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the product",
          minLength: 1,      // Add string constraints
          maxLength: 200
        },
        price: {
          type: "number",
          description: "Price of the product",
          exclusiveMinimum: 0  // Price must be > 0
        },
        category: {
          type: "string",
          description: "Product category",
          enum: ["Electronics", "Home & Kitchen", "Office Supplies"]  // Match get_products
        },
        stock: {
          type: "integer",  // Should be integer, not just number
          description: "Number of items in stock",
          minimum: 0,
          default: 0
        },
        description: {
          type: "string",
          description: "Product description",
          maxLength: 1000
        }
      },
      required: ["name", "price", "category"],
      additionalProperties: false
    },
    outputContentTypes: ['text']  // Product creation returns JSON/text confirmation
  }
];

/**
 * Validate tool arguments against its schema
 */
export function validateToolArguments(
  toolName: string, 
  args: Record<string, unknown>
): { valid: boolean; errors?: string[] } {
  const tool = getTool(toolName);
  if (!tool) {
    return { valid: false, errors: [`Tool not found: ${toolName}`] };
  }
  
  const validate = ajv.compile(tool.inputSchema);
  const valid = validate(args);
  
  if (!valid && validate.errors) {
    return {
      valid: false,
      errors: validate.errors.map(err => 
        `${err.instancePath} ${err.message}`
      )
    };
  }
  
  return { valid: true };
}

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
