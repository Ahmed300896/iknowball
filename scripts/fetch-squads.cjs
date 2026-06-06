const https = require("https");
const fs = require("fs");

const options = {
  hostname: "en.wikipedia.org",
  path: "/w/api.php?action=parse&page=2026_FIFA_World_Cup_squads&prop=wikitext&format=json&origin=*",
  headers: { "User-Agent": "iknowball-squad-fetcher/1.0 (sayemahmed300896@gmail.com)" },
};

https.get(options, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    const json = JSON.parse(data);
    const wikitext = json.parse.wikitext["*"];

    const teams = {};

    // Split on === team headings === (triple equals = team level, double = group level)
    const sections = wikitext.split(/\n===\s*([^=\n]+?)\s*===/);
    // After split with capture group: [before, teamName, content, teamName, content, ...]

    for (let i = 1; i < sections.length; i += 2) {
      const rawName = sections[i].trim();
      const content = sections[i + 1] || "";

      // Skip non-team sections
      if (!rawName || rawName.startsWith("Group") || rawName.toLowerCase() === "statistics") continue;

      const squad = { GK: [], DF: [], MF: [], FW: [] };

      // Match both {{nat fs g player|...}} and {{nat fs player|...}} templates
      const playerRe = /\{\{nat fs g? ?player\|([^}]+)\}\}/g;
      let m;
      while ((m = playerRe.exec(content)) !== null) {
        const params = m[1];

        const posMatch = params.match(/\bpos=([A-Z]+)/);
        if (!posMatch || !squad[posMatch[1]]) continue;
        const pos = posMatch[1];

        // name=[[Full Name|Display Name]] or name=[[Name]]
        const nameMatch = params.match(/\bname=\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
        if (!nameMatch) continue;
        const playerName = (nameMatch[2] || nameMatch[1]).trim();

        if (playerName && !squad[pos].includes(playerName)) {
          squad[pos].push(playerName);
        }
      }

      teams[rawName] = squad;
    }

    // Drop entries with no players (statistics/age sections)
    for (const name of Object.keys(teams)) {
      const s = teams[name];
      if (s.GK.length + s.DF.length + s.MF.length + s.FW.length === 0) {
        delete teams[name];
      }
    }

    const output = "const squads = " + JSON.stringify(teams, null, 2) + ";\n\nexport default squads;\n";
    fs.writeFileSync("src/data/squads.js", output);
    const teamNames = Object.keys(teams);
    console.log("squads.js generated with " + teamNames.length + " teams");
    console.log(teamNames.join(", "));

    // Quick sanity check
    const sample = teamNames.find(t => teams[t].GK.length > 0);
    if (sample) {
      console.log("\nSample (" + sample + "):", JSON.stringify(teams[sample]));
    } else {
      console.log("\nWARNING: no players found — wikitext format may have changed");
    }
  });
}).on("error", (e) => console.error(e));
