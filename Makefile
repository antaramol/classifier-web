prepare:
	# create ~/.htpasswd file if not exist

	if [ ! -f ~/.htpasswd ]; then \
		echo "Create .htpasswd file" ;\
		htpasswd -c ~/.htpasswd admin ;\
		chmod 600 ~/.htpasswd ;\
	fi

build:
	docker compose build

run:
	docker compose up -d

stop:
	docker compose down

clean:
	docker compose down --rmi all --volumes --remove-orphans

	