# Financial analyzer service 

## Installation

- Install Docker
- Copy `.env.example` to `.env` and fill variables
- Run `npm ci`
- To start service run `npm run compose:start`
- To stop service run `npm run compose:stop`
- Create database and run migrations

## Scripts

### Common

Create database (from container):
```shell
npm run db:create
```

Connect to the database (from `postgres` container):
```shell
psql -h 0.0.0.0 -p 5432 -U postgres -d analyzer
```

### Migrations

Generate migration file:
```shell
knex migrate:make migration_name
```

Run migrations  (from container):
```shell
npm run db:migrate
```

### Seeds

Generate seed file:
```shell
knex seed:make seed_name
```

Run seed (from container):
```shell
npm run db:seed
```
