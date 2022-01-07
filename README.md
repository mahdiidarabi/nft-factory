# nft-factory
a sample code for an NFT factory


#### How to run

-   Deploy to testnet (rinkeby in the below example)

```
yarn
PROJECT_ID="infura id" PRIVATE_KEY="private key to deploy the contracts from" yarn deploy:rinkeby
```

-   Deploy to local (requires ganache to run on local)


You can find more information in the `scripts-info` section in the `package.json` file.


#### How to deploy

-   Deploy to rinkeby

```
yarn clean

yarn build

yarn prepare

PRIVATE_KEY=<your-private-key> PROJECT_ID="infura id" yarn deploy:rinkeby
```

#### How to verify a contract

- Verify on bsc_testnet

first you need an API key from your account on https://bscscan.com/login

then run 

```
ETHERSCAN_KEY=<your-api-key> npx hardhat verify --network bsc_testnet --contract contracts/TotemNormalNFT.sol:TotemNormalNFT <contract-address> "constructor's-first-arg" "constructor's-second-arg" "0constructor's-third-arg" "constructor's-forth-arg"
```
