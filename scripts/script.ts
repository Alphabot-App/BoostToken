import { proposeBridgeBoostBsc } from "../utils/safe/propose";

const go = async () => {
  await proposeBridgeBoostBsc(process.env.GNOSIS_SAFE_ADDRESS!, process.env.BRIDGE_BOOST_AMOUNT!)
}

go();