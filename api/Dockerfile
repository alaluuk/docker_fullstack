FROM node:24

WORKDIR /usr/src/app

# Kopioi riippuvuustiedostot ensin Dockerin välimuistia varten.
COPY package.json package-lock.json ./

RUN npm ci

# Kopioidaan sovelluksen lähdekoodi
COPY . .

CMD ["npm", "start"]
