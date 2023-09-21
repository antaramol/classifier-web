export TRAEFIK_DASHBOARD_PASSWD=$(htpasswd -nb admin secure_password | cut -d ":" -f 2)

docker network create web
docker compose up --build
