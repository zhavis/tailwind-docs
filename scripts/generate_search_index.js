const fs = require("fs");
const path = require("path");

function walk(dir, arr = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full, arr);
    else if (f.endsWith(".md") || f.endsWith(".mdx")) {
      const content = fs.readFileSync(full, "utf8");
      arr.push({
        slug: full.replace("docs/", ""),
        text: content.replace(/[#>*`]/g, "").substring(0, 500)
      });
    }
  }
  return arr;
}

const index = walk("docs");
fs.writeFileSync("search.json", JSON.stringify(index, null, 2));

console.log("✓ search.json generated");
