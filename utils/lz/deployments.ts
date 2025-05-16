// import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';
// // use lz and nethermind
// const chains = ['ethereum', 'bsc', 'abstract'];
// // use lz
// const testnets = ['sepolia', 'bsc-testnet', 'abstract-testnet'];
// export const getConfig = async () => {
//   const resp = await fetch('https://metadata.layerzero-api.com/v1/metadata', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await resp.json();
//   const dvns: {
//     [key: string]: { [key: string]: string };
//   } = {};
//   const executors: {
//     [key: string]: string;
//   } = {};
//   const sendUln302: {
//     [key: string]: string;
//   } = {};
//   const receiveUln302: {
//     [key: string]: string;
//   } = {};

//   for (const chain of chains) {
//     const chainData = data[chain];
//     if (chainData) {
//       dvns[chain] = chainData.dvns.fi;
//       executors[chain] = chainData.executor;
//       sendUln302[chain] = chainData.sendUln302;
//       receiveUln302[chain] = chainData.receiveUln302;
//     } else {
//       console.error(`Chain data for ${chain} not found`);
//     }
//   }
// };

// const main = async () => {
//   try {
//     await getConfig();
//   } catch (error) {
//     console.error('Error in getChainInfo:', error);
//     process.exit(1);
//   }
// };

// main()
//   .then(() => {
//     console.log('getChainInfo completed successfully');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('Error in getChainInfo:', error);
//     process.exit(1);
//   });
