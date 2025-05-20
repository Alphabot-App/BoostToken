import { EndpointId } from '@layerzerolabs/lz-definitions';
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities';

import type {
  OAppOmniGraphHardhat,
  OmniPointHardhat,
} from '@layerzerolabs/toolbox-hardhat';
import { sep } from 'path';
const USE_MAINNET = process.env.USE_MAINNET === 'true';
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const abstractContract: OmniPointHardhat = {
  eid: USE_MAINNET
    ? EndpointId.ABSTRACT_V2_MAINNET
    : EndpointId.ABSTRACT_V2_TESTNET,
  contractName: 'Boost',
};

const mainnetContract: OmniPointHardhat = {
  eid: USE_MAINNET
    ? EndpointId.ETHEREUM_V2_MAINNET
    : EndpointId.SEPOLIA_V2_TESTNET,
  contractName: 'BoostMainnet',
};

const bscContract: OmniPointHardhat = {
  eid: USE_MAINNET ? EndpointId.BSC_V2_MAINNET : EndpointId.BSC_V2_TESTNET,
  contractName: 'Boost',
  address: '0xbE7E12B2E128bC955A0130fFB168F031d7dD8d58',
};

const dvns = {
  mainnet: {
    layerZero: '0x589dedbd617e0cbcb916a9223f4d1300c294236b',
    nethermind: '0xa59ba433ac34d2927232918ef5b2eaafcf130ba5',
  },
  sepolia: {
    layerZero: '0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193',
  },
  abstract: {
    layerZero: '0xf4da94b4ee9d8e209e3bf9f469221ce2731a7112',
    nethermind: '0xc4a1f52fda034a9a5e1b3b27d14451d15776fef6',
  },
  abstractSepolia: {
    layerZero: '0x5dfcab27c1eec1eb07ff987846013f19355a04cb',
  },
  bsc: {
    layerZero: '0xfd6865c841c2d64565562fcc7e05e619a30615f0',
    nethermind: '0x31f748a368a893bdb5abb67ec95f232507601a73',
  },
  pascal: {
    layerZero: '0x0ee552262f7b562efced6dd4a7e2878ab897d405',
  },
};

const executors = {
  mainnet: '0x173272739Bd7Aa6e4e214714048a9fE699453059',
  sepolia: '0x718B92b5CB0a5552039B593faF724D182A881eDA',
  abstract: '0x643E1471f37c4680Df30cF0C540Cd379a0fF58A5',
  abstractSepolia: '0x5c123dB6f87CC0d7e320C5CC9EaAfD336B5f6eF3',
  bsc: '0x3ebD570ed38B1b3b4BC886999fcF507e9D584859',
  pascal: '0x188d4bbCeD671A7aA2b5055937F79510A32e9683',
};

const sendUln302 = {
  mainnet: '0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1',
  sepolia: '0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE',
  abstract: '0x166CAb679EBDB0853055522D3B523621b94029a1',
  abstractSepolia: '0xF636882f80cb5039D80F08cDEee1b166D700091b',
  bsc: '0x9F8C645f2D0b2159767Bd6E0839DE4BE49e823DE',
  pascal: '0x55f16c442907e86D764AFdc2a07C2de3BdAc8BB7',
};

const receiveUln302 = {
  mainnet: '0xc02Ab410f0734EFa3F14628780e6e695156024C2',
  sepolia: '0xdAf00F5eE2158dD58E0d3857851c432E34A3A851',
  abstract: '0x9d799c1935c51CA399e6465Ed9841DEbCcEc413E',
  abstractSepolia: '0x2443297aEd720EACED2feD76d1C6044471382EA2',
  bsc: '0xB217266c3A98C8B2709Ee26836C98cf12f6cCEC1',
  pascal: '0x188d4bbCeD671A7aA2b5055937F79510A32e9683',
};

