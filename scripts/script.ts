import { bridgeBoostAbstract } from "../utils/safe/transfer";

const go = async () => {
  console.log(await bridgeBoostAbstract(process.env.BRIDGE_RECEIVER_ADDRESS!, process.env.BRIDGE_BOOST_AMOUNT!))
}

go();