import { NextResponse } from 'next/server';

/**
 * GET /api/config
 * Get public agent configuration for widget initialization
 */
export async function GET() {
  return NextResponse.json({
    agentName: process.env.AGENT_NAME || 'Virtual Assistant',
    agentRole: process.env.AGENT_ROLE || 'Customer Support',
    agentGreeting: process.env.AGENT_GREETING || 'Hello! How can I help you today?',
    agentTagline: process.env.AGENT_TAGLINE || 'Always here to help',
    primaryColor: process.env.PRIMARY_COLOR || '#007bff',
    secondaryColor: process.env.SECONDARY_COLOR || '#6c757d',
    starterPrompts: JSON.parse(process.env.STARTER_PROMPTS || '[]'),
    showStatusIndicator: process.env.SHOW_STATUS_INDICATOR === 'true',
  });
}
