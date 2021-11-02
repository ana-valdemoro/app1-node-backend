BOILERPLATE NODE WITH MYSQL - FORMACIÓN
=======================

# FEATURES

- Permission for Users (login, create, delete, update)
- User (login, create, delete, update, forgot password, recovery password)

# POSTMAN

- Enter credentials for postman

# Libraries

- Boom
- Cors
- Dotenv
- JWT
- Joi
- Moment
- Sequelize
- Passport
- Uuid

# Installation

- Clone repository
- Copy .env.dist into .env
- Run ./docker/build-docker-compose.sh
- Run ./docker/start-docker-compose.sh
- (For stopping) Run ./docker/stop-docker-compose.sh
- (For re-run) Run ./docker/start-docker-compose.sh
- (For view logs) Run ./docker/view-docker-web-logs.sh

# Install new dependence

- Install local with yarn, example: yarn add <package-name>
- Stop docker (./docker/stop-docker-compose.sh)
- Start docker (./docker/start-docker-compose.sh)
- With logs (./docker/view-docker-web-logs.sh) you can see the progress instalation

# Sequelize-cli

- **npx should be installed** (`npm install -g npx`).
- **ALL commands should be executed in `src/src` directory**.
- Create model: `npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`
- Create empty migration: `npx sequelize-cli migration:generate --name NAME`
  - Use "create" for new tables. Example: `create-profile`.
  - Use "add" for new columns: Example: `add-deleted-at-to-profile`
- Apply migrations: `npx sequelize-cli db:migrate`
- Undo migrations: `npx sequelize-cli db:migrate:undo`
- Create seed: `npx sequelize-cli seed:generate --name demo-user`
- Apply all seeds: `npx sequelize-cli db:seed:all`
- Undo seeds: `npx sequelize-cli db:seed:undo:all`
