import fs from "fs";
import path from "path";
import ts from "typescript";

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

// Simple yet extremely robust parser using TypeScript AST Compiler API (for TS/TSX files) with a fallback to regex pattern matches
export function parseLocalFile(relativeFile: string, absoluteRoot: string): {
  symbols: LocalSymbolItem[];
  dependencies: LocalDependencyEdge[];
  content: string;
} {
  const fullPath = path.join(absoluteRoot, relativeFile);
  const content = fs.readFileSync(fullPath, "utf-8");
  const ext = path.extname(relativeFile);

  const symbols: LocalSymbolItem[] = [];
  const dependencies: LocalDependencyEdge[] = [];

  if ([".ts", ".tsx"].includes(ext)) {
    try {
      const sourceFile = ts.createSourceFile(
        relativeFile,
        content,
        ts.ScriptTarget.Latest,
        true
      );

      const visit = (node: ts.Node) => {
        if (ts.isClassDeclaration(node) && node.name) {
          symbols.push({
            name: node.name.text,
            type: "class",
            file: relativeFile,
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            description: `TypeScript Class: Discovered class declaration via standard Compiler AST parser.`
          });
        } else if (ts.isInterfaceDeclaration(node) && node.name) {
          symbols.push({
            name: node.name.text,
            type: "interface",
            file: relativeFile,
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            description: `TypeScript Interface: Discovered interface declaration via standard Compiler AST parser.`
          });
        } else if (ts.isFunctionDeclaration(node) && node.name) {
          symbols.push({
            name: node.name.text,
            type: "function",
            file: relativeFile,
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            description: `TypeScript Function: Discovered function definition via standard Compiler AST parser.`
          });
        } else if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach(decl => {
            if (decl.name && ts.isIdentifier(decl.name)) {
              if (decl.initializer && (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))) {
                symbols.push({
                  name: decl.name.text,
                  type: "function",
                  file: relativeFile,
                  line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                  description: `TypeScript Arrow Function Expression: Discovered arrow function variable assignment.`
                });
              }
            }
          });
        } else if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier;
          if (ts.isStringLiteral(moduleSpecifier)) {
            const targetImport = moduleSpecifier.text;
            if (targetImport.startsWith(".") || targetImport.startsWith("/")) {
              dependencies.push({
                target: targetImport,
                importName: path.basename(targetImport),
                confidence: 1.0
              });
            }
          }
        }

        ts.forEachChild(node, visit);
      };

      visit(sourceFile);
      return { symbols, dependencies, content };
    } catch (err) {
      console.warn(`TypeScript compiler API AST parsing failed for ${relativeFile}, falling back to regex:`, err);
    }
  }

  // Fallback / Regex-based parser for non-TypeScript/other configuration files
  const lines = content.split("\n");
  const classRegex = /(?:export\s+)?class\s+(\w+)/;
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/;
  const functionRegex = /(?:export\s+(?:default\s+)?)?function\s+(\w+)/;
  const constArrowRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:\([^)]*\)|_|\w+)\s*=>/;
  const routeRegex = /app\.(get|post|put|delete)\(\s*["']([^"']+)["']/;
  const importRegex = /import\s+(?:[^"'\r\n]+)\s+from\s+["']([^"']+)["']/;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

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

    match = line.match(importRegex);
    if (match) {
      const targetImport = match[1];
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
