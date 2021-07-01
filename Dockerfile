# Use the official image as a parent image.
#FROM node:current-slim
#FROM node:14
FROM node:14-buster

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY package-docker.json ./package.json

# Run the command inside your image filesystem.
RUN npm install

# copy the webpack config file used for build
COPY webpack.config.js .

# copy the front end src files
COPY ./src ./src

# build the front-end bundle files inside your image filesystem.
RUN npm run build:dev

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Copy the rest of your app's source code from your host to your image filesystem.
#COPY . .
COPY ./public ./public
COPY ./server ./server
COPY ./cert.pem ./cert.pem
COPY ./key.pem ./key.pem

# Run the specified command within the container.
CMD [ "npm", "start" ]
