FROM node:12.18.2-alpine
LABEL Maintainer="wjsc"
WORKDIR /usr/app/
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test
RUN npm prune --production
RUN rm -Rf test
EXPOSE 3000
USER node
CMD [ "npm" , "start" ]
