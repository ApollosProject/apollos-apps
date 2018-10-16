FROM node:8
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/babel-preset-apollos
WORKDIR /usr/src/app
COPY ./packages/apollos-church-api /usr/src/app
COPY ./packages/babel-preset-apollos /usr/src/babel-preset-apollos
RUN yarn
RUN ["yarn", "build"]
EXPOSE 4000
CMD [ "yarn", "start:prod" ]