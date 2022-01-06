console.log('start')
import {
  TotemEliteNFT__factory,
  TotemNormalNFT__factory,
  GoldenCommunityNFT__factory,
  DefactorPassNFT__factory,
  GhostFoxNFT__factory
} from "./types/"
import * as Factories from './types'
import {
  getDefaultProvider,
  Provider,
  JsonRpcProvider,

} from "@ethersproject/providers"
import matic_mainnet from "../export/abi/matic.json"
import { Signer, Wallet } from "ethers"
import fs from 'fs'
import * as ipfsClient from 'ipfs-http-client'
import express from 'express'
import jwt from 'jsonwebtoken'
import { BigNumber } from "@ethersproject/bignumber"
import * as csv from 'fast-csv';
import config from 'config'
const app = express();
app.use(express.json());
app.listen(() => {
  console.log('server started')
})


const configEnv = process.env;

const verifyToken = (req: express.Request, res: express.Response, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, configEnv.TOKEN_KEY);
    (req as any).user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};


const ipfs = ipfsClient.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
export interface ContractAbi {
  address: string
  abi: any[]
}

export interface ContractMap {
  [name: string]: ContractAbi
}

export interface ChainAbi {
  name: string
  chainId: string
  contracts: ContractMap
}

export interface ChainMap {
  [chainId: number]: ChainAbi
}

const stakingAbis: ChainMap = {
  137: matic_mainnet,
}

const networks: { [key: number]: string } = {
  137: "polygon",
}

export const getAddress = (
  chainId: number,
  map: ChainMap,
  name: string
): string => {
  const chain = map[chainId]
  if (!chain) {
    console.log(`Unsupported chain '${chainId}' for contract ${name}`)
    return ""
  }

  const contract = chain.contracts[name]
  if (!contract) {
    console.log(`No ${name} deployed at network ${chain.name} (${chainId})`)
    return ""
  }

  const address = contract.address
  console.log(
    `${name} resolved to address ${address} at network ${chain.name} (${chainId})`
  )
  return address
}

export const getProvider = () => {
  let chainID = parseInt(process.env.CHAIN_ID as string)
  if (chainID == 137) {
    return new JsonRpcProvider(process.env.POLYGON_URL, chainID)
  }

  return getDefaultProvider(networks[chainID], {
    etherscan: process.env.ETHERSCAN_KEY,
    infura: process.env.INFURA_ID,
  })
}
function getContract<C>(
  connector: (address: string, signerOrProvider: Signer | Provider) => C,
  abis: ChainMap,
  name: string
): C | undefined {
  const wallet = new Wallet(process.env.PRIVATE_KEY as string, getProvider())
  // try to resolve address
  const address = getAddress(parseInt(process.env.CHAIN_ID as string), abis, name)

  if (address) {
    // call the factory connector
    return connector(address, wallet)
  } else {
    return undefined
  }
}
export function getContractFromAddress<C>(
  connector: (address: string, signerOrProvider: Signer | Provider) => C,
  address: string
): C {
  const wallet = new Wallet(process.env.PRIVATE_KEY as string, getProvider())

  // call the factory connector
  return connector(address, wallet)
}
async function mint(eliteAddresses: string[], oracleAddresses: string[]) {
  let ElitFactory = getContractFromAddress(TotemEliteNFT__factory.connect, "0xEa983F7c3f7681C4f509b860DFC14376eED292f0")
  let NormalFactory = getContractFromAddress(TotemNormalNFT__factory.connect, "0xA61151F49A554C5dA1608005453589e9406736f4")
  let EliteWalletAddresses = [].concat(eliteAddresses)
  let EliteWalletAddressesHoldingWallet = [].concat(eliteAddresses)
  let EliteIPFSLinks = []
  let sampleLink = `{"name":"Totem Oracle Membership","description":"Entry into the strongest Totem Warriors group ","image":"https://ipfs.io/ipfs/QmdHtVAaQLscVSnjgyyxqvE8qMLnoThvKZEtTGH7qV6gmH","external_url":"https://totemfi.com/","unique_address":"%s"}`
  let sampleEliteLink = `{"name":"Totem Elite Membership","description":"Entry into the strongest Totem Warriors group ","image":"https://ipfs.io/ipfs/QmcUsh44y9xz7MeyGgZsTN6BLZjNiN332sVYPH3y2ja6PZ","external_url":"https://totemfi.com/","unique_address":"%s"}`

  let NormalAddresses = [].concat(oracleAddresses)
  let NormalAddressesHoldingWallet = [].concat(oracleAddresses)
  let NormalIPFSLinks = [
  ]
  const ipfsLnk = `https://ipfs.io/ipfs/%s`
  // var stream = fs.createWriteStream("res.txt", {flags:'a+'});
  for (let i = 0; i < EliteWalletAddresses.length; i++) {
    try {
      const val = EliteWalletAddresses[i]
      let link = sampleEliteLink.replace("%s", EliteWalletAddressesHoldingWallet[i])
      fs.writeFileSync(val, link)
      const file = fs.readFileSync(val)
      console.log("ipfs add")
      const filesAdded = await ipfs.add({ path: val, content: file })
      const ipfsLink = ipfsLnk.replace("%s", filesAdded.cid.toString())
      EliteIPFSLinks.push(ipfsLink)
      fs.unlinkSync(val)
    } catch (error) {
      console.error(error)
    }
  }
  for (let i = 0; i < NormalAddresses.length; i++) {
    try {
      const val = NormalAddresses[i]
      let link = sampleLink.replace("%s", NormalAddressesHoldingWallet[i])
      fs.writeFileSync(val, link)
      const file = fs.readFileSync(val)
      console.log("ipfs add")
      const filesAdded = await ipfs.add({ path: val, content: file })
      const ipfsLink = ipfsLnk.replace("%s", filesAdded.cid.toString())
      NormalIPFSLinks.push(ipfsLink)
      fs.unlinkSync(val)
    } catch (error) {
      console.error(error)
    }
  }
  try {
    console.log("done stream")
    for (let i = 0; i < EliteWalletAddresses.length; i++) {
      await (await ElitFactory.mintToCaller(EliteWalletAddresses[i], EliteIPFSLinks[i], { gasPrice: BigNumber.from("40000000000"), gasLimit: BigNumber.from("400000") })).wait(1)
      console.log(`mint elite ${EliteWalletAddresses[i]}`)
    }
    for (let i = 0; i < NormalAddresses.length; i++) {
      await (await NormalFactory.mintToCaller(NormalAddresses[i], NormalIPFSLinks[i], { gasPrice: BigNumber.from("40000000000"), gasLimit: BigNumber.from("400000") })).wait(1)
      console.log(`mint normal ${NormalAddresses[i]}`)
    }
  } catch (error) {
    console.error(error)
  }
}

