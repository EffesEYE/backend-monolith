# EffesEYE Backend (monolith)

[![Maintainability](https://api.codeclimate.com/v1/badges/2fe625744b3dee288cba/maintainability)](https://codeclimate.com/repos/5f8b5b5daa271c3997004343/maintainability) <img src="./tests/coverage/badge.svg">

The EffesEYE backend is a monolithic NodeJS/Express application, implemented as a simple REST service, in compliance with the EffesEYE platform APIs specified at [http://effeseye-api.netlify.com](http://effeseye-api.netlify.com)

## Usage

*   clone the repo: `git clone git@github.com:EffesEYE/backend-monolith.git`
*   cd into the repo folder: `cd backend-monolith`
*   run `npm install`
*   run `npm start:dev`
*   Using POSTMAN (or similar), set the host to `http://localhost:8181/2020-10` then hit the endpoints [documented in the API](http://effeseye-api.netlify.com) with the necessary input data

## Architecture

## Technology Stack

*   Language:  JavaScript (ES6)   
*   HTTP Handler:  NodeJs / Express
*   Cloud Provider:  Heroku
*   Database:  MySQL
*   Data Access: 
*   In-memory Store:  Redis
*   Security Scheme:  HTTP Authorization Header via JSON Web Tokens
*   Code Quality:  Code Climate
*   Monitoring:  Moesif.com

## Security Considerations

## Monitoring & Observerbility

