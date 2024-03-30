// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {pokemonNft} from "../src/pokemonNft.sol";

contract DeployPokemonNft is Script {
    function run() external returns (pokemonNft) {
        vm.startBroadcast();
        pokemonNft _pokemonNft = new pokemonNft();
        vm.stopBroadcast();

        return _pokemonNft;
    }
}
