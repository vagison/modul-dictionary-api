// --- Setting up appropriate RegExp's and exporting them

module.exports = {
  armChars: new RegExp("[\u0531-\u0558\u0561-\u0587]"),
  engChars: new RegExp("[\u0041-\u005a\u0061-\u007a]"),
  numChars: new RegExp("[0-9]"),
  skipChars: "[\\s-.․/\\\\~=+&$%^#@!`_*<>,?:;{}\\[\\]]",
};
