FROM node:current-alpine

RUN apk update && apk add python3 py3-pip make build-base
RUN npm install -g npm@10.2.5

ENV HOST=0.0.0.0
ENV PORT=4000

EXPOSE 4000
EXPOSE 24679

# Create app directory
WORKDIR /usr/src/app

USER node
