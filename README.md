## Description

A dating app using NestJS, MongoDB

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn dev

# production mode
$ yarn prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Create mkcert
# Setup mkcert tool
brew install mkcert (for MacOS)

mkcert -install

mkdir -p .cert

mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"