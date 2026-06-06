const fs = require("fs");
const https = require("https");
const pdfParse = require("pdf-parse");

const url = "https://fdp.fifa.org/assetspublic/ce281/pdf/SquadLists-English.pdf";

function titleCase(word) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatLastName(upper) {
  if (upper.includes("'")) return upper.split("'").map(titleCase).join("'");
  if (upper.includes("-")) return upper.split("-").map(titleCase).join("-");
  return titleCase(upper);
}

// Title-case an all-uppercase name, preserving apostrophes/hyphens in each word
function titleCaseName(raw) {
  return raw.trim().split(/\s+/).map(function(word) {
    if (!word) return "";
    if (word.includes("'")) return word.split("'").map(titleCase).join("'");
    if (word.includes("-")) return word.split("-").map(titleCase).join("-");
    return titleCase(word);
  }).join(" ");
}

const chunks = [];
https.get(url, { headers: { "User-Agent": "iKnowBall/1.0 (iknowball.com)" } }, function(res) {
  res.on("data", function(d) { chunks.push(d); });
  res.on("end", function() {
    const buf = Buffer.concat(chunks);
    pdfParse(buf).then(function(data) {
      const text = data.text;
      const teams = {};
      const lines = text.split("\n");
      let currentTeam = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Team header: any "Name (CODE)" pattern — allow Unicode chars
        const teamMatch = line.match(/^([A-ZÀ-ÿ][^(]+?)\s*\(([A-Z]{2,3})\)$/);
        if (teamMatch) {
          currentTeam = teamMatch[1].trim();
          if (!teams[currentTeam]) teams[currentTeam] = { GK: [], DF: [], MF: [], FW: [] };
          continue;
        }

        if (!currentTeam) continue;

        const pos = line.match(/^(GK|DF|MF|FW)/);
        if (!pos) continue;
        const posCode = pos[1];
        const after = line.slice(2); // strip the 2-char position code

        let playerName = null;

        // Unicode uppercase Latin-1 supplement: À-Ö (U+00C0-U+00D6) and Ø-Þ (U+00D8-U+00DE)
        // Unicode lowercase Latin-1 supplement: à-ö (U+00E0-U+00F6) and ø-þ (U+00F8-U+00FE)
        // Using these precise ranges avoids treating Á as lowercase.
        var UC = "A-ZÀ-ÖØ-Þ";   // uppercase: ASCII + Latin-1 upper
        var LC = "a-zà-öø-þ";    // lowercase: ASCII + Latin-1 lower

        // Strategy 1 — European format: "UPPER_LAST FirstName"
        // e.g. "PICKFORD JordanJordan Lee..." -> "Jordan Pickford"
        var euroRe = new RegExp("^([A-Z][A-Z'\\-]+) ([A-Z][a-z]+)");
        var euroMatch = after.match(euroRe);
        if (euroMatch) {
          var upperLastRaw = euroMatch[1];
          var firstName = euroMatch[2];
          var rest = after.slice(euroMatch[0].length);
          // If the raw last name lacks apostrophes/hyphens, check the rest for a proper version
          // (e.g. OREILLY -> O'REILLY appears later in the line). Bound the match length strictly.
          var lastName;
          if (!upperLastRaw.includes("'") && !upperLastRaw.includes("-")) {
            var maxLen = upperLastRaw.length + 3; // allow up to 3 inserted special chars
            var properRe = new RegExp("([A-Z][A-Z'\\-]{" + (upperLastRaw.length - 1) + "," + (maxLen - 1) + "})(?=[^A-Z]|$)");
            var properMatch = rest.match(properRe);
            lastName = (properMatch && properMatch[1].replace(/['\-]/g, "") === upperLastRaw)
              ? formatLastName(properMatch[1])
              : formatLastName(upperLastRaw);
          } else {
            lastName = formatLastName(upperLastRaw);
          }
          playerName = firstName + " " + lastName;
        }

        // Strategy 2 — All-caps player name directly before title-case first name (no space boundary)
        // Covers: Brazilian nicknames ("ALISSONÁlisson"), Portuguese ("DIOGO COSTADiogo"),
        //         Saudi ("NAWAF ALAQIDINawaf"), Arabic names ("GABRIEL MAGALHAESGabriel")
        if (!playerName) {
          // Boundary: uppercase-only run ends when [UPPER][lower] transition detected
          // Use precise Unicode ranges to distinguish uppercase Á from lowercase á
          var nonEuroRe = new RegExp("^([" + UC + "][" + UC + "0-9 '\\-\\.]*?)([" + UC + "][" + LC + "])");
          var nonEuroMatch = after.match(nonEuroRe);
          if (nonEuroMatch) {
            var raw = nonEuroMatch[1].trim();
            if (raw.length >= 2) {
              playerName = titleCaseName(raw);
            }
          }
        }

        if (playerName && teams[currentTeam] && teams[currentTeam][posCode] && !teams[currentTeam][posCode].includes(playerName)) {
          teams[currentTeam][posCode].push(playerName);
        }
      }

      const output = "const squads = " + JSON.stringify(teams, null, 2) + ";\n\nexport default squads;\n";
      fs.writeFileSync("src/data/squads.js", output);
      const teamNames = Object.keys(teams);
      console.log("Done: " + teamNames.length + " teams written to squads.js");
      teamNames.forEach(function(t) {
        const total = teams[t].GK.length + teams[t].DF.length + teams[t].MF.length + teams[t].FW.length;
        console.log(t + ": " + total + " players");
      });
    }).catch(function(e) { console.error("PDF parse error:", e.message); });
  });
}).on("error", function(e) { console.error("Download error:", e.message); });
