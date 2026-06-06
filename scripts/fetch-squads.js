const https = require("https");
const fs = require("fs");

const url = "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup_squads&prop=wikitext&format=json&origin=*";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    const json = JSON.parse(data);
    const wikitext = json.parse.wikitext["*"];

    const teams = {};
    const teamBlocks = wikitext.split(/\n==\s*/);

    const posMap = { "GK": "GK", "DF": "DF", "MF": "MF", "FW": "FW" };
    const playerRegex = /\|\s*(GK|DF|MF|FW)\s*\|\|\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    const headerRegex = /^=+\s*([^=]+?)\s*=+$/m;

    let currentTeam = null;
    for (const block of teamBlocks) {
      const headerMatch = block.match(/^([^=\n]+)/);
      if (headerMatch) {
        const name = headerMatch[1].trim().replace(/\[\[|\]\]/g, "").split("|").pop().trim();
        if (name && name.length > 1 && !name.startsWith("{")) {
          currentTeam = name;
          teams[currentTeam] = { GK: [], DF: [], MF: [], FW: [] };
        }
      }
      if (currentTeam) {
        let m;
        const re = /\|\s*(GK|DF|MF|FW)\s*\|\|\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        while ((m = re.exec(block)) !== null) {
          const pos = m[1];
          const playerName = (m[3] || m[2]).trim();
          if (teams[currentTeam] && teams[currentTeam][pos] && !teams[currentTeam][pos].includes(playerName)) {
            teams[currentTeam][pos].push(playerName);
          }
        }
      }
    }

    const output = "const squads = " + JSON.stringify(teams, null, 2) + ";\n\nexport default squads;\n";
    fs.writeFileSync("src/data/squads.js", output);
    console.log("squads.js generated with", Object.keys(teams).length, "teams");
  });
}).on("error", (e) => console.error(e));
