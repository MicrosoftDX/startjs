import * as path from 'path';
import * as fs from 'fs';
import * as exec from 'child_process';


export type PortMapping = { EndpointName: string, Port: number };
export type StartJson = { "portMap": PortMapping[] };

function loadJson(path: string, name: string) {
    let jsonPath = `${path}/${name}`;

    let jsonFile = fs.readFileSync(jsonPath, 'utf8');
    if (!jsonFile) return;

    return JSON.parse(jsonFile);
}

function makeDockerfileText(packageJson: any, startJson: StartJson) {
    const exposes = startJson.portMap
        .map((mapping) => { return `EXPOSE ${mapping.Port}` })
        .join("\n");

    const dockerfile =
`# TODO: parameterize node.js version from "engines" in package.json
FROM mhart/alpine-node:6

WORKDIR /src
ADD . .

${exposes}
CMD ["npm", "install"]
CMD ["node", "${packageJson.main}"]`;

    return dockerfile;
}

export function build(path: string, options: any, callback: (string?) => void) {
    const packageJson = loadJson(path, "package.json");
    if (!packageJson) {
        return callback(`couldn't find package.json on path ${path}`);
    }

    const startJson = <StartJson>loadJson(path, "start.json");
    if (!startJson) {
        return callback(`couldn't find start.json on path ${path}`);
    }

    const dockerfileText = makeDockerfileText(packageJson, startJson);

    let dockerfileDirectory = path;
    if (options['o']) {
        dockerfileDirectory = options['o'];
    }

    const dockerfilePath = `${dockerfileDirectory}/Dockerfile`;

    fs.writeFileSync(dockerfilePath, dockerfileText);

    if (options['name']) {
        const buildCmd =
            `docker build -t ${options['name']} ${dockerfileDirectory}`;
        exec.exec(buildCmd, function(err, stdout, stderr) {
            if (err) return callback(err);

            const pushCmd = `docker push ${options['name']}`;
            exec.exec(pushCmd, callback);
        });
    } else {
        return callback();
    }
}
