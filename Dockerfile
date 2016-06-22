FROM ruby:2.1
MAINTAINER @kallotec

RUN apt-get update \
  && apt-get install -y \
    node \
  && apt-get clean

ADD . /src
WORKDIR /src

RUN bundle install

EXPOSE 4000

ENTRYPOINT ["jekyll", "s"]
