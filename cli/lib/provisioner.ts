import * as request from "request";

import * as builder from "./builder";


// const marathonJsonTemplate = {
//     "cmd":null,
//     "cpus":1,
//     "mem":128,
//     "disk":0,
//     "instances":1,
//     // NOTE: You fill in the image!
//     // "id": "test",
//     "container": {
//         "docker": {
//             // NOTE: You fill in the image!
//             // "image": "timpark/test",
//             "network":"HOST"
//         },
//         "type":"DOCKER"
//     }
// };


const marathonJsonTemplate = {
    // NOTE: You fill in the image!
    // "id": "test",
    "id": "test2",
    "cmd": null,
    "cpus": 1,
    "mem": 128,
    "disk": 0,
    "instances": 1,
    "container": {
        "docker": {
            // NOTE: You fill in the image!
            // "image": "timpark/test",
            "image": "hello-world",
            "network": "HOST"
        },
        "type": "DOCKER"
  }
}

function provisionToMarathon(
    marathonJson: any,
    marathonUrl: string,
    callback: builder.ErrorCallback)
  : void
{
    request(
        {
            url: marathonUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: marathonJson
        },
        (error, response, body) => {
            if (error) callback(error);
            else if (response.statusCode != 201) {
                callback(`response from Marathon cluster returned code '${response.statusCode}', with response: ${JSON.stringify(body)}`);
            }

            else callback();
        });
}

export function provision(
    jobName: string,
    registryName: string,
    marathonUrl: string,
    callback: builder.ErrorCallback)
  : void
{
    let marathonJson = marathonJsonTemplate;
    marathonJson["id"] = jobName;
    marathonJson.container.docker["image"] = registryName;

    provisionToMarathon(marathonJson, marathonUrl, callback);
}

export function provisionGit(
    jobName: string,
    gitHttpUrl: string,
    marathonUrl: string,
    callback: builder.ErrorCallback)
  : void
{
    let marathonJson = marathonJsonTemplate;
    marathonJson["id"] = jobName;
    marathonJson["args"] = [gitHttpUrl];

    // TODO(hausdorff): This image name is arbitrarily pointed at the
    // `start.js` base image in `hausdorff/`. This is not really canonical and
    // should probably change eventually.
    marathonJson.container.docker["image"] = "hausdorff/startjs_base";

    provisionToMarathon(marathonJson, marathonUrl, callback);
}
