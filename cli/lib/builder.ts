import * as path from 'path';
import * as fs from 'fs';
import * as exec from 'child_process';


export type PortMapping = { EndpointName: string, Port: number };
export type StartJson = { "portMap": PortMapping[] };
export type ErrorCallback = (string?) => void;

function loadJson(path: string, name: string)
{
    let jsonPath = `${path}/${name}`;

    let jsonFile = fs.readFileSync(jsonPath, 'utf8');
    if (!jsonFile) return;

    return JSON.parse(jsonFile);
}

function makeDockerfileText(packageJson: any, startJson: StartJson)
{
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

export function writeDockerFile(projectPath: string, outputPath: string,
                                callback: ErrorCallback): void
{
    const packageJson = loadJson(projectPath, "package.json");
    if (!packageJson) {
        return callback(`couldn't find package.json on path ${projectPath}`);
    }

    const startJson = <StartJson>loadJson(projectPath, "start.json");
    if (!startJson) {
        return callback(`couldn't find start.json on path ${projectPath}`);
    }

    const dockerfileText = makeDockerfileText(packageJson, startJson);

    const dockerfilePath = `${outputPath}/Dockerfile`;

    fs.writeFileSync(dockerfilePath, dockerfileText);
}

export function build(projectPath: string, registryName: string,
                      callback: ErrorCallback): void
{
    const buildCmd = `docker build -t ${registryName} ${projectPath}`;

    exec.exec(buildCmd, function(err, stdout, stderr) {
        if (err) callback(err);
        else callback();
    });
}

export function buildAndPush(projectPath: string, registryName: string,
                     callback: ErrorCallback)
{
    build(
        projectPath,
        registryName,
        (err) => {
            if (err) return callback(err);

            const pushCmd = `docker push ${registryName}`;

            exec.exec(pushCmd, callback);
        });
}


