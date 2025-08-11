import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolDefinition } from '../types.js';

const toolDefinition: Tool = {
  name: 'read_repomix_output',
  description: 'Read content from a Repomix XML output file with optional line range',
  inputSchema: {
    type: 'object',
    properties: {
      inputFile: {
        type: 'string',
        description: 'Path to the Repomix XML output file to read',
      },
      startLine: {
        type: 'number',
        description: 'Starting line number (1-based, inclusive). If not specified, reads from beginning.',
      },
      endLine: {
        type: 'number',
        description: 'Ending line number (1-based, inclusive). If not specified, reads to end.',
      },
    },
    required: ['inputFile'],
  },
};

async function handleReadRepomixOutput(args: {
  inputFile: string;
  startLine?: number;
  endLine?: number;
}) {
  const { inputFile, startLine, endLine } = args;

  const fs = await import('fs/promises');
  const content = await fs.readFile(inputFile, 'utf-8');
  const lines = content.split('\n');

  const start = startLine ? Math.max(0, startLine - 1) : 0;
  const end = endLine ? Math.min(lines.length, endLine) : lines.length;
  
  const selectedLines = lines.slice(start, end);
  const result = selectedLines.join('\n');

  return {
    content: [
      {
        type: 'text',
        text: result,
      },
    ],
  };
}

export const readRepomixOutputTool: ToolDefinition = {
  definition: toolDefinition,
  handler: handleReadRepomixOutput,
};
