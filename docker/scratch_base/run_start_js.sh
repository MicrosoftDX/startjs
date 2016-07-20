#!/bin/sh

# Takes a git HTTPS remote that points at a start.js project, clones it, and
# runs npm start.

if [ -z "$1" ]
  then
      echo "Please supply a git HTTPS remote as the first argument."
      exit 1
fi

mkdir src/ && cd src && git clone $1 . && npm install && npm start

