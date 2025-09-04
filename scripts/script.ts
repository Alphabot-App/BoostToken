import { bridgeBoostToAbstract } from '../utils/safe/transfer';

const go = async () => {
  const tx = await bridgeBoostToAbstract(
    process.env.BRIDGE_RECEIVER_ADDRESS!,
    process.env.BRIDGE_BOOST_AMOUNT!,
  );
  console.log(`https://layerzeroscan.com/tx/${tx}`);
};

go();
