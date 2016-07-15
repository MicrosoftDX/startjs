'use strict'

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

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
CMD ["npm", "install"]
CMD ["node", "${packageJson.main}"]`;

    let dockerfileDirectory = path;
    if (options['o'])
        dockerfileDirectory = options['o'];

    let dockerfilePath = `${dockerfileDirectory}/Dockerfile`;

    console.log(dockerfileDirectory);
    console.log(dockerfilePath);

    fs.writeFileSync(dockerfilePath, dockerfile);

    if (options['name']) {
        let buildCmd = `docker build -t ${options['name']} ${dockerfileDirectory}`;
        exec(buildCmd, function(err, stdout, stderr) {
            if (err) return callback(err);

            let pushCmd = `docker push ${options['name']}`;
            exec(pushCmd, callback);
        });
    } else {
        return callback();
    }
}
