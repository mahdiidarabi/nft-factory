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

#### How to work with smart contracts 

-   Can find on the confluence page

https://totemfi.atlassian.net/wiki/spaces/TP/pages/140804097/Minting+NFT+flows

#### How to mint NFT

by calling the ``` mint``` can mint NFTs and specify their Ids also.

for example the following arguments can be used for minting the first version of community NFt:
```azure
to: 0x1E8a9D0Bd8C19bB27CBb38A997b16B8373578E8a
ids: 100
```
to is the receiver address
id is the ID of the NFT which will be minted

(
    before minting an NFT check that is there any json file by that Id in the base URI,
    if there isn't any json with the name of the Id, you should update the IPFS
)

(
    https://ipfs.io/ipns/k51qzi5uqu5dimucp24o6tiw1dks3q2onwz30q0u6qbfjbq8l6g1gy65ogwvac/

    Golden NFT: Ids from 100 to 110
)

(
    https://ipfs.io/ipns/k51qzi5uqu5dle31pl51fmvqjbe4mr9muz66qsphur02x407bfh6fmh4bdjld0/ 

    Silver NFT: Ids from 200 to 210
)

(
    https://ipfs.io/ipns/k51qzi5uqu5dk6im11s46ub4i117k05vexa6z271os99imq8ees38btopxant7/ 

    Bronze NFT: Ids from 300 to 310
)