const config: OAppOmniGraphHardhat = {
  contracts: [
    {
      contract: mainnetContract,
      config: {
        owner: DEPLOYER_ADDRESS,
        delegate: DEPLOYER_ADDRESS,
      },
    },
    {
      contract: abstractContract,
      config: {
        owner: DEPLOYER_ADDRESS,
        delegate: DEPLOYER_ADDRESS,
      },
    },
    {
      contract: bscContract,
      config: {
        owner: DEPLOYER_ADDRESS,
        delegate: DEPLOYER_ADDRESS,
      },
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
          receiveLibrary: USE_MAINNET
            ? receiveUln302.mainnet
            : receiveUln302.sepolia,
          gracePeriod: 0n,
        },
        sendConfig: {
          executorConfig: {
            executor: USE_MAINNET ? executors.mainnet : executors.sepolia,
            maxMessageSize: 10000,
          },
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.mainnet.layerZero, dvns.mainnet.nethermind]
              : [dvns.sepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.mainnet.layerZero, dvns.mainnet.nethermind]
              : [dvns.sepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: [
          {
            msgType: 1,
            optionType: ExecutorOptionType.LZ_RECEIVE,
            gas: 150000,
          },
        ],
      },
    },

    {
      from: abstractContract,
      to: mainnetContract,
      config: {
        sendLibrary: USE_MAINNET
          ? sendUln302.abstract
          : sendUln302.abstractSepolia,
        receiveLibraryConfig: {
          receiveLibrary: USE_MAINNET
            ? receiveUln302.abstract
            : receiveUln302.abstractSepolia,
          gracePeriod: 0n,
        },
        sendConfig: {
          executorConfig: {
            executor: USE_MAINNET
              ? executors.abstract
              : executors.abstractSepolia,
            maxMessageSize: 10000,
          },
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.abstract.layerZero, dvns.abstract.nethermind]
              : [dvns.abstractSepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.abstract.layerZero, dvns.abstract.nethermind]
              : [dvns.abstractSepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: [
          {
            msgType: 1,
            optionType: ExecutorOptionType.LZ_RECEIVE,
            gas: 150000,
          },
        ],
      },
    },
    {
      from: mainnetContract,
      to: bscContract,
      config: {
        sendLibrary: USE_MAINNET ? sendUln302.mainnet : sendUln302.sepolia,
        receiveLibraryConfig: {
          receiveLibrary: USE_MAINNET
            ? receiveUln302.mainnet
            : receiveUln302.sepolia,
          gracePeriod: 0n,
        },
        sendConfig: {
          executorConfig: {
            executor: USE_MAINNET ? executors.mainnet : executors.sepolia,
            maxMessageSize: 10000,
          },
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.mainnet.layerZero, dvns.mainnet.nethermind]
              : [dvns.sepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.mainnet.layerZero, dvns.mainnet.nethermind]
              : [dvns.sepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: [
          {
            msgType: 1,
            optionType: ExecutorOptionType.LZ_RECEIVE,
            gas: 150000,
          },
        ],
      },
    },
    {
      from: bscContract,
      to: mainnetContract,
      config: {
        sendLibrary: USE_MAINNET ? sendUln302.bsc : sendUln302.pascal,
        receiveLibraryConfig: {
          receiveLibrary: USE_MAINNET
            ? receiveUln302.bsc
            : receiveUln302.pascal,
          gracePeriod: 0n,
        },
        sendConfig: {
          executorConfig: {
            executor: USE_MAINNET ? executors.bsc : executors.pascal,
            maxMessageSize: 10000,
          },
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.bsc.layerZero, dvns.bsc.nethermind]
              : [dvns.pascal.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.bsc.layerZero, dvns.bsc.nethermind]
              : [dvns.pascal.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: [
          {
            msgType: 1,
            optionType: ExecutorOptionType.LZ_RECEIVE,
            gas: 150000,
          },
        ],
      },
    },
    {
      from: bscContract,
      to: abstractContract,
      config: {
        sendLibrary: USE_MAINNET ? sendUln302.bsc : sendUln302.pascal,
        receiveLibraryConfig: {
          receiveLibrary: USE_MAINNET
            ? receiveUln302.bsc
            : receiveUln302.pascal,
          gracePeriod: 0n,
        },
        sendConfig: {
          executorConfig: {
            executor: USE_MAINNET ? executors.bsc : executors.pascal,
            maxMessageSize: 10000,
          },
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.bsc.layerZero, dvns.bsc.nethermind]
              : [dvns.pascal.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.bsc.layerZero, dvns.bsc.nethermind]
              : [dvns.pascal.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: [
          {
            msgType: 1,
            optionType: ExecutorOptionType.LZ_RECEIVE,
            gas: 150000,
          },
        ],
      },
    },
    {
      from: abstractContract,
      to: bscContract,
      config: {
        sendLibrary: USE_MAINNET
          ? sendUln302.abstract
          : sendUln302.abstractSepolia,
        receiveLibraryConfig: {
          receiveLibrary: USE_MAINNET
            ? receiveUln302.abstract
            : receiveUln302.abstractSepolia,
          gracePeriod: 0n,
        },
        sendConfig: {
          executorConfig: {
            executor: USE_MAINNET
              ? executors.abstract
              : executors.abstractSepolia,
            maxMessageSize: 10000,
          },
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.abstract.layerZero, dvns.abstract.nethermind]
              : [dvns.abstractSepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 12n,
            requiredDVNs: USE_MAINNET
              ? [dvns.abstract.layerZero, dvns.abstract.nethermind]
              : [dvns.abstractSepolia.layerZero],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: [
          {
            msgType: 1,
            optionType: ExecutorOptionType.LZ_RECEIVE,
            gas: 150000,
          },
        ],
      },
    },
  ],
};

export default config;
