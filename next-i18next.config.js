// next-i18next.config.js
const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fa", "de"],
  },

  localePath:
    typeof window === "undefined"
      ? path.resolve("./public/locales")
      : "/public/locales",

  reloadOnPrerender: true,
};
