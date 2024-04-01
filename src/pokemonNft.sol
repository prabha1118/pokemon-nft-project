//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract pokemonNft is ERC721 {
    uint256 private s_tokenCounter;
    uint256 public constant totalSupply = 10;

    error pokemonNft__TotalNftsMinted();

    constructor() ERC721("Pokemon", "POKMN") {
        s_tokenCounter = 1;
    }

    function mintNft() public {
        if (s_tokenCounter + 1 > 11) {
            revert pokemonNft__TotalNftsMinted();
        }
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmTBuBAnyGNDbBYqL7eQC33gAS8U2szKuCpMHLctMcpPKZ/";
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string.concat(baseURI, Strings.toString(tokenId), ".json")
                : "";
    }
}
