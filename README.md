# Repomix Reader MCP

A simple Model Context Protocol (MCP) server for reading and grep-searching [Repomix](https://github.com/yamadashy/repomix) output files. This MCP provides basic file reading and pattern searching functionality for Repomix-generated files.

## Features

- **File reading** - Read Repomix output files with optional line range selection
- **Pattern searching** - Grep-like pattern searching with regex support and context lines
- **Simple interface** - Direct file path access without complex setup

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

Configure your MCP-compatible client to use this server:

```json
{
  "mcpServers": {
    "repomix-reader": {
      "command": "node",
      "args": ["/path/to/repomix-reader-mcp/build/index.js"]
    }
  }
}
```

### Available Tools

#### `read_repomix_output`
Read content from a Repomix output file with optional line range.

**Parameters:**
- `inputFile` (string, required): Path to the Repomix output file to read
- `startLine` (number, optional): Starting line number (1-based, inclusive)
- `endLine` (number, optional): Ending line number (1-based, inclusive)

**Example:**
```json
{
  "inputFile": "/path/to/repomix-output.xml",
  "startLine": 1,
  "endLine": 100
}
```

#### `grep_repomix_output`
Search for patterns in a Repomix output file with grep-like functionality.

**Parameters:**
- `inputFile` (string, required): Path to the Repomix output file to search
- `pattern` (string, required): Search pattern (supports regex)
- `flags` (string, optional): Regex flags (e.g., "i" for case-insensitive, "g" for global)
- `contextLines` (number, optional): Number of context lines to show around matches (default: 2)
- `maxMatches` (number, optional): Maximum number of matches to return (default: 100)

**Example:**
```json
{
  "inputFile": "/path/to/repomix-output.xml",
  "pattern": "function.*authenticate",
  "flags": "i",
  "contextLines": 3,
  "maxMatches": 50
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Clean build directory
npm run clean
```

## Project Structure

```
repomix-reader-mcp/
├── src/
│   ├── tools/                    # Tool implementations
│   │   ├── index.ts             # Tool exports
│   │   ├── readRepomixOutput.ts # Read tool implementation
│   │   └── grepRepomixOutput.ts # Grep tool implementation
│   ├── types.ts                 # Shared type definitions
│   └── index.ts                 # Main MCP server
├── build/                       # Compiled output
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript config
└── README.md                   # Documentation
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for creating MCP servers

## How It Works

This MCP server provides simple file operations:

1. **File Reading**: Direct file system access to read Repomix output files
2. **Pattern Matching**: Uses JavaScript regex for pattern searching
3. **Context Display**: Shows surrounding lines for grep matches
4. **Line Range Selection**: Allows reading specific portions of files

## Supported File Formats

Works with any Repomix output format:
- XML output files
- Markdown output files  
- Plain text output files

## Example Usage

### Reading a specific section
```bash
# Read lines 1-50 from a Repomix output file
{
  "inputFile": "/path/to/repo-output.xml",
  "startLine": 1,
  "endLine": 50
}
```

### Searching for patterns
```bash
# Search for function definitions (case-insensitive)
{
  "inputFile": "/path/to/repo-output.xml",
  "pattern": "function\\s+\\w+",
  "flags": "gi",
  "contextLines": 2
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.