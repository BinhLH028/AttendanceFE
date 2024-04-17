FROM node:20-alpine

# Install xdg-utils
RUN apk add --no-cache xdg-utils

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3082

CMD ["npm", "run", "dev","--","--host","0.0.0.0"]