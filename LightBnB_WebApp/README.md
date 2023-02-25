# LightBnB

## Project Structure

```
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── json
  ├── db
  ├── apiRoutes.js
  ├── database.js
  ├── server.js
  └── userRoutes.js
```

* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files. 
* `server` contains all of the server side and database code.
  * `db` is a directory that contains the database adapter file
    * `index.js` is the database adapter file
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
  * `database.js` is responsible for all queries to the database.

### ERD

![lightbnb_erd drawio](https://user-images.githubusercontent.com/114053788/221342969-5b081881-7f7e-49d4-805c-d75368d33f33.png)

## Setup

### Dependencies

- [bcrypt - 3.0.6](https://www.npmjs.com/package/bcrypt)
- [body-parser - 1.19.0](https://www.npmjs.com/package/body-parser)
- [cookie-session - 1.3.3](https://www.npmjs.com/package/cookie-session)
- [express - 4.17.1](https://www.npmjs.com/package/express)
- [nodemon - 1.19.1](https://www.npmjs.com/package/nodemon)
- [pg - 8.9.0](https://www.npmjs.com/package/pg)
- [dotenv - 16.0.3 (optional, but recommended)](https://www.npmjs.com/package/dotenv)
- [node - 16.18.0](https://nodejs.org/en/download/)
- [npm - 8.19.2](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [PostgreSQL - 10.19](https://www.postgresql.org/)


### Instructions
  
* Install dependencies with `npm i` command 
* Create a PostgreSQL database by:
  - [installing](https://www.postgresql.org/docs/current/tutorial-install.html) (Alt. OS-specific install: [Windows](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/), [Mac](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/)) it in your environment (Ubuntu Linux in my case)
  Additional
  - Once configured, enter the PostgreSQL shell from your bash CLI using the following command:
  ```
  psql
  ```
  - If you encounter an error, it may due to the postgres server not automatically starting, if so run the following command:
  ```
  startpostgres
  ```
  - If you get prompted for the database information, you may specify desired values for each field, or you may keep the defaults by hitting enter (**keep note of these values**).
  - Use [this](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/) guide if you used the alternate installation links from earlier.
  > **This part is OS agnostic provided a successful conection to the PostgreSQL shell**
  - [create](https://www.postgresql.org/docs/15/sql-createdatabase.html) the database with a name of your choice ('lightbnb' for example) 
  - create the accompanying tables by using this [schema](/migrations/01_schema.sql) running the following command:
  ```
  \i /migrations/01_schema.sql
  ```
  >If you encounter errors with this command, ensure that the file path is correct (i.e. the path resolves to the 01_schema.sql file)
  - Add the seeds by running the following commands:
  ```
  \i /seeds/01_seeds.sql
  ```
  ```
  \i /seeds/02_seeds.sql
  ```
* If dotenv is installed, configure the .env file as follows:
```
DB_USER = <database username>
DB_PASSWORD = <database password>
DB_HOST = <database host>
DATABASE = <database name>
```
* Run the following command from your terminal
```
npm run local
```
* In a browser of your choice, navigate to `localhost:3000`

## Demo

https://user-images.githubusercontent.com/114053788/221342991-5e6852cc-3b53-41ef-88b5-b9218de2f376.mp4


