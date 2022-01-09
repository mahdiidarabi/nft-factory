// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./NFTCollectionWithBaseURI.sol";
import "./NFTCollectionURIStoragePublic.sol";
import "./NFTCollectionURIStorage.sol";


contract NFTFactory is Context {

    event CollectionWithBaseURICreated(
        address indexed nftCollection,
        string name,
        string sybmol
    );

    // event CollectionURIStoragePublicCreated(
    //     address indexed nftCollection,
    //     string name,
    //     string sybmol
    // );

    //     event CollectionURIStorageCreated(
    //     address indexed nftCollection,
    //     string name,
    //     string sybmol
    // );
    

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

    // function createNFTCollectionURIStoragePublic(string memory _name_, string memory _symbol_) public returns(address) {
    //     NFTCollectionURIStoragePublic nftCollection = new NFTCollectionURIStoragePublic(_name_, _symbol_);

    //     address nftCollectionAddr = address(nftCollection);

    //     emit CollectionURIStoragePublicCreated(
    //         nftCollectionAddr,
    //         _name_,
    //         _symbol_
    //     );

    //     return nftCollectionAddr;
    // }

    // function createNFTCollectionURIStorage(string memory _name_, string memory _symbol_) public returns(address) {
    //     NFTCollectionURIStorage nftCollection = new NFTCollectionURIStorage(_name_, _symbol_);

    //     address nftCollectionAddr = address(nftCollection);

    //     emit CollectionURIStorageCreated(
    //         nftCollectionAddr,
    //         _name_,
    //         _symbol_
    //     );

    //     return nftCollectionAddr;
    // }
}