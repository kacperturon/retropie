
const fs = require('fs');
const axios = require('axios')
const minify = require('html-minifier').minify;

let distFolder = './dist';
let indexHtml = fs.readFileSync('./index.html', { encoding: 'utf-8' });

let retropieV = [2, 3];

let retropieListingData = require('./retropie')(retropieV);

const replaceTwigs = (key, val, template) => template.replace(`{{${key}}}`, val);

let systemsData = require('./systems');

async function systemTable(name) {
  let consoles = systemsData.groups[name];
  let allGames = {};
  await Promise.all(consoles.map(async c => {
    let details = systemsData.details[c];
    let res = await axios(details.allGamesUrl);
    allGames[c] = res.data;
  }));

  return `
  <h2 style="text-align: center;">${name !== 'Other' ? `${name} family` : 'Other'} consoles:</h2>
  <table style="width: 100%;"  >
  <tbody>
  <tr>
  <td>System</td>
  <td>Game count</td>
  <td>Notable games (click to expand)</td>
  </tr>
  ${consoles.map((c, i) => {
    let details = systemsData.details[c];
    return `
    <tr>
      <td style="border-color: #ccc;border-width: 1px;border-style: solid;padding: 10px;width: 180px; ">${c}</td>
      <td style="border-color: #ccc;border-width: 1px;border-style: solid;padding: 10px;width: 100px;">${details.gamesCount}</td>
      <td style="border-color: #ccc;border-width: 1px;border-style: solid;padding: 10px;">
        <details>
          <summary>${details.notableGames.join(', ')}...</summary>
          <p>${allGames[c].split('\n').join('<br>')}</p>
        </details>
      </td>
    </tr>
    `
  }).join('')}
  </tbody >
  </table >
  `;
};

const strVer = (ver) => Array.isArray(retropieV) ? ver.join('_') : retropieV;

(async () => {
  let systems = "";
  for (let sd of Object.keys(systemsData.groups)) {
    systems += await systemTable(sd);
  }

  Object.keys(retropieListingData).forEach(key => {
    indexHtml = replaceTwigs(key, retropieListingData[key], indexHtml)
  });

  indexHtml = replaceTwigs("systems", systems, indexHtml)
  fs.writeFileSync(`${distFolder}/retropie_${strVer(retropieV)}.html`, minify(indexHtml, {
    collapseWhitespace: true,
  }));

})();