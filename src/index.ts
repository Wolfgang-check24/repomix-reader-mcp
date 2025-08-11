#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { allTools } from './tools/index.js';
import { fileManager } from './fileManager.js';

// Create server instance
const server = new Server(
  {
    name: 'repomix-reader-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = allTools.map(tool => tool.definition);
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Find the tool handler
    const tool = allTools.find(t => t.definition.name === name);
    
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Execute the tool handler
    return await tool.handler(args);

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Parse command line arguments
function parseArgs(): string[] {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: repomix-reader-mcp <file1.xml> [file2.xml] [...]');
    console.error('');
    console.error('Example:');
    console.error('  repomix-reader-mcp output1.xml output2.xml');
    console.error('  repomix-reader-mcp /path/to/repomix-output.xml');
    process.exit(1);
  }

  return args;
}

// Start the server
async function main() {
  try {
    // Parse and initialize file manager
    const filePaths = parseArgs();
    await fileManager.initialize(filePaths);

    // Start MCP server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Repomix Reader MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch(console.error);