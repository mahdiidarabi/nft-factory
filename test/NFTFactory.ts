import { expect, use } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { Address } from "hardhat-deploy/dist/types"
import { solidity, MockProvider } from "ethereum-waffle"

import { NFTFactory } from "../src/types/NFTFactory"
import { NFTFactory__factory } from "../src/types/factories/NFTFactory__factory"

import { NFTCollectionWithBaseURI } from "../src/types/NFTCollectionWithBaseURI"
import { NFTCollectionWithBaseURI__factory } from "../src/types/factories/NFTCollectionWithBaseURI__factory"

import { NFTCollectionWithBaseURIWithoutJson } from "../src/types/NFTCollectionWithBaseURIWithoutJson"
import { NFTCollectionWithBaseURIWithoutJson__factory } from "../src/types/factories/NFTCollectionWithBaseURIWithoutJson__factory"


use(solidity)

describe("NFT-Factory", async () => {
    let signer: Signer
    let signer2: Signer

    let signer2Addr: Address
    let signer1Addr: Address

    let nftFactory: NFTFactory
    let nftCollectionWithBaseURI: NFTCollectionWithBaseURI
    let nftCollectionWithBaseURIWithoutJson: NFTCollectionWithBaseURIWithoutJson

    beforeEach(async () => {
        [signer, signer2] = await ethers.getSigners()

        signer2Addr = await signer2.getAddress()
        signer1Addr = await signer.getAddress()

        nftFactory = await deployNFTFactory()
        nftCollectionWithBaseURI = await deployNFTCollectionWithBaseURI()
        nftCollectionWithBaseURIWithoutJson = await deployNFTCollectionWithBaseURIWithoutJson()
    })

    const deployNFTFactory = async (_signer?: Signer): Promise<NFTFactory> => {
        const nftFactoryFactory = new NFTFactory__factory(_signer || signer)
        const nftFactory = await nftFactoryFactory.deploy()
        return nftFactory
    }

    const deployNFTCollectionWithBaseURI = async (_signer?: Signer): Promise<NFTCollectionWithBaseURI> => {
        const nftFactory = new NFTCollectionWithBaseURI__factory(_signer || signer)
        const nft = await nftFactory.deploy(
            "name_1",
            "symbol_1",
            "basrURI_1/"
        )
        return nft
    }

    const deployNFTCollectionWithBaseURIWithoutJson = async (_signer?: Signer): Promise<NFTCollectionWithBaseURIWithoutJson> => {
        const nftFactory = new NFTCollectionWithBaseURIWithoutJson__factory(_signer || signer)
        const nft = await nftFactory.deploy(
            "name_2",
            "symbol_2",
            "basrURI_2/"
        )
        return nft
    }

    it("create json NFT collection", async () => {
        await expect(
            nftFactory.createNFTCollectionWithBaseURI(
                "name_3",
                "symbol_3",
                "basrURI_3/",
                10
            )
          ).to.emit(nftFactory, "CollectionWithBaseURICreated");
    })

    it("create NFT collection without json", async () => {
        await expect(
            nftFactory.createNFTCollectionWithBaseURI(
                "name_4",
                "symbol_4",
                "basrURI_4/",
                10
            )
          ).to.emit(nftFactory, "CollectionWithBaseURICreated");
    })

    it("mint json NFT collection", async () => {
        await expect(
            nftCollectionWithBaseURI.mint(
                signer2Addr,
                20
            )
          ).to.emit(nftCollectionWithBaseURI, "Transfer");
    })

    it("mint NFT collection without json", async () => {
        await expect(
            nftCollectionWithBaseURIWithoutJson.mint(
                signer2Addr,
                20
            )
          ).to.emit(nftCollectionWithBaseURIWithoutJson, "Transfer");
    })

    it("batch mint json NFT collection", async () => {

        await nftCollectionWithBaseURI.batchMint(signer1Addr, 10)

        expect(
            await nftCollectionWithBaseURI.tokenURI(
                5
            )
          ).to.equal("basrURI_1/5.json");
    })

    it("batch mint NFT collection without json", async () => {

        await nftCollectionWithBaseURIWithoutJson.batchMint(signer1Addr, 10)

        expect(
            await nftCollectionWithBaseURIWithoutJson.tokenURI(
                5
            )
          ).to.equal("basrURI_2/5");
    })
})
