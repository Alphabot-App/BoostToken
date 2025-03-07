// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract Alphabot is OFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        bool mint,
        uint256 _initialSupply
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        if (mint) {
            _mint(msg.sender, _initialSupply);
        }
    }
}
