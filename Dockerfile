FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN mkdir -p /usr/src/app/conf

VOLUME /usr/src/app/conf
# Bundle app source
COPY . .


EXPOSE 8080
CMD [ "node", "index.js" ]