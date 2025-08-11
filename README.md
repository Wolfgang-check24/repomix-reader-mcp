# Repomix Reader MCP

A simple Model Context Protocol (MCP) server for reading and grep-searching [Repomix](https://github.com/yamadashy/repomix) output files. This MCP provides secure file access by restricting operations to a pre-selected set of Repomix output files specified at startup.

## Features

- **Secure file access** - Only allows access to files specified at startup via command line arguments
- **File listing** - List all available Repomix files with their IDs
- **File reading** - Read Repomix output files with optional line range selection using file IDs
- **Pattern searching** - Grep-like pattern searching with regex support and context lines
- **Simple interface** - File access via numeric IDs instead of complex file paths

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

Configure your MCP-compatible client to use this server with the Repomix files you want to make available:

```json
{
  "mcpServers": {
    "repomix-reader": {
      "command": "node",
      "args": [
        "/path/to/repomix-reader-mcp/build/index.js",
        "/path/to/first-repomix-output.xml",
        "/path/to/second-repomix-output.xml"
      ]
    }
  }
}
```

**Note:** You must specify at least one Repomix output file as a command line argument. Only these files will be accessible through the MCP tools.

### Available Tools

#### `list_repomix_files`
List all available Repomix files that can be read or searched.

**Parameters:** None

**Returns:** A list of available files with their IDs, filenames, and full paths.

#### `read_repomix_output`
Read content from a Repomix output file with optional line range.

**Parameters:**
- `fileId` (string, required): ID of the Repomix output file to read (use `list_repomix_files` to see available IDs)
- `startLine` (number, optional): Starting line number (1-based, inclusive)
- `endLine` (number, optional): Ending line number (1-based, inclusive)

**Example:**
```json
{
  "fileId": "1",
  "startLine": 1,
  "endLine": 100
}
```

#### `grep_repomix_output`
Search for patterns in a Repomix output file with grep-like functionality.

**Parameters:**
- `fileId` (string, required): ID of the Repomix output file to search (use `list_repomix_files` to see available IDs)
- `pattern` (string, required): Search pattern (supports regex)
- `flags` (string, optional): Regex flags (e.g., "i" for case-insensitive, "g" for global)
- `contextLines` (number, optional): Number of context lines to show around matches (default: 2)
- `maxMatches` (number, optional): Maximum number of matches to return (default: 100)

**Example:**
```json
{
  "fileId": "1",
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

# Security checks
npm run security:check      # Run all security checks
npm run security:secrets    # Scan for secrets and sensitive info
npm run security:audit      # Check for dependency vulnerabilities
```

## Project Structure

```
repomix-reader-mcp/
├── src/
│   ├── tools/                    # Tool implementations
│   │   ├── index.ts             # Tool exports
│   │   ├── listRepomixFiles.ts  # List files tool
│   │   ├── readRepomixOutput.ts # Read tool implementation
│   │   └── grepRepomixOutput.ts # Grep tool implementation
│   ├── fileManager.ts           # File management utility
│   ├── types.ts                 # Shared type definitions
│   └── index.ts                 # Main MCP server
├── scripts/
│   └── security-check.js        # Security scanner script
├── build/                       # Compiled output (auto-generated)
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript config
└── README.md                   # Documentation
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for creating MCP servers

## How It Works

This MCP server provides secure file operations:

1. **File Initialization**: Accepts a list of Repomix files as command line arguments at startup
2. **File Validation**: Verifies file existence and readability during initialization  
3. **ID-based Access**: Assigns numeric IDs to files for secure access without exposing file paths
4. **File Reading**: Secure file system access limited to pre-approved files
5. **Pattern Matching**: Uses JavaScript regex for pattern searching
6. **Context Display**: Shows surrounding lines for grep matches
7. **Line Range Selection**: Allows reading specific portions of files

### Security Features

- **Restricted File Access**: Only files specified at startup can be accessed
- **No Path Traversal**: File access is limited to the pre-approved list
- **Input Validation**: File IDs are validated against the available file list
- **Automated Security Scanning**: Built-in tools to detect secrets and vulnerabilities
- **Pre-publish Checks**: Automatic security scanning before npm publish

## Supported File Formats

Works with any Repomix output format:
- XML output files
- Markdown output files  
- Plain text output files

## Example Usage

### Starting the MCP server
```bash
# Start with specific Repomix files
node build/index.js output1.xml output2.xml /path/to/output3.xml
```

### Listing available files
```json
{
  "tool": "list_repomix_files"
}
```

### Reading a specific section
```json
{
  "tool": "read_repomix_output",
  "fileId": "1",
  "startLine": 1,
  "endLine": 50
}
```

### Searching for patterns
```json
{
  "tool": "grep_repomix_output", 
  "fileId": "1",
  "pattern": "function\\s+\\w+",
  "flags": "gi",
  "contextLines": 2
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.