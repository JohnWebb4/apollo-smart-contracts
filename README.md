# Apollo with Smart Contracts

## Goal

Build an Apollo GraphQL server to allow users to sign up and update their user information.

## Setup

Install Node 12

Install packages

```sh
npm i
```

## Development

Install [Metamask](https://metamask.io/), if you haven't already

Copy see [sample.env](/sample.env) into .env file.

Setup a wallet and account for service. Add private key to .env

Request Kovan using [chain-link](https://faucets.chain.link/kovan)

Request Rinkeby ETH using [chain-link](https://faucets.chain.link/rinkeby)

Setup [Infura](https://infura.io/) project and popualte .env with endpoints

Setup [MongoDb Cluster](https://www.mongodb.com/) and add url to .env and add x509 cert to project as ./db-certificate.pem file

Setup [Redis Cluster](https://redis.com/) and add host, password, and port to .env

## Roadmap

- [x] Setup Node server
- [x] Deploying smart contract contract to test newtork
  - [x] Kovan
  - [x] Rinkby (https://twitter.com/John_Webb_1/status/1469238463601938433)
- [ ] Apollo GraphQL server for user endpoints
  - [x] Define GraphQL schema
  - [x] Hooking into ethers
  - [x] Get address from auth signature
  - [ ] Implement signup
  - [ ] Implement updates
  - [ ] Implement searching user
  - [x] Add bull for worker queue
- [x] Boilerplate website to fetch auth signature
- [x] Background worker and indexing events
- [x] Mongo database for indexing events
- [x] User validation on endpoints

## Contracts

Used [Remix](https://remix.ethereum.org) to generate the artifacts

Copy results into repo for preserving with [code](/contracts/artifacts)

## MongoDB

## Data

### Contract Event

```
{
  id: string # chainid:address
  blockNumber: long # number on block
  eventName: string # name of event
  addr: string # chain user address
  username: string
  name: string? # name of user
  twitter: string? # twitter handle
}
```

### Indexes

- id asc and blockNumber asc: Filter by id and sort contract events by blockNumber

## Redis

### latestBlock: number # the most recent block that has been referenced

### contract-events: { chain: { id: int, name: string, identityAddress: string } } # message queue of events to trigger index

## Future
