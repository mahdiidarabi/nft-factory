import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    let name = "Bumper Sky Lounge Pass";
    let symbol = "BuSLPNFT"

    await deploy("BumperSkyLoungePassNFT", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [
            name,
            symbol,
        ],
    })
}

export default func
export const tags = ["BumperSkyLoungePassNFT"]
