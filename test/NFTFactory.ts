import { expect, use } from "chai"
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { solidity, MockProvider } from "ethereum-waffle"

import { NFTFactory } from "../src/types/NFTFactory"
import { NFTFactory__factory } from "../src/types/factories/NFTFactory__factory"

import { NFTCollectionWithBaseURI } from "../src/types/NFTCollectionWithBaseURI"
import { NFTCollectionWithBaseURI__factory } from "../src/types/factories/NFTCollectionWithBaseURI__factory"

import { NFTCollectionWithBaseURIWithoutJson } from "../src/types/NFTCollectionWithBaseURIWithoutJson"
import { NFTCollectionWithBaseURIWithoutJson__factory } from "../src/types/factories/NFTCollectionWithBaseURIWithoutJson__factory"


use(solidity)

describe("TotemToken", async () => {
    let signer: Signer
    let signer2: Signer

    let nftFactory: NFTFactory
    let nftCollectionWithBaseURI: NFTCollectionWithBaseURI
    let nftCollectionWithBaseURIWithoutJson: NFTCollectionWithBaseURIWithoutJson

    beforeEach(async () => {
        [signer, signer2] = await ethers.getSigners()
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
            "basrURI_1"
        )
        return nft
    }

    const deployNFTCollectionWithBaseURIWithoutJson = async (_signer?: Signer): Promise<NFTCollectionWithBaseURIWithoutJson> => {
        const nftFactory = new NFTCollectionWithBaseURIWithoutJson__factory(_signer || signer)
        const nft = await nftFactory.deploy(
            "name_2",
            "symbol_2",
            "basrURI_2"
        )
        return nft
    }

    it("create json NFT collection", async () => {
        await expect(
            nftFactory.createNFTCollectionWithBaseURI(
                "name_3",
                "symbol_3",
                "basrURI_3",
                10
            )
          ).to.emit(nftFactory, "CollectionWithBaseURICreated");
    })

    it("create NFT collection without json", async () => {
        await expect(
            nftFactory.createNFTCollectionWithBaseURI(
                "name_4",
                "symbol_4",
                "basrURI_4",
                10
            )
          ).to.emit(nftFactory, "CollectionWithBaseURICreated");
    })
})
