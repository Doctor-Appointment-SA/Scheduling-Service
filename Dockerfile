FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --progress=false

EXPOSE 4002
CMD ["npm","run","start:dev"]
