## Some docker command used to build the images and container

Build the image:
```
cd db2-samplejs
docker build --tag db2-samplejs:1.0 .
```
Note: if you get the following error (during the npm install step) `getaddrinfo EAI_AGAIN registry.npmjs.org`, you can add `--network host` option 
```
docker build --network host --tag db2-samplejs:1.0 .
```


run the container: `docker run --publish 443:3000 --detach --name db2-samplejs db2-samplejs:1.0`

start / stop the container: `docker stop db2-samplejs` 

Publish image on dockerhub:

create the repository on dockerhub web page (`db2-samplejs`) as private repository, then:
```
docker login
docker tag db2-samplejs:1.0 <dockerHub userId>/db2-samplejs:1.0
docker push benoitclerget/db2-samplejs:1.0
```

Get the mage from docker hub:

Add the docker user to authorisation list for this private docker repository:
```
docker login
docker pull benoitclerget/db2-samplejs:1.0
docker run --publish 80:3000 --detach --name db2-samplejs benoitclerget/db2-samplejs:1.0
```

Save the image into a local gzip file: `docker save db2-samplejs:1.0 | gzip > db2-samplejs.tar.gz`

You can send the gzip file to a user. This user will have to install the image:
```
docker load < db2-samplejs.tar.gz
docker run --publish 80:3000 --detach --name db2-samplejs db2-samplejs:1.0
```

Once the docker container has been launched, you can view the application form your browser: `https://localhost`
