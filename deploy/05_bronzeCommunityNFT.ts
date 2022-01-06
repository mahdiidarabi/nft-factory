import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import config from "config"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // FIXME: should add an base URI
    let baseURI = config.get("communityNFT.forest.baseUri")

    console.log(deployer)
    await deploy("BronzeCommunityNFT", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [
            baseURI,
        ],
    })
}

export default func
export const tags = ["ForestCommunityNFT"]