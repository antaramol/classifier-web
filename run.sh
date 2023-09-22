# create ~/.htpasswd file if not exist

if [ ! -f ~/.htpasswd ]; then
    echo "Create .htpasswd file"
    htpasswd -c ~/.htpasswd admin
    # permission 600 so only current user can read/write
    chmod 600 ~/.htpasswd
fi

# Edit this line with your domain name
# export DOMAIN_NAME=example.com

# remove running containers
docker compose down

# build and run containers
docker compose up -d --build