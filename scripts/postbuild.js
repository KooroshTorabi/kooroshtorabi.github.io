// scripts/postbuild.js
const fs = require('fs');
const path = require('path');
const { defaultLocale } = require('../i18n.config.js');

const outDir = path.join(__dirname, '..', 'out');
const indexPath = path.join(outDir, 'index.html');

const redirectHtml = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/${defaultLocale}"></head><body></body></html>`;

fs.writeFileSync(indexPath, redirectHtml);
console.log(`Created redirect page at ${indexPath} to /${defaultLocale}`);
