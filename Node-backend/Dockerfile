FROM node:16.19.0-slim
WORKDIR /app

COPY package*.json /app/
RUN npm clean-install

COPY index.js /app/
COPY db.json /app/
COPY simulation_payload.json /app/
COPY station_payload.json /app/

ENTRYPOINT [ "npm", "start" ]
