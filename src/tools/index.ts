import { ToolDefinition } from '../types.js';
import { readRepomixOutputTool } from './readRepomixOutput.js';
import { grepRepomixOutputTool } from './grepRepomixOutput.js';

export const allTools: ToolDefinition[] = [
  readRepomixOutputTool,
  grepRepomixOutputTool,
];

export { readRepomixOutputTool, grepRepomixOutputTool };
