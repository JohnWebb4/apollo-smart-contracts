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

Install [Metamask](https://metamask.io/) if you haven't

Request KETH using [ethdrop](https://ethdrop.dev/)

## Tasks

- [x] Setup Node server
- [ ] Deploying smart contract contract to test newtork
- [ ] Apollo GraphQL server for user endpoints
  - [x] Define schema
  - [ ] Hooking into web3
- [ ] Background worker for calling contract and indexing events
- [ ] Mongo database for indexing events
- [ ] User validation on endpoints

## Contracts

Used [Remix](https://remix.ethereum.org) to generate the artifacts

Copy results into repo for preserving with code

IdentityManager Contract address: 0xd9145CCE52D386f254917e481eB44e9943F39138

## Future
