# Express App Template
Basic, but useful Express JS starter app template. This template includes express, express-session, morgan, nunjucks as the templating engine, prettier as the formater, and Prisma as the ORM. 

## Contains
  - Useful packages:
    - Express
    - Express session
    - Morgan
    - Body parser
  - ORM:
    - [Prisma 2](https://www.prisma.io)
  - View engine:
    - [Nunjucks](https://mozilla.github.io/nunjucks/)
  - Development packages:
    - Nodemon

## Scritps
  - Executes nodemon
  ```bash
    npm run dev
  ```
  - Executes prettier
  ```bash
    npm run format
  ```
## Create a .env file to use Prisma
Prisma is configured (in this template) to use a SQLite3 database, create a .env file at the root of the project and put the follwing content on it:
```py
DATABASE_URL="file:./app.db"
```