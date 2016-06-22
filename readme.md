
## Installation

The Dockerfile's `ENTRYPOINT` is `jekyll s`, and by default sends it the params `-P 4000`.

Note only port 80 and 4000 are exposed in the Dockerfile.

### Dokku

No extra configuration on Dokku's end is required, aside from simply creating the app and pushing to it.

To override the port and/or send additional Jekyll serve params, set the start command...

`dokku config:set APP DOKKU_DOCKERFILE_START_CMD="-P 80"`

### Docker

Example commands:

`docker build -t "home:latest" .`

`docker run --name test1 --rm -p 4000:4000 home:latest`

This can be easily overridden by specifying the command at the end...

`docker run --name test1 --rm -p 4000:4000 home:latest -P 80`

Jekyll CLI reference: [http://jekyllrb.com/docs/usage](http://jekyllrb.com/docs/usage)
