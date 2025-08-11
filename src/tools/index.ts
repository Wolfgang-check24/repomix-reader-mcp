import { ToolDefinition } from '../types.js';
import { readRepomixOutputTool } from './readRepomixOutput.js';
import { grepRepomixOutputTool } from './grepRepomixOutput.js';
import { listRepomixFilesTool } from './listRepomixFiles.js';

export const allTools: ToolDefinition[] = [
  listRepomixFilesTool,
  readRepomixOutputTool,
  grepRepomixOutputTool,
];

export { readRepomixOutputTool, grepRepomixOutputTool, listRepomixFilesTool };
