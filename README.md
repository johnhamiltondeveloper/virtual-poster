# Development Environment

tools local

- nodejs (v14.16.0)
- MySQL Community (v8.0.22) - Used for local testing of the database

## backend
setup

- make sure to install nodejs (https://nodejs.org)

### How to start the server
In the commandline go to the backend folder 

start server ```node app.js```

### Setting up datebase
For local development you can use mySQL workbench as a sql server - https://www.mysql.com/products/workbench - (v8.0.22)

The SQL schema can be found in `./virtual-poster/MySQL/database_schema.sql` this is the SQL code that can be used to setup the mysql schema

**importent** The mysql database system will have to be in **legacy authentication mode**

how to change mysql workbench to legacy authentication mode

- executing the mysql install file
- select "Reconfigure" over the mysql server
- In Authentication Method tab, select "Use Legacy Authentication Method"


With in backend folder you need to change the given value below found in the `.env` file to ones used by your mysql database. 

- `DB_HOST=` will need to be the ip of your database
- `DB_USER=` will need to be the user you have setup in the database to be the access user
- `DB_PASS=` this will be the user password that is used for the mysql user account
- `DB_DATABASE=` will need to be set to the database you are accessing with in the mysql system

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=password
DB_DATABASE=database
```

## frontend
In the commandline go to the frontend folder 

start server ```ng serve```

# Deployment

https://angular.io/start/start-deployment

# Recommended Tools
- visual studio code https://code.visualstudio.com/
    - Angular Language Service (visual studio code addon)
    - Angular Files (visual studio code addon)
- github desktop https://desktop.github.com/

# API ref

## authentication

### Login

####request

```
POST http://domainName/auth/login

{
    "email": "data",
    "password": "data"
}

```

#### Response
return type json

- if the password is wrong will return `password: bad` but if the password is ok it will return `password: good`
- if there is no user with that email it will return `email: bad` but if there is an email it will return `email: good`

example of reponse where the user logs in.
```
{
  "email": "good",
  "password": "good"
}
```