// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

contract SBCNFT is
    Context,
    ERC721Enumerable,
    ERC721Burnable,
    ERC721Pausable,
    AccessControlEnumerable,
    Ownable
{
    using Strings for uint256;
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    Counters.Counter internal tokenIdTracker;

    string internal baseTokenURI;

    modifier onlyMinter() {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "SBCNFT: must have minter role to mint"
        );
        _;
    }

    modifier onlyPauser() {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            "SBCNFT: must have pauser role to do pause/unpause"
        );
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        baseTokenURI = _baseTokenURI;
        tokenIdTracker.increment();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(_exists(tokenId), "SBCNFT: URI query for nonexistent token");

        return
            bytes(baseTokenURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseTokenURI,
                        tokenId.toString(),
                        "/metadata.json"
                    )
                )
                : "";
    }

    function getAllTokenIdByAddress(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        require(balance != 0, "SBCNFT: Owner has no token");
        uint256[] memory res = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            res[i] = this.tokenOfOwnerByIndex(owner, i);
        }

        return res;
    }

    function pause() public virtual onlyPauser {
        _pause();
    }

    function unpause() public virtual onlyPauser {
        _unpause();
    }

    function setBaseTokenURI(string memory _baseTokenURI) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "SBCNFT: Only DEFAULT_ADMIN_ROLE can modify baseTokenURI"
        );
        baseTokenURI = _baseTokenURI;
    }

    function mint(address _to) public onlyMinter returns (uint256) {
        uint256 tokenId = tokenIdTracker.current();
        _safeMint(_to, tokenId);
        tokenIdTracker.increment();
        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._transfer(from, to, tokenId);
    }
}
