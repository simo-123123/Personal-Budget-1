# Personal Budget 1
## Overview
A Node/Express API that allows users to manage a personal budget using envelope budgeting principles.

Every envelope is stored in a SQLite database with a title explaining its purpose and a specific amount of money inside it. Using this API, you can:
- Perform basic CRUD operations (creating, reading, updating and deleting envelopes)
- Increase/decrease the budget inside your envelopes
- Transfer money between multiple envelopes
- Evenly distribute a budget between a list of envelopes

This is a Portfolio Project from the **Codecademy Back End Engineer Career Path.**

## Installation
To run this project, you must have Node.js installed on your machine. The project was built using Node.js 22, so older versions could cause issues.

To start the server, run `npm install` to install the dependencies and start the app using `node server.js`. You can also use `npm start` to run the program with [nodemon](https://www.npmjs.com/package/nodemon).  

By default, the app listens on port 3000. You can change this by simply setting the `PORT` environment variable in your `.env` file. You can also enable [morgan](https://www.npmjs.com/package/morgan) logging by setting `NODE_ENV` to `development`

## Routes
> **Note:** This api doesn't accept amounts of money with more than 2 decimals. All requests with an invalid amount will send a 400 response.
- **GET /api/envelopes**  
Retrieves all envelopes in the database.  
```json
// Example response body:

{
    "envelopes": [
        {
            "id": 1,
            "title": "Bills",
            "budget": 100000
        },
        {
            "id": 2,
            "title": "Food",
            "budget": 5000
        },
        {
            "id": 3,
            "title": "Subscriptions",
            "budget": 500
        }
    ]
}
```
- **GET /api/envelopes/:id**  
Retrieves the envelope with the given ID.
```json
// Example response body for GET /api/envelopes/3:

{
    "envelope": {
        "id": 3,
        "title": "Subscriptions",
        "budget": 500
    }
}
```
- **POST /api/envelopes**  
Inserts a new envelope in the database and returns it in the response body.
```json
// Example request body (both properties are required):

{
    "envelope": {
        "title": "Fun", // non-empty string
        "budget": 2000 // non-negative number
    }
}
```
- **PUT /api/envelopes/:id**  
Replaces the envelope with the specified ID with the one provided in the request body. Same syntax as POST request.  

- **DELETE /api/envelopes/:id**  
Deletes the envelope with the given ID.  

- **POST /api/envelopes/:id/increase**  
Puts the specified amount of money inside the envelope with the given ID. Returns the updated envelope.
```json
// Example request body for POST /increase, /spend and /transfer

{
    "amount": 100 // higher than 0
}
```
- **POST /api/envelopes/:id/spend**  
Takes the specified amount of money out of the envelope with the given ID. Returns the updated envelope.  

- **POST /api/envelopes/transfer/:from/:to**  
Transfers the specified amount of money from the first envelope (:from) to the second one (:to).
```json
// Example response body for POST /api/envelopes/transfer/3/2 (amount: 100)

{
    "from": {
        "title": "Subscriptions",
        "budget": 400
    },
    "to": {
        "title": "Food",
        "budget": 5100
    }
}
```
- **POST /api/envelopes/distribute**  
Envenly distributes an amount of money between multiple envelopes.
```json
// Example request body:

{
    // Array of envelope IDs to distribute the amount to 
    "envelopes": [1, 2, 3],
    // Amount to distribute (higher than 0)
    "amount": 300
}

// Example response body:

{
    // Array of updated envelopes
    "envelopes": [
        {
            "id": 1,
            "title": "Bills",
            "budget": 100100
        },
        {
            "id": 2,
            "title": "Food",
            "budget": 5100
        },
        {
            "id": 3,
            "title": "Subscriptions",
            "budget": 600
        }
    ],
    // Remainder of the operation (for example,
    // distributing 0.05 between 2 envelopes
    // would return a remainder of 0.01)
    "remainder": 0
}