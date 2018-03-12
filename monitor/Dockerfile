# VERSION 1 - EDITION 1
# !/bin/bash

FROM node

MAINTAINER johnny

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN mkdir /home/nodejs

WORKDIR /home/nodejs
ADD . /home/nodejs
EXPOSE 8000

ENTRYPOINT /home/analysis/vtt/startup.sh ; /bin/bash
