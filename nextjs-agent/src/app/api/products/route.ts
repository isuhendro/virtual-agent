import { NextRequest, NextResponse } from 'next/server';

// Dummy product data
const DUMMY_PRODUCTS = [
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    price: 99.99, 
    category: 'Electronics', 
    stock: 45, 
    description: 'High-quality wireless headphones with noise cancellation',
    createdAt: '2025-01-20T08:00:00Z'
  },
  { 
    id: 2, 
    name: 'Coffee Mug', 
    price: 12.50, 
    category: 'Home & Kitchen', 
    stock: 120, 
    description: 'Ceramic coffee mug with premium finish',
    createdAt: '2025-02-15T12:30:00Z'
  },
  { 
    id: 3, 
    name: 'Gaming Mouse', 
    price: 79.99, 
    category: 'Electronics', 
    stock: 25, 
    description: 'Precision gaming mouse with RGB lighting',
    createdAt: '2025-03-01T15:45:00Z'
  },
  { 
    id: 4, 
    name: 'Notebook Set', 
    price: 24.99, 
    category: 'Office Supplies', 
    stock: 78, 
    description: 'Premium notebook set with various sizes',
    createdAt: '2025-03-10T11:20:00Z'
  },
];

/**
 * GET /api/products
 * Returns list of all products with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');

    let products = [...DUMMY_PRODUCTS];

    // Filter by category if provided
    if (category) {
      products = products.filter(product => 
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      products = products.filter(product => product.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      products = products.filter(product => product.price <= max);
    }

    // Filter by stock availability
    if (inStock === 'true') {
      products = products.filter(product => product.stock > 0);
    }

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
      filters: { category, minPrice, maxPrice, inStock },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Creates a new product
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, stock = 0, description = '' } = body;

    if (!name || !price || !category) {
      return NextResponse.json({
        success: false,
        error: 'Name, price, and category are required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const newProduct = {
      id: DUMMY_PRODUCTS.length + 1,
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock, 10),
      description,
      createdAt: new Date().toISOString()
    };

    // In a real app, you'd save to database
    DUMMY_PRODUCTS.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
