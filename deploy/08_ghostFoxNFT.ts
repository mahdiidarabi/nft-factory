import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { BigNumber } from "ethers"
import config from "config"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // FIXME: should add an base URI
    let baseURI = config.get("ghostFoxNFT.baseUri")

    console.log(deployer)
    await deploy("GhostFoxNFT", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [
            baseURI
        ],
    })
}

export default func
export const tags = ["FoxLakeCommunityNFT"]


// const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
//     const { deployments, getNamedAccounts } = hre
//     const { deploy } = deployments
//     const { deployer } = await getNamedAccounts()

//     // let name = "Totem Ghost Fox NFT";
//     // let symbol = "TGHNFT"
//     let baseURI = config.get("communityNFT.ghost.baseUri")
//     console.log(deployer)
//     await deploy("GhostFoxNFT", {
//         from: deployer,
//         log: true,
//         skipIfAlreadyDeployed: true,
//         args: [
//             baseURI
//         ],
//     })
// }

// export default func
// export const tags = ["GhostFoxNFT"]
