// const hre = require('hardhat');
import hre from 'hardhat';
require('dotenv').config();
import { exec as execBase } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execBase);

const safeAddress = process.env.GNOSIS_SAFE_ADDRESS || '';
if (!hre.ethers.utils.isAddress(safeAddress)) {
  throw new Error('GNOSIS_SAFE_ADDRESS is not defined');
}

const afterDeploy = async () => {
  const BoostMainnet = await hre.deployments.get('BoostMainnet');

  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    throw new Error('PRIVATE_KEY is not defined');
  }
  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.RPC_URL_MAINNET!,
  );
  const signer = new hre.ethers.Wallet(pk, provider);
  const boostContract = new hre.ethers.Contract(
    BoostMainnet.address,
    BoostMainnet.abi,
    signer,
  );

  // double check signer balance
  const balance = await boostContract.callStatic.balanceOf(signer.address);
  console.log(`Signer balance: ${balance.toString()}`);
  if (balance.isZero()) {
    throw new Error('Signer balance is zero');
  }
  // transfer tokens to safe.

  const txn = await boostContract.transfer(safeAddress, balance);
  console.log(`Transfering ${balance.toString()} tokens to ${safeAddress}`);
  const receipt = await txn.wait();
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Transfer complete`);
  console.log(`Safe balance: ${await boostContract.balanceOf(safeAddress)}`);
  console.log(
    `Signer balance: ${await boostContract.balanceOf(signer.address)}`,
  );

  console.log('verifying mainnet contract');
//   const result = await exec(
//     `hardhat verify --network ${process.env.NETWORK} ${BoostMainnet.address} ${BoostMainnet.args}`,
//   );

  return receipt;
};

const main = async () => {
  try {
    await hre.run('compile');
    hre;
    await afterDeploy();
  } catch (error) {
    console.error('Error in afterDeploy:', error);
    process.exit(1);
  }
};

main()
  .then(() => {
    console.log('afterDeploy completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in afterDeploy:', error);
    process.exit(1);
  });
