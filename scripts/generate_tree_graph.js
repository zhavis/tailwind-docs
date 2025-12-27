const fs = require("fs");
const path = require("path");

/**
 * Recursively walk a directory and return a flat array.
 */
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

// --- Generate flat tree (keep exact order) ---
const flatTree = walk("docs");

// --- Generate id => node map without altering flatTree ---
const map = {};
flatTree.forEach((node) => {
  map[node.id] = { ...node, children: [] };
});
flatTree.forEach((node) => {
  if (node.parent && map[node.parent]) {
    map[node.parent].children.push(map[node.id]);
  }
});

// --- Generate fully nested tree for UI purposes ---
const nestedTree = flatTree
  .filter(node => node.parent === null)
  .map(root => buildNested(root, map));

function buildNested(node, map) {
  const copy = { ...map[node.id] };
  if (copy.children.length) {
    copy.children = copy.children.map(child => buildNested(child, map));
  }
  return copy;
}

// --- Write files ---
fs.mkdirSync("graphs", { recursive: true });
fs.writeFileSync("graphs/tree.json", JSON.stringify(flatTree, null, 2));      // untouched
fs.writeFileSync("graphs/tree-map.json", JSON.stringify(map, null, 2));        // map for lookup
fs.writeFileSync("graphs/tree-nested.json", JSON.stringify(nestedTree, null, 2)); // fully nested

console.log("generated");
