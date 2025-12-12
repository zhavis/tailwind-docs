const fs = require("fs");
const path = require("path");
const glob = require("glob");
const matter = require("gray-matter");

const DOCS_DIR = "docs";
const OUTPUT = "_ai_index.json";

function chunkText(text, size = 600) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

const files = glob.sync(`${DOCS_DIR}/**/*.{md,mdx,MD,MDX}`);
const docs = [];

files.forEach(file => {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);

  const content = parsed.content.trim();
  if (!content) return;

  const baseId = file.replace(`${DOCS_DIR}/`, "");

  const chunks = chunkText(content);

  chunks.forEach((chunk, idx) => {
    docs.push({
      id: `${baseId}#${idx}`,
      slug: baseId,
      text: chunk
    });
  });
});

const result = {
  version: 1,
  generated_at: new Date().toISOString(),
  docs
};

fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
console.log("AI index generated:", docs.length, "chunks");
