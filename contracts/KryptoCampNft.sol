// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract KryptoCampNFT is ERC721, Ownable {
  uint256 public mintPrice;
  uint256 public totalSupply;
  uint256 public maxSupply;
  uint256 public maxPerWallet;
  bool public isPublicMintEnabled;
  string internal baseTokenUri;
  address payable public withdrawWallet;
  mapping(address => uint256) public walletMints;

  constructor() payable ERC721('KtyproCampPunks', 'KCP') {
    mintPrice = 0.01 ether;
    totalSupply = 0;
    maxSupply = 999;
    maxPerWallet = 3; // 每個錢包最多買三個 NFT
  }

  function setIsPublicMintenable(bool _isPublicMintEnabled) 
    external 
    onlyOwner
  {
    isPublicMintEnabled = _isPublicMintEnabled;
  }

  function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
    baseTokenUri = _baseTokenUri;
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId), "Token does not exist!");
    return string(abi.encodePacked(baseTokenUri, Strings.toString(_tokenId), ".json"));
  }

  function withdraw() external onlyOwner {
    (bool success, ) = withdrawWallet.call{ value: address(this).balance }('');
    require(success, 'withdraw failed');
  }

  // 10000000000000000
  function mint(uint256 _quantity) public payable {
    require(isPublicMintEnabled, "Mint not enabled!");
    require(msg.value == _quantity * mintPrice, "Wrong mint value!");
    require(totalSupply + _quantity <= maxSupply, "sold out");
    require(walletMints[msg.sender] + _quantity <= maxPerWallet, "exceed max wallet");

    for (uint256 i = 0; i < _quantity; i++) {
      uint256 newTokenId = totalSupply +1;
      totalSupply++;
      _safeMint(msg.sender, newTokenId);
      walletMints[msg.sender] + _quantity;
    }
  }
}