async function mintCommunity(addresse: string, count: number = 1, type: string, imageUrl: string, description: string, ids: number[], factoryContract: string, contractAddress: string) {
  let contract = Factories.GoldenCommunityNFT__factory
  if (contract === undefined || contract === null) {
    console.error("contract  is wrong")
    console.error(contract)
    return
  }
  if (description.length < 2) {
    console.error("descripton length is wrong")
    return
  }
  if (imageUrl.length < 2) {
    console.error("imageUrl length is wrong")
    return
  }
  if (type.length < 2) {
    console.error("type length is wrong")
    return
  }
  if (count < 1) {
    console.error("count  is wrong")
    return
  }

  if (addresse.length < 8) {
    console.error("addresses  is wrong")
    return
  }
  let contractFactory = getContractFromAddress(GoldenCommunityNFT__factory.connect, contractAddress)
  let sampleLink = `{"name":"TOTM Community ${type} NFT","description":"${description}","image":"${imageUrl}","external_url":"https://totemfi.com/","unique_address":"%s"}`

  const ipfsLnk = `https://ipfs.io/ipfs/%s`

  try {
    console.log("done stream")
    for (let i = 0; i < ids.length; i++) {
      let res = await (await contractFactory.mint(addresse, ids[i])).wait(1)
      console.log(res)
      console.log(`mint normal ${ids[i]}`)
    }
  } catch (error) {
    console.error(error)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function findValidAccounts(): Promise<string> {
  return new Promise((resolve, reject) => {
    let provider = getProvider()
    let rowList = []
    let validAddrs = "Timestamp,Email Address,Please enter your Telegram handle,address\n"
    let file = fs.openSync("res.csv", "a+")
    fs.createReadStream("/Users/amirnouri/Documents/totemfi/deca.csv")
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', async (row) => {
        try {
          rowList.push(row)

        } catch (error) {
          console.error(error)
        }
      })
      .on('end', async (rowCount: number) => {
        for (let i = 188; i < rowList.length; i++) {
          try {

            let address = rowList[i]["address"] as string
            if (address.startsWith("0x") == false) {
              continue
            }
            let balance = await provider.getBalance(address)
            let txcount = await provider.getTransactionCount(address)
            if (txcount > 0 && balance.gt(0)) {
              fs.writeSync(file, Buffer.from(`${Object.values(rowList[i]).join(',')}\n`))
              // fs.writeFileSync("test.csv", `${Object.values(rowList[i]).join(',')}\n`)
              validAddrs = validAddrs + (`${Object.values(rowList[i]).join(',')}\n`)
            }
          } catch (error) {
            await sleep(2000)
            i = i - 1
          }
        }
        resolve(validAddrs)
        console.log(`Parsed ${rowCount} rows`)
      });

  })

}

