// verify-docs.plugins.ts — Wiki-specific source resolvers for StsDev-Wiki
//
// Registers custom source types for verifying the wiki structure:
// - custom:project-readmes    — count project directories with README.md
// - custom:summary-links      — count all links in SUMMARY.md
// - custom:summary-dead-links — count broken links in SUMMARY.md

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

export default function register({ registerSource }: {
  registerSource: (prefix: string, resolver: (source: string, root: string) => number | null) => void
}) {

  // custom:project-readmes — count project directories that have a README.md
  registerSource("custom:project-readmes", (_source: string, root: string) => {
    try {
      const projectsDir = join(root, "projects");
      if (!existsSync(projectsDir)) return null;
      const entries = readdirSync(projectsDir, { withFileTypes: true });
      let count = 0;
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith(".")) {
          const readme = join(projectsDir, entry.name, "README.md");
          if (existsSync(readme)) count++;
        }
      }
      return count;
    } catch { return null; }
  });

  // custom:summary-links — count all markdown links in SUMMARY.md
  registerSource("custom:summary-links", (_source: string, root: string) => {
    try {
      const content = readFileSync(join(root, "SUMMARY.md"), "utf-8");
      const links = content.match(/\[.*?\]\(.*?\)/g);
      return links ? links.length : 0;
    } catch { return null; }
  });

  // custom:summary-dead-links — count links in SUMMARY.md that point to non-existent files
  registerSource("custom:summary-dead-links", (_source: string, root: string) => {
    try {
      const content = readFileSync(join(root, "SUMMARY.md"), "utf-8");
      const linkPattern = /\]\(([^)]+\.md)\)/g;
      let dead = 0;
      let match: RegExpExecArray | null;
      while ((match = linkPattern.exec(content)) !== null) {
        const filePath = join(root, match[1]);
        if (!existsSync(filePath)) dead++;
      }
      return dead;
    } catch { return null; }
  });

  // custom:tools-docs — count .md files in tools/ directories
  registerSource("custom:tools-docs", (_source: string, root: string) => {
    try {
      const toolsDir = join(root, "tools");
      if (!existsSync(toolsDir)) return null;
      const entries = readdirSync(toolsDir, { withFileTypes: true });
      let count = 0;
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith(".")) {
          const subDir = join(toolsDir, entry.name);
          const files = readdirSync(subDir).filter((f: string) => f.endsWith(".md"));
          count += files.length;
        }
      }
      return count;
    } catch { return null; }
  });

  // custom:wiki-sections — count ## headings in SUMMARY.md
  registerSource("custom:wiki-sections", (_source: string, root: string) => {
    try {
      const content = readFileSync(join(root, "SUMMARY.md"), "utf-8");
      const sections = content.match(/^## .+$/gm);
      return sections ? sections.length : 0;
    } catch { return null; }
  });
}
