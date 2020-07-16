
const strVer = (ver) => Array.isArray(ver) ? ver.join(', ') : ver;

module.exports = (ver) => ({
  "title": "SD Card with 6300+ retro games",
  "subtitle": `plug'n'play with Raspberry Pi ${strVer(ver)}`,
  "description": "Games work with keyboard or controllers (ps3 or xbox 360)<br/> No duplicate content each game is unique",
  "disclaimer": "Try a better power supply - Raspberry PI can draw up to 3A of power - which is more than a typical phone charger",
  "cardSpec": "32 GB Class 10",
  "cardSpec2": "Kingston or Toshiba - 5 year warranty",
  "dispatch": "same day",
  "footer": "UK Seller 👍",
  "compatibility": `Raspberry Pi ${strVer(ver)}`
});