Works best on windows.

if on mac you may have to reinstall some mpm modules to work with the unix type system this may happen with a linex server too.

# Deployment

Has not been tested on a real production environment



A mysql server will need to be setup on the server and the info change on the .env backend file to what the mysql database needs.

the development environment section talks about how the database needs to be setup but it will need to use a database server that works with the server type e.g. unix or windows

## outstanding deployment problems

1. API address are hardcoded into the frontend like `http://localhost:3000/auth/login`  
   
   They will need to be set to the server address they are found in `auth.service.ts` it maybe better in the future to make this reference a config file.
   
    

# Development Environment

You must run the backend and the frontend systems together



Tools local

- nodejs (v14.16.0)
- MySQL Community (v8.0.22) - Used for local testing of the database
- angular command-line interface

## Frontend

You will need to install angular command-line interface tool on your system

`npm install -g @angular/cli`

### How to start frontend server

open backend folder in command line.

Run `ng serve`

## Backend

setup

- make sure to install nodejs (https://nodejs.org)

### How to start the backend server

In the commandline go to the backend folder 

start server ```node app.js```

### Setting up backend and frontend connection

With in the backend folder you need to change the value in the .env file of `BACKEND_DOMAIN=http://localhost:3300` to the address and port of you frontend server to allow the backend to communicate with the frontend or else you will get a CORS error.

### Setting up database

![](GRD_V4.png)

For local development you can use mySQL workbench as a sql server - https://www.mysql.com/products/workbench - (v8.0.22)



The SQL code for creating the schema is at `./virtual-poster/MySQL/database_schema.sql` 

within a mysql workbench server create a schema when you have the schema object created and selected copy this code into a workbench code window and run it this will create all the tables needed

> note that this database schema code is only the code to create the tables you will need to create a schema object with in the sql system



**important** The mysql database system will have to be in **legacy authentication mode**



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

# API ref

## authentication

### Login

#### request

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

example of reponse json body where the user logs in.

```
{
  "email": "good",
  "password": "good"
}
```

### Register

#### Request

http Request to create user

```
post http://domainName/auth/register
content-type: application/json

{
    "email": "admin1",
    "password": "admin"
}
```

#### Response

return type json

- if `"email": "bad"` then the email is in use, but if `"email": "good"` then the email is not been used and can be used
- if `"user_created": "no"` then no user was created, but if `"user_created": "yes"` then user has been created

An Example of json response where email is in use.

```
{
  "email": "bad",
  "user_created": "no"
}
```

### logout

API endpoint for logining the user out

#### Request

http Request to logout

```
post http://domainName/auth/logout
```

#### Response

if user loged out `"logout": "good"` but if there is no user to logout `"logout": "good"` is returned

successful logout Response json body

```
{
  "logout": "good"
}
```

user already logedout Response json body

```
{
  "logout": "no-login"
}
```

### Create Conference

#### request

```
post http://localhost:3000/conference/create
content-type: application/json

{
    "name": "name of event"
}
```

#### Response

Returns if the conference was created `"create": "good"` if there is an error with creating the conference then will return `{created: 'bad'}` 

Will return the ID of the new conference like this `"conferenceID": "5a3c5c6d-fde5-44f5-a9c5-8d85cf563d0`

```
{
  "create": "good",
  "conferenceID": "5a3c5c6d-fde5-44f5-a9c5-8d85cf563d0c"
}
```

### Update Conference

#### Request

- `name: name` should be the new name you want to update the conference with

- `conferenceID: id` should be the id of the conference you want to update 

```
post http://localhost:3000/conference/update
content-type: application/json

{
    "name": "new name",
    "conferenceID": "the id of the confernce"
}
```

#### Response

- `updated: value` **good** means it was updated, **no** means it did not update, **bad** means there is an error

- `exists: value`  **yes** means there was a value to update, **no** means there is no values updated

- `conferenceID: id` just returns the id of the conference that was updated

```
{
  "updated": "good",
  "exists": "yes",
  "conferenceID": "ca0d7c22-768b-49db-8250-321e12e1754d"
}
```

### Remove Conference

#### Request

- `conferenceID: id` allows the system to know what conference to remove

```
post http://localhost:3000/conference/remove
content-type: application/json

{
    "conferenceID": "a4eb123d-1c44-454a-a287-f4a3c689740"
}
```

#### Response

- `removed: value` **good** means the conference was removed, **bad** means there is an error

- `conferenceID: value`  just returns the conferenceID 

```
{
"removed": "bad", 
"conferenceID": "ca0d7c22-768b-49db-8250-321e12e1754d"
}
```

### Get Conference

#### Request

- `conferenceID: id` allows the system to know what conference to return data for.

```
post http://localhost:3000/conference/data
content-type: application/json

{
    "conferenceID": "ca0d7c22-768b-49db-8250-321e12e1754d"
}
```

#### Response

- `results: value` **yes** means the conference was found, **bad** means there is an error and **no** means there is no conference with that id.

- `data: value` stores an object with all the data of the conference

- `conferenceID: value` is just the id of the conference

```
{
"results": "yes",
"data": {"name": "name of confernce"}, 
"conferenceID": "ca0d7c22-768b-49db-8250-321e12e1"
}
```

### add attendees

#### Request

- `conferenceID: id` allows the system to know what conference to added the attendees too
- `users:[]` is an array of user ids you want to added

```
post http://localhost:3000/conference/attendees/add
content-type: application/json

{
    "users": [27,29,30],
    "conferenceID": "ca0d7c22-768b-49db-8250-321e12e1754d"
}
```

#### Response

- `"done: value` **yes** means the attendees where added, **no** means that they where not added.

```
{
  "done": "yes"
}
```

### remove attendees

#### Request

- `conferenceID: id` allows the system to know what conference to remove the attendees from
- `users:[]` is an array of user ids you want to remove.

```
post http://localhost:3000/conference/attendees/add
content-type: application/json

{
    "users": [27,29,30],
    "conferenceID": "ca0d7c22-768b-49db-8250-321e12e1754d"
}
```

#### Response

- `"done: value` **yes** means the attendees where removed, **no** means that they where not removed.

```
{
  "done": "yes"
}
```

### Get attendees

#### Request

`ConferenceID: value` is the value that is given to tell the system what conference to get the list attendees from.

```
post http://localhost:3000/conference/attendees
content-type: application/json

{
    "conferenceID": "ca0d7c22-768b-49db-8250-321e12e1754d"
}
```

#### Response

- `attendees: []` is an array of objects that include the attendees `UserID` and `name`

```
{
  "attendees": [
    {
      "UserID": 27,
      "name": null
    },
    {
      "UserID": 29,
      "name": null
    },
    {
      "UserID": 30,
      "name": null
    }
  ]
}
```

### Get conferences from users

#### Request

user must be logged in or else will return `401 unauthorized`

```
post http://localhost:3000/user/conferences
```

#### Response

- `events: []` is an array of objects that include the conferences `EventID` and `name` for all the conferences the user has access too.

```
{
  "events": [
    {
      "EventID": "ca0d7c22-768b-49db-8250-321e12e1754d",
      "name": "Updated name of project"
    },
    {
      "EventID": "ca0d7c22-768b-49db-8250-ldjflasjfl",
      "name": "Welcome to blender"
    }
  ]
}
```
