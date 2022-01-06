// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTCollectionWithBaseURI is Ownable, ERC721 {
    
    using Strings for uint256;

    string public theBaseURI;

    constructor(string memory _name_, string memory _symbol_, string memory _baseURI_, uint256 _nftNumber_) 
        ERC721(
            _name_,
            _symbol_
        ) 
    {
        theBaseURI = _baseURI_;

        for (uint256 i = 0; i < _nftNumber_; i++) {
            _mint(_msgSender(), i);
        }
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory thisBaseURI = baseURI();
        return bytes(thisBaseURI).length > 0 ? string(abi.encodePacked(thisBaseURI, tokenId.toString(), ".json")) : "";
    }

    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //     require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    //     string memory thisBaseURI = baseURI();
    //     return thisBaseURI;
    // }

    function baseURI() public view virtual returns (string memory) {
        return theBaseURI;
    }

    // function addOperator(address account) public onlyOwner {
    //     _addOperator(account);
    // }

    // function removeOperator(address account) public onlyOwner {
    //     _removeOperator(account);
    // }

    function setURI(string memory newURI) public onlyOwner {
        theBaseURI = newURI;
    }

    // function mint(address account, uint256 id) public onlyOperator {
    //     _mint(account, id);
    // }

    // function batchMint(address account, uint256[] memory ids) public onlyOperator {

    //     for (uint256 i = 0; i < ids.length; i++) {
    //         _mint(account, ids[i]);
    //     }
        
    // }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _burn(tokenId);
    }
}