const fs = require("fs");
const path = require("path");

const INDEX_FILE = "_index.json";   
const AI_INDEX_FILE = "_ai_index.json"; 
const SUMMARY_FILE = "summary.json";
const REPORT_FILE = "report.html";

const indexData = fs.existsSync(INDEX_FILE) ? JSON.parse(fs.readFileSync(INDEX_FILE, "utf8")) : { docs: [] };
const aiData = fs.existsSync(AI_INDEX_FILE) ? JSON.parse(fs.readFileSync(AI_INDEX_FILE, "utf8")) : { docs: [] };

const totalDocs = indexData.docs.length;
const totalChunks = aiData.docs.length;

const wordsPerDoc = aiData.docs.map(d => d.text.split(/\s+/).length);
const averageWordsPerDoc = wordsPerDoc.length > 0 ? Math.round(wordsPerDoc.reduce((a,b)=>a+b,0)/wordsPerDoc.length) : 0;

const brokenLinks = indexData.docs.reduce((acc, doc) => acc + (doc.links ? doc.links.filter(l=>!l).length : 0), 0);

const summary = {
  total_docs: totalDocs,
  total_chunks: totalChunks,
  average_words_per_doc: averageWordsPerDoc,
  broken_links: brokenLinks,
  last_updated: new Date().toISOString()
};

fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2));
console.log("✔ summary.json generated");

const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Docs Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; background: #f9f9f9; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 50%; margin-top: 1rem; }
    th, td { border: 1px solid #ccc; padding: 0.5rem 1rem; text-align: left; }
    th { background: #eee; }
  </style>
</head>
<body>
  <h1>Docs Pipeline Report</h1>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Total Docs</td><td>${totalDocs}</td></tr>
    <tr><td>Total Chunks</td><td>${totalChunks}</td></tr>
    <tr><td>Average Words per Doc</td><td>${averageWordsPerDoc}</td></tr>
    <tr><td>Broken Links</td><td>${brokenLinks}</td></tr>
    <tr><td>Last Updated</td><td>${summary.last_updated}</td></tr>
  </table>
</body>
</html>
`;

fs.writeFileSync(REPORT_FILE, reportHtml);
console.log("report.html generated");
