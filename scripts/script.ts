import { proposeBridgeBoostBsc } from "../utils/safe/propose";

const go = async () => {
  await proposeBridgeBoostBsc(process.env.SIGNER_ADDRESS!, process.env.BRIDGE_BOOST_AMOUNT!)
}

go();