import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("NFTFactory", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true
    })
}

export default func
export const tags = ["NFTFactory"]
