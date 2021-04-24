# Single-User Accounting System

A sample single user accounting system api

**Author:** Fisayo Agboola

**Environments**

Node version - v14.15.0

YARN version - v1.22.10

**This application uses the following technologies:**

- nodeJs
- expressJs
- jest
- supertest

note: `run all commands in the applications root directory`

## To run the app via docker

```
docker-compose up
```

## To run the app manually

**Install all dependencies**

```
yarn install
```

**Start the application**s

```
source .env

yarn start
```

## To test the application

```
yarn test
```

## Get account balance

**Endpoint** `http://localhost:3000/api/accountBalance` - method (GET)

- Fetches the account balance


**Response format**

```json
{
    "error": false,
    "message": "successful operation",
    "data": {
        "balance": 1000,
        "_links": {
            "self": {
                "href": "/api/accountBalance"
            },
            "getTransaction": {
                "href": "http://localhost:3000/api/transaction",
                "method": "GET"
            },
            "getTransactionHistory": {
                "href": "http://localhost:3000/api/TransactionHistory",
                "method": "GET"
            },
            "initiateTransaction": {
                "href": "http://localhost:3000/api/initiateTransaction",
                "method": "POST"
            }
        }
    }
}
```

### Get a account details by id

**Endpoint** `http://localhost:3000/api/accountDetails/afca119c-98b8-4714-8639-a4c323bf1c4b` - method (GET)

- Fetches a user account details

**Response format**

```json
{
    "error": false,
    "message": "successful operation",
    "data": {
        "id": "afca119c-98b8-4714-8639-a4c323bf1c4b",
        "balance": 1000,
        "effectiveDateTime": "2021-04-24T09:20:47.392Z",
        "_links": {
            "self": {
                "href": "http://localhost:3000/api/accountDetails/:accountId"
            },
            "getAccountBalance": {
                "href": "http://localhost:3000/api/accountBalance",
                "method": "GET"
            },
            "getTransactionHistory": {
                "href": "http://localhost:3000/api/TransactionHistory",
                "method": "GET"
            },
            "initiateTransaction": {
                "href": "http://localhost:3000/api/initiateTransaction",
                "method": "POST"
            }
        }
    }
}
```

### application/json

### Get transaction History

**Endpoint** `http://localhost:3000/api/transactionHistory` - method (GET)

- retrieves the transaction history for an account

**Response format**

```json
{
    "error": false,
    "message": "successful operation",
    "data": {
        "transactionHistory": [
            {
                "id": "afca119c-98b8-4714-8639-a4c323bf1c4b",
                "balance": 100,
                "effectiveDateTime": "2021-04-24T09:34:04.822Z",
                "amount": 100,
                "type": "credit"
            },
            {
                "id": "afca119c-98b8-4714-8639-a4c323bf1c4b",
                "balance": 0,
                "effectiveDateTime": "2021-04-24T09:34:05.122Z",
                "amount": 100,
                "type": "debit"
            }
        ],
        "_links": {
            "self": {
                "href": "http://localhost:3000/api/TransactionHistory"
            },
            "getAccountBalance": {
                "href": "http://localhost:3000/api/accountBalance",
                "method": "GET"
            },
            "getAccountDetails": {
                "href": "http://localhost:3000/api/accountDetails/:accountId",
                "method": "GET",
                "param": "uuid"
            },
            "initiateTransaction": {
                "href": "http://localhost:3000/api/initiateTransaction",
                "method": "POST"
            }
        }
    }
}
```

### application/json
**Endpoint** `http://localhost:3000/api/initiateTransaction` - method (POST)

- Authenticates a User

**Payload**

```json
{
    "type": "credit",
    "amount": 1000
}
```

**Response format**

```json
{
    "error": false,
    "message": "successful operation",
    "data": {
        "id": "afca119c-98b8-4714-8639-a4c323bf1c4b",
        "balance": 500,
        "effectiveDateTime": "2021-04-24T09:39:08.838Z",
        "_links": {
            "self": {
                "href": "http://localhost:3000/api/initiateTransaction"
            },
            "getAccountBalance": {
                "href": "http://localhost:3000/api/accountBalance",
                "method": "GET"
            },
            "getAccountDetails": {
                "href": "http://localhost:3000/api/accountDetails/:accountId",
                "method": "GET",
                "param": "uuid"
            },
            "getTransactionHistory": {
                "href": "http://localhost:3000/api/TransactionHistory",
                "method": "GET"
            }
        }
    }
}
```

### application/json

### The app is hosted on heroku with the base URL as 
```
https://single-user-accounting-app.herokuapp.com
```

### Get postman collection link [here](https://www.getpostman.com/collections/f7f16299508219eb4829)
## The Design Principles used are:

- Single Responsibility Principle
- Dependency Inversion Principle
- DRY Principle
- KISS Principle
- YAGNI Principle

### Single Responsibility Principle:

```
I utilized this principle since it makes my code simpler to actualize and forestalls unforeseen side-effects of future changes (when I roll out an improvement in one class or capacity it will be reflected on all the various classes or capacities that relies upon it).
```

### Dependency Inversion Principle:

```
I utilized this principle since I need my 'top-level' objects to be entirely stable and not delicate for change.
```

### DRY Principle:

```
I utilized this principle to make my code more composed and simpler to keep up. And furthermore spare my time at whatever point I need to change something later on.
```

### KISS Principle:

```
I utilized this principle to make it simpler for other software engineers to envision the different parts of the applications, intellectually planning the potential impacts of any change.
```

### YAGNI Principle:

```
I utilized this principle since it abstains from investing energy on features that may not be used and helps me avoid feature creep.
```
