import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    let name = "Totem Elite NFT";
    let symbol = "TEnft"

    await deploy("TotemEliteNFT", {
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
export const tags = ["TotemEliteNFT"]
