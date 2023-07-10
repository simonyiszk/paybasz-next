## Docker run
## Docker run
### Network

Create: `docker network create network-x`

### Database

Create: `docker build -t postgres-x .`

Run: `docker run -d -p 5480:5432 -e POSTGRES_PASSWORD=password --network network-x --name db-x postgres-x `

Connect: `psql -h localhost -p 5480 -U postgres -d postgres`


### Application

Create: `docker build -t backend-x .`

Run: `docker run -p 8090:6006 --network network-x --name backend-x backend-x .`