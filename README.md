# Classifier-web app

## Traefik Reverse Proxy -> Gunicorn -> Python/Flask Backend

Project structure:

```text
.
├── docker-compose.yaml
├── Makefile
├── README.md
├── flask
│   ├── app.py
│   ├── templates
│   │   └── index.html
│   ├── static
│   ├── model_use_example.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── wsgi.py
└── nginx
    ├── default.conf
    ├── Dockerfile
    ├── nginx.conf
    └── start.sh
```

## Deploy web app

### Prerequisites

Before deploying the application, run the following commands to set up the environment variables:

```bash
$ make prepare
$ source .env
```
Change the 'DOMAIN_NAME' variable in the .env file to your domain name.

## Deploy with docker-compose
### Build and run the containers
```bash
$ make build
$ make run
```

### Expected result

Listing containers must show two containers running and the port mapping as below:

```bash
$ docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED              STATUS              PORTS                                                                      NAMES
71be4a31b30a   flask_app            "gunicorn -w 3 -t 60…"   About a minute ago   Up About a minute   5000/tcp                                                                   classifier-web-flask-1
66e901fdb1fb   traefik:1.7-alpine   "/entrypoint.sh trae…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   classifier-web-traefik-1
```

After the application starts, wait a couple of minutes and navigate to http://your-domain.com in your web browser.

Monitor dashboard: http://monitor.your-domain.com


### Stop and remove the containers

```bash
$ make stop
$ make clean
```
