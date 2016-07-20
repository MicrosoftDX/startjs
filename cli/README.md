# start.js CLI

`start.js` will take a Node project and turns it into a Docker image that calls `npm start`.

This CLI drives the core `start.js` library.

# Building

The first time you build, run:

```bash
npm install
npm run typings
```

Then, and subsequently, you need only run:

```bash
npm run build
```

# Running

After building, run:

```bash
npm start -- /path/to/startjs/project
```
