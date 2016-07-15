'use strict'

const path = require('path');
const fs = require('fs');

function loadJson(path, name) {
    let jsonPath = `${path}/${name}`;

    return require(jsonPath);
}

module.exports = function build(path, options, callback) {
    let packageJson = loadJson(path, "package.json");
    if (!packageJson) return callback(`couldn't find package.json on path ${path}`);

    let startJson = loadJson(path, "start.json");
    if (!startJson) return callback(`couldn't find start.json on path ${path}`)

    let exposes = "";
    startJson.portMap.forEach( (mapping) => {
        for (let endpoint in mapping) {
            exposes += `EXPOSE ${mapping[endpoint]}\n`;
        }
    });

    let dockerfile =
`# TODO: parameterize node.js version from "engines" in package.json
FROM mhart/alpine-node:6

WORKDIR /src
ADD . .

${exposes}
CMD ["node", "${packageJson.main}"]`;

    let outputPath = ".";
    if (options['o'])
        outputPath = options['o'];

    outputPath += `/Dockerfile`;

    fs.writeFileSync(outputPath, dockerfile);

    return callback();
}
