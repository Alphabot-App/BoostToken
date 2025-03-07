import { EndpointId } from "@layerzerolabs/lz-definitions";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { ethers } from "hardhat";

async function bridgeToken() {
    const pk = process.env.PRIVATE_KEY!
    const sepoliaRpc = process.env.RPC_URL_SEPOLIA!
    const provider = new ethers.providers.JsonRpcProvider(sepoliaRpc);
    const signer = new ethers.Wallet(pk, provider);
    const oft = await ethers.getContractAt("Alphabot", "0x1075D3BBD826AbeF2ed9E72B04937e625FF7aFFE", signer);

    const dstChainId = 11124; // Abstract Testnet Chain ID
    const receiver = signer.address; // Receiving address on Abstract Testnet
    const amount = '1' + '0'.repeat(18); // 1 toke
    const adapterParams = "0x"; // Default, unless using custom gas settings

    // Estimate fees (LayerZero requires native gas)
    const lzEndpoint = await oft.callStatic.endpoint();
    const layerZero = await ethers.getContractAt("ILayerZeroEndpointV2", lzEndpoint, signer);
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
    const sendParam = [
        EndpointId.ABSTRACT_V2_TESTNET.toString(),
        ethers.utils.hexZeroPad(receiver, 32),
        amount,
        amount,
        options,
        "0x",
        "0x",
    ]

    
    const [nativeFee] = await oft.quoteSend(sendParam, false)
        


    console.log("Estimated Fee:", ethers.utils.formatEther(nativeFee), "ETH");

    // Send bridge transaction
    const gas = await oft.estimateGas.send(sendParam, [nativeFee, 0], receiver, { value: nativeFee });
    const gasPrice = await provider.getGasPrice();
    const tx = await oft.send(
        sendParam, 
        [nativeFee, 0],
        signer.address, 
        { value: nativeFee, gasPrice: gasPrice.mul(110).div(100), gasLimit: gas.mul(110).div(100) }
    );
       

    console.log("Transaction Hash:", tx.hash);
    await tx.wait();
    console.log("Bridging transaction successful!");
}

bridgeToken().catch(console.error);
