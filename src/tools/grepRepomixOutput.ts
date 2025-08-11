import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolDefinition } from '../types.js';
import { fileManager } from '../fileManager.js';

const toolDefinition: Tool = {
  name: 'grep_repomix_output',
  description: 'Search for patterns in a Repomix XML output file. Use list_repomix_files to see available file IDs.',
  inputSchema: {
    type: 'object',
    properties: {
      fileId: {
        type: 'string',
        description: 'ID of the Repomix XML output file to search (use list_repomix_files to see available IDs)',
      },
      pattern: {
        type: 'string',
        description: 'Search pattern (supports regex)',
      },
      flags: {
        type: 'string',
        description: 'Regex flags (e.g., "i" for case-insensitive, "g" for global)',
        default: '',
      },
      contextLines: {
        type: 'number',
        description: 'Number of context lines to show around matches',
        default: 2,
      },
      maxMatches: {
        type: 'number',
        description: 'Maximum number of matches to return',
        default: 100,
      },
    },
    required: ['fileId', 'pattern'],
  },
};

async function handleGrepRepomixOutput(args: {
  fileId: string;
  pattern: string;
  flags?: string;
  contextLines?: number;
  maxMatches?: number;
}) {
  const {
    fileId,
    pattern,
    flags = '',
    contextLines = 2,
    maxMatches = 100,
  } = args;

  // Get file path from file manager
  const filePath = fileManager.getFilePath(fileId);
  if (!filePath) {
    throw new Error(`File with ID '${fileId}' not found. Use list_repomix_files to see available files.`);
  }

  const fs = await import('fs/promises');
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  // Create regex with provided flags
  const regex = new RegExp(pattern, flags);
  const matches: Array<{
    lineNumber: number;
    line: string;
    context: {
      before: string[];
      after: string[];
    };
  }> = [];

  // Find matches
  for (let i = 0; i < lines.length && matches.length < maxMatches; i++) {
    const line = lines[i];
    if (regex.test(line)) {
      // Get context lines
      const beforeStart = Math.max(0, i - contextLines);
      const afterEnd = Math.min(lines.length, i + contextLines + 1);
      
      const beforeLines = lines.slice(beforeStart, i);
      const afterLines = lines.slice(i + 1, afterEnd);

      matches.push({
        lineNumber: i + 1,
        line: line,
        context: {
          before: beforeLines,
          after: afterLines,
        },
      });
    }
  }

  // Format output
  let output = `Found ${matches.length} match(es) for pattern "${pattern}"\n\n`;
  
  for (const match of matches) {
    output += `Line ${match.lineNumber}:\n`;
    
    // Show context before
    for (let i = 0; i < match.context.before.length; i++) {
      const lineNum = match.lineNumber - match.context.before.length + i;
      output += `${lineNum.toString().padStart(6, ' ')}: ${match.context.before[i]}\n`;
    }
    
    // Show matching line
    output += `${match.lineNumber.toString().padStart(6, ' ')}: ${match.line}\n`;
    
    // Show context after
    for (let i = 0; i < match.context.after.length; i++) {
      const lineNum = match.lineNumber + i + 1;
      output += `${lineNum.toString().padStart(6, ' ')}: ${match.context.after[i]}\n`;
    }
    
    output += '\n';
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

export const grepRepomixOutputTool: ToolDefinition = {
  definition: toolDefinition,
  handler: handleGrepRepomixOutput,
};
