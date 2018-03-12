# VERSION 1 - EDITION 1
# !/bin/bash

FROM node

MAINTAINER johnny

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN mkdir /home/node

WORKDIR /home/node
ADD . /home/node
EXPOSE 8000

ENTRYPOINT /home/node/startup.sh ; /bin/bash
