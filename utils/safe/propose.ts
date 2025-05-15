// helper functions to propose gnosis safe transactions.

import SafeApiKit from '@safe-global/api-kit';
import Safe from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType } from '@safe-global/types-kit';
import { ethers } from 'ethers';
import boostAbi from '../../artifacts/contracts/BoostMainnet.sol/BoostMainnet.json';
import { OFT } from '@layerzerolabs/lz-evm-sdk-v2';
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities';
import { send } from 'process';
require('dotenv').config();

let config: {
  apiKit: SafeApiKit;
  protocolKit: Safe;
  safeAddress: string;
  signerAddress: string;
  safeChainId: number;
  layer2ChainId: number;
  layer2Eid: number;
  boostInterface: ethers.utils.Interface;
  boostAddressMainnet: string;
  boostAddressLayer2: string;
  rpc: string;
} | null = null;

const getProtocolKit = async () => {
  if (config) {
    return config;
  }
  const RPC_URL_GS =
    process.env.RPC_FOR_GNOSIS_SAFE || 'https://rpc.sepolia.org/';

  if (!RPC_URL_GS) {
    throw new Error('RPC_FOR_GNOSIS_SAFE is not defined');
  }

  const SAFE_ADDRESS = process.env.GNOSIS_SAFE_ADDRESS;

  if (!SAFE_ADDRESS) {
    throw new Error('GNOSIS_SAFE_ADDRESS is not defined');
  }

  const SAFE_PK = process.env.GNOSIS_SAFE_PK;

  if (!SAFE_PK) {
    throw new Error('GNOSIS_SAFE_PK is not defined');
  }

  const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS;
  if (!SIGNER_ADDRESS) {
    throw new Error('SIGNER_ADDRESS is not defined');
  }

  const SAFE_CHAIN_ID = process.env.GNOSIS_SAFE_CHAIN_ID;
  if (!SAFE_CHAIN_ID) {
    throw new Error('GNOSIS_SAFE_CHAIN_ID is not defined');
  }

  const BOOST_ADDRESS_MAINNET = process.env.BOOST_ADDRESS_MAINNET;

  if (!BOOST_ADDRESS_MAINNET) {
    throw new Error('BOOST_ADDRESS_MAINNET is not defined');
  }

  const BOOST_ADDRESS_LAYER2 = process.env.BOOST_ADDRESS_LAYER2;
  if (!BOOST_ADDRESS_LAYER2) {
    throw new Error('BOOST_ADDRESS_LAYER2 is not defined');
  }

  const LAYER2_CHAIN_ID = process.env.LAYER2_CHAIN_ID;
  if (!LAYER2_CHAIN_ID) {
    throw new Error('LAYER2_CHAIN_ID is not defined');
  }

  const LAYER2_EID = process.env.LAYER2_EID;
  if (!LAYER2_EID) {
    throw new Error('LAYER2_EID is not defined');
  }

  const apiKit = new SafeApiKit({
    chainId: BigInt(SAFE_CHAIN_ID),
  });

  const protocolKit = await Safe.init({
    provider: RPC_URL_GS,
    safeAddress: SAFE_ADDRESS,
    signer: SAFE_PK,
  });

  config = {
    apiKit,
    protocolKit,
    signerAddress: SIGNER_ADDRESS,
    safeAddress: SAFE_ADDRESS,
    boostInterface: new ethers.utils.Interface(boostAbi.abi),
    safeChainId: +SAFE_CHAIN_ID,
    layer2ChainId: +LAYER2_CHAIN_ID,
    layer2Eid: +LAYER2_EID,
    boostAddressMainnet: BOOST_ADDRESS_MAINNET,
    boostAddressLayer2: BOOST_ADDRESS_LAYER2,
    rpc: RPC_URL_GS,
  };
  return config;
};

/*
 * Propose a transfer of boost tokens to a given address.
 * @param to - The address to transfer boost tokens to.
 * @param wad - The amount (wei) of boost tokens to transfer as a numeric string.
 * @returns The hash of the proposed transaction.
 */

export const proposeTransferBoost = async (to: string, wad: string) => {
  if (!ethers.utils.isAddress(to.toLowerCase())) {
    throw new Error('Invalid address');
  }

  const {
    apiKit,
    protocolKit,
    boostAddressMainnet,
    boostInterface,
    safeAddress,
    signerAddress,
  } = await getProtocolKit();

  const data = boostInterface.encodeFunctionData('transfer', [to, wad]);

  const transactionData: MetaTransactionData = {
    to: boostAddressMainnet,
    value: '0',
    data: data,
    operation: OperationType.Call,
  };
  try {
    const safeTransaction = await protocolKit.createTransaction({
      transactions: [transactionData],
    });

    const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
    console.log('Transaction hash:', safeTxHash);

    const signature = await protocolKit.signHash(safeTxHash);

    // Propose transaction to the service
    await apiKit.proposeTransaction({
      safeAddress: safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: signerAddress,
      senderSignature: signature.data,
    });
    return safeTxHash;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};

export const proposeBridgeBoostAbstract = async (to: string, wad: string) => {
  if (!ethers.utils.isAddress(to.toLowerCase())) {
    throw new Error('Invalid address');
  }

  const {
    protocolKit,
    apiKit,
    boostAddressMainnet,
    boostAddressLayer2,
    boostInterface,
    layer2Eid,
    rpc,
    safeAddress,
    signerAddress,
  } = await getProtocolKit();

  const options = Options.newOptions().toBytes();

  const sendParam = {
    dstEid: layer2Eid,
    to: addressToBytes32(to),
    amountLD: wad,
    minAmountLD: wad,
    extraOptions: options,
    composeMsg: '0x',
    oftCmd: '0x',
  };
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(
    boostAddressMainnet,
    boostInterface,
    provider,
  );
  const messageFee = await contract.quoteSend(sendParam, false);
  const nativeFee = messageFee.nativeFee;

  const data = boostInterface.encodeFunctionData('send', [
    sendParam,
    {
      nativeFee: nativeFee,
      lzTokenFee: 0,
    },
    safeAddress,
  ]);

  const transactionData = {
    to: boostAddressMainnet,
    value: nativeFee.toString(),
    data: data,
    operation: OperationType.Call,
  };

  try {
    const safeTransaction = await protocolKit.createTransaction({
      transactions: [transactionData],
    });

    const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
    console.log('Transaction hash:', safeTxHash);

    const signature = await protocolKit.signHash(safeTxHash);

    // Propose transaction to the service
    await apiKit.proposeTransaction({
      safeAddress: safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: signerAddress,
      senderSignature: signature.data,
    });
    return safeTxHash;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};
