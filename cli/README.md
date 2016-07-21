# start.js CLI

`start.js` will take a Node project and turns it into a Docker image that calls `npm start`.

This CLI drives the core `start.js` library.

## Building

The first time you build, run:

```bash
npm install
npm run typings
```

Then, and subsequently, you need only run:

```bash
npm run build
```

After building, from this root directory, simply run the local file `./startjs`, or install it on your system. For example, you might run:

```bash
./startjs build [and so on]
```

## Usage

Normally the workflow has two steps:

* **Building,** by using something like the `startjs build` command to generate a Docker image.
  * _e.g._, `./startjs build ../Example/Simple --name hausdorff/startjs_example`
* (Optional) **Pushing**, by using vanilla `docker push` command to put the image in DockerHub.
  * _e.g._, `docker push hausdorff/startjs_example`
* **Provisioning,** by using something like the `startjs provision` command to send a `start.js` project to run on a cluster.
  * _e.g._, `./startjs provision test1 hausdorff/startjs_example [your marathon url goes here]`

Note that you can also use `start.js` to take a `start.js`-compliant Node app from any git repository, and run it in a Marathon cluster (NOTE: we require an HTTP remote rather than an SSH remote for now):

```bash
./startjs provision-git test1 https://github.com/hausdorff/startjs_example.git [marathon url goes here]
```

This command will seamlessly acquire, download, build, and `npm start` the at that URL.
