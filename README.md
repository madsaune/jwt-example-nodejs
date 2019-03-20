JWT-EXAMPLE-NODEJS
--------------------------------

This repository serves the purpose of being a template on how to implement jsonwebtoken authentication in a nodejs API.

## Getting Started

### Prerequisites

Source: [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) 

If you have not previously tapped the official MongoDB formula repository, tap the official MongoDB formula repository to add to the formula list.

    brew tap mongodb/brew

Then install mongodb

    brew install mongodb-community@4.0

Then run mongodb (requires terminal window to be open)

    mongod --config /usr/local/etc/mongod.conf

### Clone and install dependencies

Clone from git:

    git clone https://github.com/madsaune/jwt-example-nodejs.git

Install dependencies with npm:

    cd jwt-example-nodejs
    npm install

### Run

Start the server with the following command:

    npm start