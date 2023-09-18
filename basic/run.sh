openssl req -x509 -nodes -newkey rsa:2048 -keyout nginx/key.pem -out nginx/cert.pem -sha256 -days 365 \
	-subj "/C=ES/ST=Seville/L=Seville/O=US/OU=IT/CN=localhost"


docker compose up --build
