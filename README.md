# Development Environment

tools local

- nodejs
- MySQL Community (Used for local testing of the database)

## backend

In the commandline go to the backend folder 

start server ```node app.js```

### Setting up datebase

The mysql database will have to be in legacy authentication mode.

You will need to change this code to match the details for you database

```
host: '127.0.0.1',
user: 'root',
password: 'password',
database: 'database',
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
