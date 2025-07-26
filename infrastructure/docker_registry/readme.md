# Generate password
docker run --entrypoint htpasswd httpd:2 -Bbn myuser mypassword > auth/htpasswd