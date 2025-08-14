import { promises as fs } from 'fs';
import { resolve } from 'path';

export interface RepomixFile {
  id: string;
  path: string;
  basename: string;
  description?: string;
}

class FileManager {
  private files: Map<string, RepomixFile> = new Map();
  private initialized = false;

  /**
   * Extract user-provided header from repomix XML content
   */
  private extractUserProvidedHeader(content: string): string | undefined {
    const headerMatch = content.match(/<user_provided_header>\s*(.*?)\s*<\/user_provided_header>/s);
    return headerMatch ? headerMatch[1].trim() : undefined;
  }

  /**
   * Initialize the file manager with a list of file paths
   */
  async initialize(filePaths: string[]): Promise<void> {
    this.files.clear();

    for (let i = 0; i < filePaths.length; i++) {
      const filePath = resolve(filePaths[i]);
      
      // Verify file exists and is readable
      try {
        await fs.access(filePath, fs.constants.R_OK);
        const stats = await fs.stat(filePath);
        
        if (!stats.isFile()) {
          console.error(`Warning: ${filePath} is not a file, skipping`);
          continue;
        }
      } catch (error) {
        console.error(`Warning: Cannot access file ${filePath}, skipping: ${error}`);
        continue;
      }

      const basename = filePath.split('/').pop() || `file_${i}`;
      const id = (i + 1).toString();

      // Extract user-provided header from XML content
      let description: string | undefined;
      try {
        const content = await fs.readFile(filePath, 'utf8');
        description = this.extractUserProvidedHeader(content);
      } catch (error) {
        console.error(`Warning: Could not read file content for ${filePath}: ${error}`);
      }

      this.files.set(id, {
        id,
        path: filePath,
        basename,
        description,
      });
    }

    this.initialized = true;
    console.error(`Initialized file manager with ${this.files.size} files`);
  }

  /**
   * Get all available files
   */
  getFiles(): RepomixFile[] {
    this.ensureInitialized();
    return Array.from(this.files.values());
  }

  /**
   * Get a specific file by ID
   */
  getFile(id: string): RepomixFile | undefined {
    this.ensureInitialized();
    return this.files.get(id);
  }

  /**
   * Check if a file ID exists
   */
  hasFile(id: string): boolean {
    this.ensureInitialized();
    return this.files.has(id);
  }

  /**
   * Get file path by ID
   */
  getFilePath(id: string): string | undefined {
    const file = this.getFile(id);
    return file?.path;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('FileManager not initialized. Call initialize() first.');
    }
  }
}

// Singleton instance
export const fileManager = new FileManager();
