import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
import { sep } from 'path'
const USE_MAINNET = process.env.USE_MAINNET === 'true'
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS
const abstractContract: OmniPointHardhat = {
    eid: USE_MAINNET? EndpointId.ABSTRACT_V2_MAINNET :EndpointId.ABSTRACT_V2_TESTNET,
    contractName: 'Alphabot',
}

const mainnetContract: OmniPointHardhat = {
    eid: USE_MAINNET? EndpointId.ETHEREUM_V2_MAINNET :EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'Alphabot',
}

const dvns = {
    mainnet: {
        layerZero: "0x589dedbd617e0cbcb916a9223f4d1300c294236b",
        stargate: "0x8fafae7dd957044088b3d0f67359c327c6200d18"
    },
    sepolia: {
        layerZero: "0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193",
    },
    abstract: {
        layerZero: "0xf4da94b4ee9d8e209e3bf9f469221ce2731a7112",
        stargate: "0xcec9f0a49073ac4a1c439d06cb9448512389a64e"
    },
    abstractSepolia: {
        layerZero: "0x5dfcab27c1eec1eb07ff987846013f19355a04cb",
    }
    
}

const executors = { 
    mainnet: "0x173272739Bd7Aa6e4e214714048a9fE699453059",
    sepolia: "0x718B92b5CB0a5552039B593faF724D182A881eDA",
    abstract: "0x643E1471f37c4680Df30cF0C540Cd379a0fF58A5",
    abstractSepolia: "0x5c123dB6f87CC0d7e320C5CC9EaAfD336B5f6eF3"
}

const sendUln302 = {
    mainnet: "0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1",
    sepolia: "0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE",
    abstract: "0x166CAb679EBDB0853055522D3B523621b94029a1",
    abstractSepolia: "0xF636882f80cb5039D80F08cDEee1b166D700091b"
}

const receiveUln302 = {
    mainnet: "0xc02Ab410f0734EFa3F14628780e6e695156024C2",
    sepolia: "0xdAf00F5eE2158dD58E0d3857851c432E34A3A851",
    abstract: "0x9d799c1935c51CA399e6465Ed9841DEbCcEc413E",
    abstractSepolia: "0x2443297aEd720EACED2feD76d1C6044471382EA2"
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: mainnetContract,
            config: {
                owner: DEPLOYER_ADDRESS,
                delegate: DEPLOYER_ADDRESS,
            }
        },
        {
            contract: abstractContract,
            config: {
                owner: DEPLOYER_ADDRESS,
                delegate: DEPLOYER_ADDRESS,
            }
        },

    ],
    connections: [
        {
            from: mainnetContract,
            to: abstractContract,
            config: {
                // SendUln302 sepolia testnet
                sendLibrary: USE_MAINNET ? sendUln302.mainnet : sendUln302.sepolia,
                receiveLibraryConfig: {
                    // ReceiveUln302 sepolia testnet
                    receiveLibrary: USE_MAINNET ? receiveUln302.mainnet : receiveUln302.sepolia,
                    gracePeriod: 0n,
                },
                sendConfig: {
                    executorConfig: {
                        executor: USE_MAINNET ? executors.mainnet : executors.sepolia,
                        maxMessageSize: 10000,
                    },
                    ulnConfig: {
                        confirmations: 12n,
                        requiredDVNs: USE_MAINNET ? [dvns.mainnet.layerZero, dvns.mainnet.stargate] : [dvns.sepolia.layerZero],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 12n,
                        requiredDVNs: USE_MAINNET ? [dvns.mainnet.layerZero, dvns.mainnet.stargate] : [dvns.sepolia.layerZero],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    }
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 150000,
                    }
                ]
            }
        },
       
        {
            from: abstractContract,
            to: mainnetContract,
            config: {
                sendLibrary: USE_MAINNET ? sendUln302.abstract : sendUln302.abstractSepolia,
                receiveLibraryConfig: {
                    receiveLibrary: USE_MAINNET ? receiveUln302.abstract : receiveUln302.abstractSepolia,
                    gracePeriod: 0n,
                },
                sendConfig: {
                    executorConfig: {
                        executor: USE_MAINNET ? executors.abstract : executors.abstractSepolia,
                        maxMessageSize: 10000,
                    },
                    ulnConfig: {
                        confirmations: 12n,
                        requiredDVNs: USE_MAINNET ? [dvns.abstract.layerZero, dvns.abstract.stargate] : [dvns.abstractSepolia.layerZero],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    }
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 12n,
                        requiredDVNs: USE_MAINNET ? [dvns.abstract.layerZero, dvns.abstract.stargate] : [dvns.abstractSepolia.layerZero],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    }
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 150000,
                    }
                ]
            }
        }
        
    ],
}

export default config
