# Use the node 14 image from dockerhub . This image is available for different platforms (x86, Power,..)
FROM node:14-buster

# Set the working directory.
WORKDIR /usr/src/app

# Copy the package.json for for pre install app dependencies
COPY package.json ./package.json

# Run the node package manager install
RUN npm install

# copy the webpack config file used to build the app front-end bundle
COPY webpack.config.js .

# copy the front end src files
COPY ./src ./src

# build the front-end bundle files 
RUN npm run build:dev

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Copy the app backend (web server) files
#COPY . .
COPY ./public ./public
COPY ./server ./server
# ssl self signed certificates
COPY ./cert.pem ./cert.pem
COPY ./key.pem ./key.pem

# cmd definition: start the node app (https web server listening on port 3000)
CMD [ "npm", "start" ]
