FROM node:16.19.0-slim
WORKDIR /app

COPY package*.json /app/
RUN npm clean-install

COPY index.js /app/

ENTRYPOINT [ "npm", "start" ]
