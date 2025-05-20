const hre = require('hardhat');
// import hre from 'hardhat';
import { exec as execBase } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execBase);

const verify = async () => {
  const boostMainnet = await hre.deployments.get('Boost');
  await hre.run('verify:verify', {
    address: boostMainnet.address,
    constructorArguments: [...(boostMainnet.args || [])],
    contract: 'contracts/Boost.sol:Boost',
  });

  console.log(
    `Contract verified: ${boostMainnet.address} on ${hre.network.name}`,
  );
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
