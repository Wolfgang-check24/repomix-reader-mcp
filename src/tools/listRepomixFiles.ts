import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolDefinition } from '../types.js';
import { fileManager } from '../fileManager.js';

const toolDefinition: Tool = {
  name: 'list_repomix_files',
  description: 'List all available Repomix XML files that can be read or searched',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

async function handleListRepomixFiles() {
  const files = fileManager.getFiles();
  
  if (files.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No Repomix files are currently available.',
        },
      ],
    };
  }

  let output = `Available Repomix files (${files.length}):\n\n`;
  
  for (const file of files) {
    output += `ID: ${file.id}\n`;
    output += `File: ${file.basename}\n`;
    output += `Path: ${file.path}\n\n`;
  }

  output += 'Use the file ID with read_repomix_output or grep_repomix_output tools.';

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

export const listRepomixFilesTool: ToolDefinition = {
  definition: toolDefinition,
  handler: handleListRepomixFiles,
};
