const fs = require("fs");
const path = require("path");

const DOCS_DIR = "./docs";
const OUTPUT = "_ai_index.json";

function splitIntoChunks(text, max = 800) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = [];

  for (const w of words) {
    if (current.join(" ").length + w.length > max) {
      chunks.push(current.join(" "));
      current = [];
    }
    current.push(w);
  }

  if (current.length) chunks.push(current.join(" "));

  return chunks;
}

function walkDocs() {
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) walk(full);
      else if (full.endsWith(".md")) files.push(full);
    }
  }

  walk(DOCS_DIR);
  return files;
}

function main() {
  const files = walkDocs();

  const result = {
    version: 1,
    generated_at: new Date().toISOString(),
    docs: []
  };

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");

    const title = raw.match(/^# (.+)/)?.[1] || path.basename(file);
    const summary = raw.split("\n").slice(1, 4).join(" ");

    const chunks = splitIntoChunks(raw).map((c, i) => ({
      id: `${path.basename(file)}-${i}`,
      content: c
    }));

    result.docs.push({
      path: file,
      title,
      summary,
      chunks
    });
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
  console.log("Generated:", OUTPUT);
}

main();
