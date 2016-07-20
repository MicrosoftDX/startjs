# start.js Docker base images

This folder contains a collection of base images that allow you to run start.js
projects. Currently, the available images are:

* `scratch_base`, the "one true" base image. When this image is run, it takes a
  git HTTPS remote that points at a start.js project (e.g., `docker run
  hausdorff/startjs_base https://github.com/hausdorff/startjs_example.git`),
  downloads it, and runs `npm start`. New versions of this can be built with
  `docker build -t hausdorff/startjs_base .` (note the trailing period; replace
  `hausdorff` with your username, and `startjs_base` with whatever you want to
  call the image).
