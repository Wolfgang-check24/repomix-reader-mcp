import { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface ToolHandler {
  (args: any): Promise<{
    content: Array<{
      type: string;
      text: string;
    }>;
    isError?: boolean;
  }>;
}

export interface ToolDefinition {
  definition: Tool;
  handler: ToolHandler;
}
