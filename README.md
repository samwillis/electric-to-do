# An Example ElectricSQL app using React & the Ionic Framework

https://github.com/samwillis/electric-to-do/assets/31130/27ed3e26-c675-4e6c-bc49-5491b43613ce

Requirements:

- [Docker](https://www.docker.com)
- [Iconic CLI](https://ionicframework.com/docs/intro/cli)

Start the backend:

```shell
npm run backend:start
```

Open a new tab in your terminal. Navigate back to the same folder. Apply the migrations (defined in `./db/migrations`):

```shell
npm run db:migrate
```

Start your app:

```sh
ionic serve
```

## Notes

- `npm run backend:start` uses Docker Compose to start Postgres and the [Electric sync service](https://electric-sql.com/docs/api/service). See [running the examples](https://electric-sql.com/docs/examples/notes/running#running-your-own-postgres) for information about configuring the Electric sync service to run against an existing Postgres database.
- `npm run client:watch` calls `npx electric-sql generate --watch` under the hood. See [https://electric-sql.com/docs/api/generator](https://electric-sql.com/docs/api/generator) for more details.

## More information

- [Electric Documentation](https://electric-sql.com/docs)
- [Ionic Documentation](https://ionicframework.com/docs/react)
