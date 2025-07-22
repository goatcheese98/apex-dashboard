/**
 * MCP Client Integration for Apex Dashboard
 * Provides a client interface to communicate with MCP servers
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';

export interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface TournamentData {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  teams: number;
}

export interface MatchData {
  id: string;
  name: string;
  status: string;
  teams: any[];
  results: any[];
}

export interface TeamStats {
  tournamentId: string;
  teamId?: string;
  stats: {
    totalKills: number;
    totalDamage: number;
    placement: number;
    points: number;
  };
}

// Zod schemas for MCP response validation
const GenericMcpResponseSchema = z.object({
  content: z.array(z.object({
    text: z.string()
  })).optional(),
  contents: z.array(z.object({
    text: z.string()
  })).optional(),
}).passthrough();

class McpClientService {
  private clients: Map<string, Client> = new Map();
  private config: Record<string, McpServerConfig> = {};

  constructor() {
    this.loadConfig();
  }

  /**
   * Load MCP server configuration
   */
  private async loadConfig() {
    try {
      // In a real implementation, you might load this from a config file
      // For now, we'll use a default configuration
      this.config = {
        'filesystem': {
          name: 'filesystem',
          command: 'npx',
          args: ['@modelcontextprotocol/server-filesystem'],
          env: {
            ALLOWED_DIRECTORIES: process.cwd()
          }
        },
        'apex-api': {
          name: 'apex-api',
          command: 'node',
          args: [`${process.cwd()}/.mcp/servers/apex-api-server.js`],
          env: {
            APEX_API_BASE: 'https://apexlegendsstatus.com/'
          }
        }
      };
    } catch (error) {
      console.error('Failed to load MCP configuration:', error);
    }
  }

  /**
   * Connect to an MCP server
   */
  async connectToServer(serverName: string): Promise<Client> {
    if (this.clients.has(serverName)) {
      return this.clients.get(serverName)!;
    }

    const config = this.config[serverName];
    if (!config) {
      throw new Error(`Unknown MCP server: ${serverName}`);
    }

    try {
      const client = new Client(
        {
          name: 'apex-dashboard-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      // For Node.js environment, you would use a different transport
      // This is a simplified example
      console.log(`Connecting to MCP server: ${serverName}`);
      
      this.clients.set(serverName, client);
      return client;
    } catch (error) {
      console.error(`Failed to connect to MCP server ${serverName}:`, error);
      throw error;
    }
  }

  /**
   * Get list of available tournaments
   */
  async getTournaments(limit: number = 10, status?: string): Promise<TournamentData[]> {
    try {
      const client = await this.connectToServer('apex-api');
      
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_tournaments',
            arguments: { limit, status }
          }
        },
        GenericMcpResponseSchema
      );

      if (response.content && response.content[0]) {
        return JSON.parse(response.content[0].text);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get tournaments:', error);
      // Return mock data as fallback
      return this.getMockTournaments();
    }
  }

  /**
   * Get tournament details
   */
  async getTournamentDetails(tournamentId: string): Promise<any> {
    try {
      const client = await this.connectToServer('apex-api');
      
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_tournament_details',
            arguments: { tournamentId }
          }
        },
        GenericMcpResponseSchema
      );

      if (response.content && response.content[0]) {
        return JSON.parse(response.content[0].text);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get tournament details:', error);
      return null;
    }
  }

  /**
   * Get tournament matches
   */
  async getTournamentMatches(tournamentId: string, matchId?: string): Promise<MatchData[]> {
    try {
      const client = await this.connectToServer('apex-api');
      
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_tournament_matches',
            arguments: { tournamentId, matchId }
          }
        },
        GenericMcpResponseSchema
      );

      if (response.content && response.content[0]) {
        const data = JSON.parse(response.content[0].text);
        return data.matches || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get tournament matches:', error);
      return [];
    }
  }

  /**
   * Get team statistics
   */
  async getTeamStats(tournamentId: string, teamId?: string): Promise<TeamStats | null> {
    try {
      const client = await this.connectToServer('apex-api');
      
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_team_stats',
            arguments: { tournamentId, teamId }
          }
        },
        GenericMcpResponseSchema
      );

      if (response.content && response.content[0]) {
        return JSON.parse(response.content[0].text);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get team stats:', error);
      return null;
    }
  }

  /**
   * Read a file using the filesystem MCP server
   */
  async readFile(filePath: string): Promise<string | null> {
    try {
      const client = await this.connectToServer('filesystem');
      
      const response = await client.request(
        {
          method: 'resources/read',
          params: {
            uri: `file://${filePath}`
          }
        },
        GenericMcpResponseSchema
      );

      if (response.contents && response.contents[0]) {
        return response.contents[0].text || null;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  }


  /**
   * Disconnect from all MCP servers
   */
  async disconnect(): Promise<void> {
    for (const [name, client] of this.clients.entries()) {
      try {
        // In a real implementation, you would properly close the client connection
        console.log(`Disconnecting from MCP server: ${name}`);
      } catch (error) {
        console.error(`Failed to disconnect from ${name}:`, error);
      }
    }
    this.clients.clear();
  }

  /**
   * Mock data for fallback
   */
  private getMockTournaments(): TournamentData[] {
    return [
      {
        id: 'ewc-2025',
        name: 'Esports World Cup 2025',
        status: 'active',
        startDate: '2025-07-20',
        endDate: '2025-07-22',
        teams: 20
      },
      {
        id: 'algs-championship-2025',
        name: 'ALGS Championship 2025',
        status: 'completed',
        startDate: '2025-06-15',
        endDate: '2025-06-17',
        teams: 20
      }
    ];
  }
}

// Export singleton instance
export const mcpClient = new McpClientService();

// Export types (interfaces are already exported above, so no need to re-export)