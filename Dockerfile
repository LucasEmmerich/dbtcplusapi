FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./

RUN npm install && npx prisma migrate dev
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
EXPOSE 3000

CMD [ "npm","run","dev" ]
