// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import '@matterlabs/hardhat-zksync-solc'
import '@matterlabs/hardhat-zksync-deploy'
import '@matterlabs/hardhat-zksync-verify'

import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
        artifacts: 'artifacts',
        sources: './contracts',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                eraVersion: '1.0.0',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
	zksolc: {
        version: '1.4.1', // Version of the zksolc compiler to use
        compilerSource: 'binary', // or 'docker' if you prefer
        settings: {
            optimizer: {
                enabled: true,
                mode: 'z',
            },
            libraries: {},
        },
    },
    networks: {
        'sepolia-testnet': {
            eid: EndpointId.SEPOLIA_V2_TESTNET,
            url: process.env.RPC_URL_SEPOLIA || 'https://rpc.sepolia.org/',
            chainId: 11155111,
            accounts,
        },
        'abstract-testnet': {
            eid: EndpointId.ABSTRACT_V2_TESTNET,
            url: process.env.RPC_URL_ABSTRACT_TESTNET || 'https://api.testnet.abs.xyz',
            chainId: 11124,
            accounts,
            zksync: true,
            ethNetwork: "sepolia",
        },
        'mainnet': {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: process.env.RPC_URL_MAINNET || 'https://mainnet.infura.io/v3/your-infura-id',
            accounts,
            chainId: 1,
        },
        'abstract': {
            eid: EndpointId.ABSTRACT_V2_MAINNET,
            url: process.env.RPC_URL_ABSTRACT || 'https://api.mainnet.abs.xyz',
            accounts,
            chainId: 2741,
            zksync: true,
            ethNetwork: "mainnet",
        },

        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    

}

export default config