async function mintDefactorNFT(): Promise<void> {
  let rows = []
  await new Promise((resolve, reject) => {
    fs.createReadStream("defactor.csv")
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
        reject()
        console.error(error)
      })
      .on('data', async (row) => {
        try {
          rows.push(row)
        } catch (error) {
          console.error(error)
        }
      })
      .on('end', async (rowCount: number) => {
        resolve(null)
        console.log(`Parsed ${rowCount} rows`)
      });
  })

  let contractFactory = getContractFromAddress(DefactorPassNFT__factory.connect, "0x4d9e944d1b66e0093c13e80a4fd40ebaeb06bd68")
  for (let i = 0; i < rows.length; i++) {
    try {
      console.log("done stream")
      console.log(`addr :${rows[i]["address"]}`)
      if (rows[i]["address"].startsWith("0x")) {
        if ((await contractFactory.balanceOf(rows[i]["address"])).gt(0) == false) {
          let res = await (await contractFactory.mintToCaller(rows[i]["address"], "TheFactory", {
            gasLimit: 4000000,
            gasPrice: BigNumber.from(40000000000)
          })).wait(1)
          console.log(res)
        }
      }
    } catch (error) {
      await sleep(1000)
      i = i - 1
    }
  }

}
async function minDefactorNFTOne(addrs: string[]): Promise<void> {
  let contractFactory = getContractFromAddress(DefactorPassNFT__factory.connect, "0x4d9e944d1b66e0093c13e80a4fd40ebaeb06bd68")
  for (let i = 0; i < addrs.length; i++) {
    try {
      let res = await (await contractFactory.mintToCaller(addrs[i], "TheFactory", {
        gasLimit: 4000000,
        gasPrice: BigNumber.from(40000000000)
      })).wait(1)
      console.log(res)
    } catch (error) {
      console.error(error)
    }

  }
}

async function mintNFT(address: string, count: number = 1, contractAddress: string ,description:string) {
  let contract = Factories.GoldenCommunityNFT__factory
  if (contract === undefined || contract === null) {
    console.error("contract  is wrong")
    console.error(contract)
    return
  }
  if (count < 1) {
    console.error("count  is wrong")
    return
  }

  let contractFactory = getContractFromAddress(GhostFoxNFT__factory.connect, contractAddress)

  try {
    console.log("done stream")
    for (let i = 0; i < count; i++) {
      let res = await (await contractFactory.mintToCaller(address, description)).wait(1)
      console.log(res)
      console.log(`mint normal ${i}`)
    }
  } catch (error) {
    console.error(error)
  }
}
mintNFT("0xa849AD637713050a68bb857ab317ED6BCF092f16",253,"0x2A72fBf46bCa052Ad96Cb9534Cc8A2934456C8d2","Ghost Fox TotemFi cid:bafybeihmsse53hbmof5ns4ls5gsca3lgddwj4t7awcvwj3x5qqwqbpw4ye").then(r=>{
  console.log("don")

}).catch(err=>{
  console.error(err)
})
// var ids = Array.from({ length: 10 }, (_, i) => i + 100)
// mintCommunity("0xc6D62E9E57a9CA625d73fA29B41Aa13C421cB4Fd", 1, "OWL", "https://ipfs.io/ipfs/QmWsxpMjL8bvWhvXEebPzTtkXRVZc8MMUGGZwexxLhrGYh/GoldenTileOfEagle.jpg", config.get("communityNFT.owl.description"), ids, "GoldenCommunityNFT__factory", "0x118dA0d35b1c69307d292c0fC4029DFef7D83e49").then((res) => {
//   console.log("end")
// })

// minDefactorNFTOne([
//   "0x3c93EE25724eA5a48fD668262D41542B32554563"]).then(res => {
//     console.log("done")
//   })
// mintDefactorNFT().then(res => {
//   console.log("done")
// })`