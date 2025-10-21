'use client';

import { useState, useEffect } from 'react';

interface AgentConfig {
  agentName: string;
  agentRole: string;
  agentGreeting: string;
  primaryColor: string;
  secondaryColor: string;
  starterPrompts: string[];
}

/**
 * useAgent Hook
 * Fetches and manages agent configuration
 */
export function useAgent() {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch agent config:', error);
    } finally {
      setLoading(false);
    }
  };

  return { config, loading };
}
