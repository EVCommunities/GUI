FROM node:20.11.1-slim
WORKDIR /app

ARG NEXT_PUBLIC_EVC_GUI_BACKEND

COPY package*.json /app/
RUN npm clean-install

COPY public/ /app/
COPY src/ /app/
RUN npm run-script build

ENTRYPOINT [ "npm", "start" ]
