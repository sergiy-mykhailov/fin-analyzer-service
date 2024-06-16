# Financial analyzer service 

## Installation

- Install Docker
- Copy `.env.example` to `.env` and fill variables
- Run `npm ci`
- To start service run `npm run compose:start`
- To stop service run `npm run compose:stop`
- Create database and run migrations

## Scripts

Create database (from container):
```shell
npm run db:create
```

Run migrations (from container):
```shell
npm run db:migrate
```

Connect to the database (from `postgres` container):
```shell
psql -h 0.0.0.0 -p 5432 -U postgres -d analyzer
```
