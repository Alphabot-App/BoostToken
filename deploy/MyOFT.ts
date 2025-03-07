import assert from 'assert'
import { parseEther } from 'ethers/lib/utils';

import { type DeployFunction } from 'hardhat-deploy/types'
require('dotenv').config()
const contractName = 'Alphabot';
const MINT_INITIAL_SUPPLY_CHAIN_ID = process.env.MINT_INITIAL_SUPPLY_CHAIN_ID? +process.env.MINT_INITIAL_SUPPLY_CHAIN_ID: 11155111;
const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY? parseEther(process.env.INITIAL_SUPPLY): parseEther('1000000000')
// const EndpointV2 = [
//     // Mainnet
//     {
//         chainId: 1,
//         address: "0x1a44076050125825900e736c501f859c50fE728c"
//     },
//     // Sepolia
//     {
//         chainId: 11155111,
//         address: "0x6EDCE65403992e310A62460808c4b910D972f10f"
//     },
//     // Abstract
//     {
//         chainId: 2741,
//         address: '0x5c6cfF4b7C49805F8295Ff73C204ac83f3bC4AE7'
//     },
//     // Abstract Testnet
//     {
//         chainId: 11124,
//         address: '0x16c693A3924B947298F7227792953Cd6BBb21Ac8'
//     },

// ]
    
const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // This is an external deployment pulled in from @layerzerolabs/lz-evm-sdk-v2
    //
    // @layerzerolabs/toolbox-hardhat takes care of plugging in the external deployments
    // from @layerzerolabs packages based on the configuration in your hardhat config
    //
    // For this to work correctly, your network config must define an eid property
    // set to `EndpointId` as defined in @layerzerolabs/lz-definitions
    //
    // For example:
    //
    // networks: {
    //   fuji: {
    //     ...
    //     eid: EndpointId.AVALANCHE_V2_TESTNET
    //   }
    // }
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    if (hre.network.config.chainId === MINT_INITIAL_SUPPLY_CHAIN_ID) {
        console.log(`Deploying contract and minting initial supply with deployer: ${deployer}`)
        const { address } = await deploy(contractName, {
            from: deployer,
            args: [
                'MyOFT', // name
                'MOFT', // symbol
                endpointV2Deployment.address, // LayerZero's EndpointV2 address
                deployer, // owner
                true, // mint flag
                INITIAL_SUPPLY, // initial supply
            ],
            log: true,
            skipIfAlreadyDeployed: false,
        })
        console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address} 
            and minted initial supply to deployer: ${deployer}`)
    } else {
        console.log(`Deploying contract without minting initial supply with deployer: ${deployer}`)
        const { address } = await deploy(contractName, {
            from: deployer,
            args: [
                'MyOFT', // name
                'MOFT', // symbol 
                endpointV2Deployment.address, // LayerZero's EndpointV2 address
                deployer, // owner
                false, // mint flag
                0, // initial supply
            ],
            log: true,
            skipIfAlreadyDeployed: false,
        })
        console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
    }

}

deploy.tags = [contractName]

export default deploy