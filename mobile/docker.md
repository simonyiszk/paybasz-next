## Docker run

### Mobile client

Create: `docker build -t mobile-x .`

Run: `docker run -p 443:443 --name mobile-x mobile-x`

Replace: `docker cp mobile-0.0.1-SNAPSHOT.jar mobile-x:/app.jar`