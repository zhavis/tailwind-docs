const fs = require("fs");
const path = require("path");

function walk(dir, parent = null, arr = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    const node = {
      id: full.replace(process.cwd() + "/", ""),
      name: file,
      type: stat.isDirectory() ? "folder" : "file",
      parent
    };

    arr.push(node);

    if (stat.isDirectory()) walk(full, node.id, arr);
  }

  return arr;
}

const res = walk("docs");
fs.mkdirSync("graphs", { recursive: true });
fs.writeFileSync("graphs/tree.json", JSON.stringify(res, null, 2));

console.log("✓ tree.json generated");
