// next-i18next.config.js

const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["fa", "en", "de"],

    localePath: path.resolve("./public/locales"),
  },
};
