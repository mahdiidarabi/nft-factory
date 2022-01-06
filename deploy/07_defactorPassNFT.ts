import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { BigNumber } from "ethers"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    let name = "Defactor Pass";
    let symbol = "DePNFT"

    await deploy("DefactorPassNFT", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [
            name,
            symbol,
        ],
        gasLimit:4000000,
        gasPrice:BigNumber.from(40000000000)
    })
}

export default func
export const tags = ["DefactorPassNFT"]
