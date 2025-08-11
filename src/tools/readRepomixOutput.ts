import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolDefinition } from '../types.js';
import { fileManager } from '../fileManager.js';

const toolDefinition: Tool = {
  name: 'read_repomix_output',
  description: 'Read content from a Repomix XML output file with optional line range. Use list_repomix_files to see available file IDs.',
  inputSchema: {
    type: 'object',
    properties: {
      fileId: {
        type: 'string',
        description: 'ID of the Repomix XML output file to read (use list_repomix_files to see available IDs)',
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
    required: ['fileId'],
  },
};

async function handleReadRepomixOutput(args: {
  fileId: string;
  startLine?: number;
  endLine?: number;
}) {
  const { fileId, startLine, endLine } = args;

  // Get file path from file manager
  const filePath = fileManager.getFilePath(fileId);
  if (!filePath) {
    throw new Error(`File with ID '${fileId}' not found. Use list_repomix_files to see available files.`);
  }

  const fs = await import('fs/promises');
  const content = await fs.readFile(filePath, 'utf-8');
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
