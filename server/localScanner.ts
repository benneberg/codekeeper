import fs from "fs";
import path from "path";

export interface LocalSymbolItem {
  name: string;
  type: "class" | "function" | "method" | "interface" | "route";
  file: string;
  line: number;
  description: string;
}

export interface LocalDependencyEdge {
  target: string;
  importName: string;
  confidence: number;
}

export interface LocalScanResult {
  id: string;
  name: string;
  description: string;
  language: string;
  files: string[];
  fileContents: Record<string, string>;
  symbols: LocalSymbolItem[];
  dependencies: Record<string, LocalDependencyEdge[]>;
}

// Recursively walks the directory and returns relative paths of valid files
export function walkDirectory(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Skip heavy or compiled folders
    if (file === "node_modules" || file === "dist" || file === ".git" || file === "coverage" || file === ".llm-context") {
      continue;
    }

    if (stat && stat.isDirectory()) {
      results = results.concat(walkDirectory(fullPath, baseDir));
    } else {
      // Only parse supported developer/code files
      const ext = path.extname(file);
      if ([".ts", ".tsx", ".js", ".jsx", ".json", ".md"].includes(ext)) {
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
        results.push(relativePath);
      }
    }
  }

  return results;
}

// Simple yet extremely robust regex-based parser to extract symbols, routes, and imports
export function parseLocalFile(relativeFile: string, absoluteRoot: string): {
  symbols: LocalSymbolItem[];
  dependencies: LocalDependencyEdge[];
  content: string;
} {
  const fullPath = path.join(absoluteRoot, relativeFile);
  const content = fs.readFileSync(fullPath, "utf-8");
  const lines = content.split("\n");

  const symbols: LocalSymbolItem[] = [];
  const dependencies: LocalDependencyEdge[] = [];

  // Match class, interface, function definitions, and Express routes
  const classRegex = /(?:export\s+)?class\s+(\w+)/;
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/;
  const functionRegex = /(?:export\s+(?:default\s+)?)?function\s+(\w+)/;
  const constArrowRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:\([^)]*\)|_|\w+)\s*=>/;
  const routeRegex = /app\.(get|post|put|delete)\(\s*["']([^"']+)["']/;
  const importRegex = /import\s+(?:[^"'\r\n]+)\s+from\s+["']([^"']+)["']/;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Class declarations
    let match = line.match(classRegex);
    if (match) {
      symbols.push({
        name: match[1],
        type: "class",
        file: relativeFile,
        line: lineNum,
        description: `Discovered class declaration inside ${relativeFile}`
      });
      return;
    }

    // 2. Interface declarations
    match = line.match(interfaceRegex);
    if (match) {
      symbols.push({
        name: match[1],
        type: "interface",
        file: relativeFile,
        line: lineNum,
        description: `Discovered TypeScript interface declaration`
      });
      return;
    }

    // 3. Function declarations
    match = line.match(functionRegex);
    if (match) {
      symbols.push({
        name: match[1],
        type: "function",
        file: relativeFile,
        line: lineNum,
        description: `Discovered function definition`
      });
      return;
    }

    // 4. Arrow function assignments
    match = line.match(constArrowRegex);
    if (match) {
      symbols.push({
        name: match[1],
        type: "function",
        file: relativeFile,
        line: lineNum,
        description: `Discovered constant arrow function expression`
      });
      return;
    }

    // 5. Express routing patterns
    match = line.match(routeRegex);
    if (match) {
      const verb = match[1].toUpperCase();
      const endpoint = match[2];
      symbols.push({
        name: `${verb} ${endpoint}`,
        type: "route",
        file: relativeFile,
        line: lineNum,
        description: `Active REST API endpoint route handler`
      });
      return;
    }

    // 6. Imports and dependencies tracking
    match = line.match(importRegex);
    if (match) {
      const targetImport = match[1];
      // Only track local imports to build the DAG
      if (targetImport.startsWith(".") || targetImport.startsWith("/")) {
        dependencies.push({
          target: targetImport,
          importName: path.basename(targetImport),
          confidence: 1.0
        });
      }
    }
  });

  return { symbols, dependencies, content };
}

// Run full scan on the workspace
export function performLocalWorkspaceScan(): LocalScanResult {
  const rootDir = process.cwd();
  const files = walkDirectory(rootDir);

  const fileContents: Record<string, string> = {};
  const allSymbols: LocalSymbolItem[] = [];
  const dependencyGraph: Record<string, LocalDependencyEdge[]> = {};

  files.forEach(file => {
    const { symbols, dependencies, content } = parseLocalFile(file, rootDir);
    fileContents[file] = content.length > 500 ? content.substring(0, 500) + "\n... [TRUNCATED] ..." : content;
    allSymbols.push(...symbols);
    if (dependencies.length > 0) {
      dependencyGraph[file] = dependencies;
    }
  });

  return {
    id: "active-workspace",
    name: "ARIP-Active-Workspace",
    description: "The live container codebase representing the running AI Repository Intelligence Platform.",
    language: "TypeScript",
    files,
    fileContents,
    symbols: allSymbols,
    dependencies: dependencyGraph
  };
}
