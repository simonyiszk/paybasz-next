# Kir-Pay

## How to run

Copy the `.env.example` file to `.env` and fill it with the required data.

Have Docker installed on your machine. (https://docs.docker.com/get-docker/)
Run the following commands in the root directory of the project:

```bash
docker-compose up -d
```

If you deploy on lois with certbot and NGINX, it's better to disable `server.ssl.enabled` in the backend `application.properties` files.

The mobile frontend Vite.js app is deployed on Vercel preferably.
(Remember to set the `VITE_BACKEND_URL` env var on Vercel too.)
