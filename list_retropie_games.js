let fs = require('fs');
var parseString = require('xml2js').parseString;

const outputToFile = true;
const outputToConsole = true;
const outputDir = `./output`;
const romDir = `H:\\images\\retropie\\retropie_extracted_files\\roms`;
const lookupXml = 'gamelist.xml';

let contents = fs.readdirSync(romDir, { withFileTypes: true }).filter(c => c.isDirectory());
let output = {};

contents.forEach(c => {
  let system = c.name;
  let dir = `${romDir}\\${system}`;
  output[system] = { games: [] };

  let systemContents = fs.readdirSync(dir, { withFileTypes: true }).filter(sc => sc.isFile());
  if (systemContents.length < 3) return;

  if (!systemContents.find(sc => sc.name === lookupXml)) {
    output[system].games = systemContents.map(sc => sc.name);
    return;
  }

  lookupXmlDir = `${romDir}\\${system}\\${lookupXml}`;
  lookupXmlStr = fs.readFileSync(lookupXmlDir, { encoding: 'utf-8' });
  parseString(lookupXmlStr, function (err, result) {

    systemContents.forEach(game => {
      let res = result.gameList.game.find(g => {
        return g.path.find(p => {
          return p.includes(game.name);
        });
      });
      if (res) {
        if (!res.name[0] || res.name[0] === "")
          output[system].games.push(game.name)
        else
          output[system].games.push(res.name[0]);
      }
    });

  });

});

let outputClean = {};
Object.keys(output).forEach((o) => { if (output[o].games.length > 0) { outputClean[o] = { games: [] } } });
Object.keys(output).forEach(o => {
  let strs = output[o].games.map(g => g.replace(/\.[a-zA-Z0-9]{2,8}$/, ''));
  strs.forEach(s => {
    if (!outputClean[o].games.includes(s)) outputClean[o].games.push(s);
  })
});

if (outputToConsole)
  console.log(outputClean);

if (outputToFile) {
  Object.keys(outputClean).forEach(o => {
    fs.writeFileSync(`${outputDir}\\${o}.txt`, outputClean[o].games.join('\n'));
  });
}