const fs = require("fs");

let files = 0;

function count(dir) {
  const l = fs.readdirSync(dir);
  for (const f of l) {
    const full = dir + "/" + f;
    const st = fs.statSync(full);
    if (st.isDirectory()) count(full);
    else files++;
  }
}

count("docs");

const manifest = {
  generatedAt: new Date().toISOString(),
  files,
  tree: "graphs/tree.json",
  contentGraph: "graphs/content_graph.json",
  search: "search.json"
};

fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));

console.log("✓ manifest.json generated");
