import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const name = "Bonda Second NFT Collection"
    const symbol = "BSNC"
    const baseURI = "https://ipfs.io/ipfs/QmX4z6XnqLoi8EW5WcvemaoJ3R985CvWoe6fC8kNfFAgND/"
    const nftNumber = 1


    await deploy("NFTCollectionWithBaseURI", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [
            name,
            symbol,
            baseURI
        ]
    })
}

export default func
export const tags = ["NFTCollectionWithBaseURI"]
