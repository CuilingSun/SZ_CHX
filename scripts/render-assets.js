'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    const assetsSourcePath = upath.resolve(upath.dirname(__filename), '../src/assets');
    const productsSourcePath = upath.resolve(upath.dirname(__filename), '../src/products');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');

    sh.cp('-R', assetsSourcePath, destPath);

    if (fs.existsSync(productsSourcePath)) {
        sh.cp('-R', productsSourcePath, destPath);
    }
};
