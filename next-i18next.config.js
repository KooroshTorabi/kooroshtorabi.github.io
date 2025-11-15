// next-i18next.config.js

const path = require("path");

module.exports = {
  i18n: {
    locales: ["fa", "en", "de"],
    defaultLocale: "en",
    localePath: path.resolve("./public/locales"),
    localeDetection: false,
  },
};
