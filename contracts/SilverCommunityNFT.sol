// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Role/Operator.sol";

contract SilverCommunityNFT is Ownable, ERC721, Operator {
    
    using Strings for uint256;

    string public theBaseURI;
    string public constant NAME = "Totem Fox Lake Community NFT";
    string public constant SYMBOL = "TcFXNFT";

    constructor(string memory _baseURI_) 
        ERC721(
            NAME,
            SYMBOL
        ) 
    {
        theBaseURI = _baseURI_;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory thisBaseURI = baseURI();
        return bytes(thisBaseURI).length > 0 ? string(abi.encodePacked(thisBaseURI, tokenId.toString(), ".json")) : "";
    }

    function baseURI() public view virtual returns (string memory) {
        return theBaseURI;
    }

    function addOperator(address account) public onlyOwner {
        _addOperator(account);
    }

    function removeOperator(address account) public onlyOwner {
        _removeOperator(account);
    }

    function setURI(string memory newURI) public onlyOwner {
        theBaseURI = newURI;
    }

    function mint(address account, uint256 id) public onlyOperator {
        _mint(account, id);
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _burn(tokenId);
    }
}