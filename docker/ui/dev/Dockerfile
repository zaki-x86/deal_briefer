FROM node:20-alpine

COPY ui /app

WORKDIR /app

COPY ui/package.json ui/package-lock.json /app/

CMD ["npm", "run", "dev"]