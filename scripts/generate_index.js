// scripts/generate_index.js
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const OUT = path.join(ROOT, "_index.json");

function walk(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries
    .map((entry) => {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(base, entry.name).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: "dir",
          path: relPath,
          children: walk(fullPath, relPath),
        };
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return {
          name: entry.name.replace(/\.mdx$/, ""),
          type: "file",
          path: relPath,
        };
      }

      return null;
    })
    .filter(Boolean);
}

// MAIN
if (!fs.existsSync(DOCS)) {
  console.error("❌ docs/ folder not found!");
  process.exit(1);
}

const result = walk(DOCS);
fs.writeFileSync(OUT, JSON.stringify(result, null, 2));

console.log("✅ Generated _index.json at root:");
console.log(JSON.stringify(result, null, 2));
