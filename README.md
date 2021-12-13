# Apollo with Smart Contracts

## Goal

Build an Apollo GraphQL server to allow users to sign up and update their user information. Information should be stored on an Etherium smart contract.

## Architecture

![Architecture Diaghram](/resources/architecture-diaghram.png)

## Setup

Install [Node 12](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)

Install NPM packages

```sh
yarn
```

## Development

Install [Metamask](https://metamask.io/), if you haven't already

Copy [sample.env](/sample.env) into .env file

Setup a wallet and account for service. Add private key to .env

Request Kovan using [chain-link](https://faucets.chain.link/kovan)

Request Rinkeby ETH using [chain-link](https://faucets.chain.link/rinkeby)

Setup [Infura](https://infura.io/) project and popualte .env with endpoints

Setup [MongoDb Cluster](https://www.mongodb.com/) and add url to .env and add x509 cert to project as ./db-certificate.pem file

Setup [Redis Cluster](https://redis.com/) and add host, password, and port to .env

Obtain Auth Signature from local dev website.

```
yarn start:web:dev
```

## Roadmap

- [x] Setup Node server
- [x] Deploying smart contract contract to test network
  - [x] Kovan
  - [x] Rinkby
- [x] Apollo GraphQL server for user endpoints
  - [x] Define GraphQL schema
  - [x] Hooking into ethers
  - [x] Get address from auth signature
  - [x] Implement signup
  - [x] Implement updates
  - [x] Implement searching user
  - [x] Making signup and update async
  - [x] Add pending index events. Remove if issues
- [x] Boilerplate website to fetch auth signature
- [x] Background workers for updating contract and indexing events using Bull
- [x] Mongo database for indexing events
- [x] User validation on endpoints

## Contracts

Used [Remix](https://remix.ethereum.org) to generate the artifacts

Copy results into repo for preserving with [code](/contracts/artifacts)

## MongoDB

### Data

#### Contract Event

```
{
  id: string # chainid:address
  address: string # contract address
  blockNumber: long # number on block
  eventName: string # name of event
  username: string
  name: string?
  twitter: string? # twitter handle
}
```

#### Indexes

- id asc and blockNumber asc: Filter by id and sort contract events by blockNumber
- id asc and eventName asc: Filter by id and event name

## Redis

### latestBlock

```
number # the most recent block that has been referenced
```

### contract-events

```
{ chain: { id: string, name: string, identityAddress: string } } # message queue of events to trigger index
```

### contract-jobs

```
{ id: string, jobName: string, username: sring, name: string, twitter: string} # message queue of contract jobs
```

## Future

- Implementing front end
- Deleting user
- GraphQL subscription to notify user if worker job fails
