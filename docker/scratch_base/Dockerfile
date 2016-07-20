# Simple image that will download, build, and boot a start.js project.

FROM mhart/alpine-node:6

RUN apk --update add git
ADD ./run_start_js.sh .

ENTRYPOINT ["./run_start_js.sh"]

