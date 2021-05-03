# Development Environment

tools local

- nodejs
- MySQL Community (Used for local testing of the database)

## backend

In the commandline go to the backend folder 

start server ```node app.js```

### Setting up datebase

> importent

The mysql database system will have to be in legacy authentication mode.


With in backend folder you need to change the given value below found in the `.env` file to ones used by your mysql database. 

- `DB_HOST=` will need to be the ip of your database
- `DB_USER` will need to be the user you have setup in the database to be the acees user
- `DB_PASS` this will be the user password that is used for the mysql user account
- `DB_DATABASE` will need to be set to the database you are accessing with in the mysql system

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
