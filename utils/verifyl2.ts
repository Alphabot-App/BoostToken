const hre = require('hardhat');

import { exec as execBase } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execBase);

const verify = async () => {
  const boostl2 = await hre.deployments.get('Boost');
  await hre.run('verify:verify', {
    address: boostl2.address,
    constructorArguments: [...(boostl2.args || [])],
    contract: 'contracts/Boost.sol:Boost',
  });

  console.log(`Contract verified: ${boostl2.address} on ${hre.network.name}`);
};

const main = async () => {
  try {
    await verify();
  } catch (error) {
    console.error('Error in verify:', error);
    process.exit(1);
  }
};

main()
  .then(() => {
    console.log('verify completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in verify:', error);
    process.exit(1);
  });
