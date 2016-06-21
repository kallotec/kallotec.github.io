
## Installation

### Docker

Example commands:

`docker build -t "kallojek:latest" .`

`docker run --name jekyll-test --rm -p 8080:8080 kallojek:latest serve --port 8080`

The Dockerfile's ENTRYPOINT is Jekyll, meaning the trailing `serve --port 8080` gets appended to the `jekyll` command for execution on run.

Jekyll CLI reference: [http://jekyllrb.com/docs/usage](http://jekyllrb.com/docs/usage)
