// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./NFTCollectionWithBaseURI.sol";
import "./NFTCollectionWithBaseURIWithoutJson.sol";


contract NFTFactory is Context {

    event CollectionWithBaseURICreated(
        address indexed nftCollection,
        string name,
        string sybmol
    );
    

    constructor() {

    }

    function createNFTCollectionWithBaseURI(string memory _name_, string memory _symbol_, string memory _baseURI_, uint256 nftCount) public returns(address) {
        NFTCollectionWithBaseURI nftCollection = new NFTCollectionWithBaseURI(_name_, _symbol_, _baseURI_);

        nftCollection.batchMint(_msgSender(), nftCount);

        address nftCollectionAddr = address(nftCollection);

        emit CollectionWithBaseURICreated(
            nftCollectionAddr,
            _name_,
            _symbol_
        );

        return nftCollectionAddr;
    }

    function createNFTCollectionWithBaseURIWithoutJson(string memory _name_, string memory _symbol_, string memory _baseURI_, uint256 nftCount) public returns(address) {
        NFTCollectionWithBaseURIWithoutJson nftCollection = new NFTCollectionWithBaseURIWithoutJson(_name_, _symbol_, _baseURI_);

        nftCollection.batchMint(_msgSender(), nftCount);

        address nftCollectionAddr = address(nftCollection);

        emit CollectionWithBaseURICreated(
            nftCollectionAddr,
            _name_,
            _symbol_
        );

        return nftCollectionAddr;
    }
}