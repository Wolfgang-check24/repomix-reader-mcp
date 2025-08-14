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
    const textContent = 'No Repomix files are currently available.';
    return {
      content: [
        {
          type: 'text',
          text: textContent,
        },
      ],
      structuredContent: {
        description: textContent,
        files: [],
        totalFiles: 0,
      },
    };
  }

  let output = `Available Repomix files (${files.length}):\n\n`;
  
  for (const file of files) {
    output += `ID: ${file.id}\n`;
    output += `File: ${file.basename}\n`;
    if (file.description) {
      output += `Description: ${file.description}\n`;
    }
    output += `\n`;
  }

  output += 'Use the file ID with read_repomix_output or grep_repomix_output tools.';

  const structuredContent = {
    description: `Found ${files.length} Repomix file(s) available for reading and searching`,
    files: files.map(file => ({
      id: file.id,
      basename: file.basename,
      description: file.description,
    })),
    totalFiles: files.length,
  };

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
    structuredContent,
  };
}

export const listRepomixFilesTool: ToolDefinition = {
  definition: toolDefinition,
  handler: handleListRepomixFiles,
};
