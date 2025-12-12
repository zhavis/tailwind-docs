const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function walkFiles(dir, ext = ".md") {
  let arr = [];
  const files = fs.readdirSync(dir);

  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) arr.push(...walkFiles(full));
    else if (f.endsWith(ext) || f.endsWith(".mdx")) arr.push(full);
  }

  return arr;
}

const pages = walkFiles("docs");

let graph = [];

for (const file of pages) {
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);

  const links = [...content.matchAll(/\[.+?\]\((.+?)\)/g)]
    .map(m => m[1])
    .filter(x => !x.startsWith("http"));

  graph.push({
    id: file.replace("docs/", ""),
    links
  });
}

fs.writeFileSync("graphs/content_graph.json", JSON.stringify(graph, null, 2));
console.log("✓ content_graph.json generated");
