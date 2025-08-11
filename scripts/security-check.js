#!/usr/bin/env node

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

// Patterns that might indicate sensitive information
const SENSITIVE_PATTERNS = [
  // API Keys and tokens
  { pattern: /(api[_\-]?key|apikey)\s*[:=]\s*['"`]?[a-z0-9]{20,}['"`]?/i, desc: 'API Key' },
  { pattern: /(access[_\-]?token|accesstoken)\s*[:=]\s*['"`]?[a-z0-9]{20,}['"`]?/i, desc: 'Access Token' },
  { pattern: /(secret[_\-]?key|secretkey)\s*[:=]\s*['"`]?[a-z0-9]{20,}['"`]?/i, desc: 'Secret Key' },
  
  // Database connections
  { pattern: /(db[_\-]?password|database[_\-]?password)\s*[:=]\s*['"`][^'"`\s]+['"`]/i, desc: 'Database Password' },
  { pattern: /mongodb:\/\/[^\/\s]+:[^@\s]+@/i, desc: 'MongoDB Connection String' },
  { pattern: /postgres:\/\/[^\/\s]+:[^@\s]+@/i, desc: 'PostgreSQL Connection String' },
  
  // Email addresses (potential personal info)
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, desc: 'Email Address' },
  
  // Private keys
  { pattern: /-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, desc: 'Private Key' },
  { pattern: /-----BEGIN CERTIFICATE-----/, desc: 'Certificate' },
  
  // Common secret patterns
  { pattern: /(password|passwd)\s*[:=]\s*['"`][^'"`\s]{6,}['"`]/i, desc: 'Password' },
  { pattern: /(jwt[_\-]?secret|jwtsecret)\s*[:=]\s*['"`][^'"`\s]+['"`]/i, desc: 'JWT Secret' },
  
  // AWS keys (more specific patterns)
  { pattern: /AKIA[0-9A-Z]{16}/, desc: 'AWS Access Key' },
  { pattern: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*['"`]?[A-Za-z0-9\/+=]{40}['"`]?/, desc: 'AWS Secret Key' },
  
  // GitHub tokens
  { pattern: /ghp_[0-9a-zA-Z]{36}/, desc: 'GitHub Personal Access Token' },
  { pattern: /github_pat_[0-9a-zA-Z_]{82}/, desc: 'GitHub Fine-grained Token' },
  
  // Common personal/local paths that shouldn't be committed
  { pattern: /\/Users\/[^\/\s]+/, desc: 'Personal User Path' },
  { pattern: /C:\\Users\\[^\\\/\s]+/, desc: 'Windows User Path' },
  { pattern: /\/home\/[^\/\s]+/, desc: 'Linux Home Path' },
  
  // Localhost URLs
  { pattern: /https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):[0-9]+/i, desc: 'Localhost URL' },
];

// File extensions to scan
const SCANNABLE_EXTENSIONS = ['.js', '.ts', '.json', '.md', '.txt', '.yml', '.yaml', '.env'];

// Directories to ignore
const IGNORED_DIRS = ['node_modules', '.git', 'build', 'dist', '.vscode', '.idea'];

// Files to ignore (auto-generated or known safe files)
const IGNORED_FILES = ['package-lock.json', 'security-check.js'];

class SecurityScanner {
  constructor() {
    this.issues = [];
    this.scannedFiles = 0;
  }

  async scanDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          if (!IGNORED_DIRS.includes(entry)) {
            await this.scanDirectory(fullPath);
          }
        } else if (stats.isFile()) {
          const ext = extname(entry);
          if (!IGNORED_FILES.includes(entry) && (SCANNABLE_EXTENSIONS.includes(ext) || entry.startsWith('.env'))) {
            await this.scanFile(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }

  async scanFile(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      this.scannedFiles++;

      lines.forEach((line, index) => {
        SENSITIVE_PATTERNS.forEach(patternObj => {
          const match = line.match(patternObj.pattern);
          if (match) {
            this.issues.push({
              file: filePath,
              line: index + 1,
              type: patternObj.desc,
              pattern: patternObj.pattern.toString(),
              content: line.trim(),
              match: match[0]
            });
          }
        });
      });
    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error.message);
    }
  }

  generateReport() {
    console.log('\n🔒 Security Scan Results');
    console.log('========================');
    console.log(`Scanned ${this.scannedFiles} files`);
    
    if (this.issues.length === 0) {
      console.log('✅ No potential security issues found!');
      return true;
    }

    console.log(`⚠️  Found ${this.issues.length} potential security issue(s):`);
    console.log('');

    this.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Content: ${issue.content}`);
      console.log(`   Match: ${issue.match}`);
      console.log('');
    });

    console.log('⚠️  Please review these findings and remove or secure any sensitive information.');
    return false;
  }
}

// Main execution
async function main() {
  const scanner = new SecurityScanner();
  const projectRoot = process.cwd();
  
  console.log(`🔍 Scanning for sensitive information in: ${projectRoot}`);
  
  await scanner.scanDirectory(projectRoot);
  const isClean = scanner.generateReport();
  
  process.exit(isClean ? 0 : 1);
}

main().catch(error => {
  console.error('Security scan failed:', error);
  process.exit(1);
});
