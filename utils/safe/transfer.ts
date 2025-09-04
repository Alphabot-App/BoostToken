import boostAbi from '../../artifacts/contracts/BoostMainnet.sol/BoostMainnet.json';
import { BigNumber, ethers } from 'ethers';
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities';
require('dotenv').config();
export const bridgeBoostToBsc = async (to: string, wad: string) => {
  const rpc = process.env.RPC_FOR_GNOSIS_SAFE;
  if (!rpc) throw new Error('RPC_FOR_GNOSIS_SAFE is not defined');

  const bscEid = process.env.BSC_EID;
  if (!bscEid) throw new Error('BSC_EID is not defined');

  const boostAddressMainnet = process.env.BOOST_ADDRESS_MAINNET;
  if (!boostAddressMainnet)
    throw new Error('BOOST_ADDRESS_MAINNET is not defined');
  const hotWalletAddress = process.env.SIGNER_ADDRESS;
  if (!hotWalletAddress) throw new Error('SIGNER_ADDRESS is not defined');
  const PK = process.env.GNOSIS_SAFE_PK;
  if (!PK) throw new Error('GNOSIS_SAFE_PK is not defined');

  const boostInterface = new ethers.utils.Interface(boostAbi.abi);

  const options = Options.newOptions().toBytes();

  const sendParam = {
    dstEid: bscEid,
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
    hotWalletAddress,
  ]);

  const tx = {
    to: boostAddressMainnet,
    value: nativeFee.toString(),
    data: data,
    nonce: await provider.getTransactionCount(hotWalletAddress, 'latest'),
    gasLimit: BigNumber.from(1_000_000),
    gasPrice: await provider.getGasPrice(),
    chainId: 1,
  };

  try {
    // Propose transaction to the service
    const signer = new ethers.Wallet(PK, provider);

    const res = await signer.sendTransaction(tx);

    return res.hash;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};

export const bridgeBoostToAbstract = async (to: string, wad: string) => {
  const rpc = process.env.RPC_FOR_GNOSIS_SAFE;
  if (!rpc) throw new Error('RPC_FOR_GNOSIS_SAFE is not defined');

  const eid = process.env.LAYER2_EID;
  if (!eid) throw new Error('LAYER2_EID is not defined');
  const boostAddressMainnet = process.env.BOOST_ADDRESS_MAINNET;
  if (!boostAddressMainnet)
    throw new Error('BOOST_ADDRESS_MAINNET is not defined');
  const hotWalletAddress = process.env.SIGNER_ADDRESS;
  if (!hotWalletAddress) throw new Error('SIGNER_ADDRESS is not defined');
  const PK = process.env.GNOSIS_SAFE_PK;
  if (!PK) throw new Error('GNOSIS_SAFE_PK is not defined');

  const options = Options.newOptions().toBytes();

  const sendParam = {
    dstEid: eid,
    to: addressToBytes32(to),
    amountLD: wad,
    minAmountLD: wad,
    extraOptions: options,
    composeMsg: '0x',
    oftCmd: '0x',
  };
  const boostInterface = new ethers.utils.Interface(boostAbi.abi);
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
    hotWalletAddress,
  ]);
  const tx = {
    to: boostAddressMainnet,
    value: nativeFee.toString(),
    data: data,
    nonce: await provider.getTransactionCount(hotWalletAddress, 'latest'),
    gasLimit: BigNumber.from(1_000_000),
    gasPrice: await provider.getGasPrice(),
    chainId: 1,
  };

  try {
    // Propose transaction to the service
    const signer = new ethers.Wallet(PK, provider);

    const res = await signer.sendTransaction(tx);

    return res.hash;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};

export const bridgeBoostBscToMainnet = async (to: string, wad: string) => {
  const rpc = process.env.RPC_URL_BSC;
  if (!rpc) throw new Error('RPC_URL_BSC is not defined');
  const boostAddressBsc = process.env.BOOST_ADDRESS_BSC;
  if (!boostAddressBsc) throw new Error('BOOST_ADDRESS_BSC is not defined');
  const hotWalletAddress = process.env.SIGNER_ADDRESS;
  if (!hotWalletAddress) throw new Error('SIGNER_ADDRESS is not defined');
  const PK = process.env.GNOSIS_SAFE_PK;
  if (!PK) throw new Error('GNOSIS_SAFE_PK is not defined');

  const eid = process.env.MAINNET_EID || '30101';
  if (!eid) throw new Error('MAINNET_EID is not defined');
  try {
    const options = Options.newOptions().toBytes();

    const sendParam = {
      dstEid: eid,
      to: addressToBytes32(to),
      amountLD: wad,
      minAmountLD: wad,
      extraOptions: options,
      composeMsg: '0x',
      oftCmd: '0x',
    };
    const boostInterface = new ethers.utils.Interface(boostAbi.abi);
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const contract = new ethers.Contract(
      boostAddressBsc,
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
      hotWalletAddress,
    ]);
    const tx = {
      to: boostAddressBsc,
      value: nativeFee.toString(),
      data: data,
      nonce: await provider.getTransactionCount(hotWalletAddress, 'latest'),
      gasLimit: BigNumber.from(1_000_000),
      gasPrice: await provider.getGasPrice(),
      chainId: 56,
    };

    // Propose transaction to the service
    const signer = new ethers.Wallet(PK, provider);

    const res = await signer.sendTransaction(tx);

    return res.hash;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};
