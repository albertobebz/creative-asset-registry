// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AssetRegistry
 * @dev A registry for creative assets with ownership management and licensing
 */
contract AssetRegistry is Ownable, Pausable {
    
    struct Registration {
        address owner;
        uint256 timestamp;
        uint64 licenseExpiresAt;
        string licenseNote;
    }
    
    // Mapping from assetId to registration details
    mapping(bytes32 => Registration) public registrations;
    
    // Mapping from assetId to owner for quick verification
    mapping(bytes32 => address) public assetOwners;
    
    // Events
    event AssetRegistered(bytes32 indexed assetId, address indexed owner, uint256 timestamp);
    event AssetTransferred(bytes32 indexed assetId, address indexed from, address indexed to);
    event LicenseSet(bytes32 indexed assetId, uint64 expiresAt, string note);
    
    // Modifiers
    modifier onlyOwnerOf(bytes32 assetId) {
        require(assetOwners[assetId] == msg.sender, "AssetRegistry: caller is not the owner");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new asset
     * @param assetId The unique identifier for the asset (keccak256 hash)
     */
    function registerAsset(bytes32 assetId) external whenNotPaused {
        require(assetOwners[assetId] == address(0), "AssetRegistry: asset already registered");
        
        assetOwners[assetId] = msg.sender;
        registrations[assetId] = Registration({
            owner: msg.sender,
            timestamp: block.timestamp,
            licenseExpiresAt: 0,
            licenseNote: ""
        });
        
        emit AssetRegistered(assetId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get registration details for an asset
     * @param assetId The unique identifier for the asset
     * @return owner The current owner of the asset
     * @return timestamp When the asset was registered
     * @return licenseExpiresAt When the license expires (0 if no license)
     * @return licenseNote The license note
     */
    function getRegistration(bytes32 assetId) external view returns (
        address owner,
        uint256 timestamp,
        uint64 licenseExpiresAt,
        string memory licenseNote
    ) {
        Registration memory reg = registrations[assetId];
        return (reg.owner, reg.timestamp, reg.licenseExpiresAt, reg.licenseNote);
    }
    
    /**
     * @dev Verify the owner of an asset
     * @param assetId The unique identifier for the asset
     * @return The address of the asset owner
     */
    function verifyOwner(bytes32 assetId) external view returns (address) {
        return assetOwners[assetId];
    }
    
    /**
     * @dev Transfer ownership of an asset
     * @param assetId The unique identifier for the asset
     * @param newOwner The new owner address
     */
    function transferAsset(bytes32 assetId, address newOwner) external onlyOwnerOf(assetId) whenNotPaused {
        require(newOwner != address(0), "AssetRegistry: new owner cannot be zero address");
        require(newOwner != msg.sender, "AssetRegistry: cannot transfer to self");
        
        address oldOwner = assetOwners[assetId];
        assetOwners[assetId] = newOwner;
        registrations[assetId].owner = newOwner;
        
        emit AssetTransferred(assetId, oldOwner, newOwner);
    }
    
    /**
     * @dev Set or update license information for an asset
     * @param assetId The unique identifier for the asset
     * @param expiresAt When the license expires (0 to remove license)
     * @param note The license note
     */
    function setLicense(bytes32 assetId, uint64 expiresAt, string calldata note) external onlyOwnerOf(assetId) whenNotPaused {
        require(expiresAt == 0 || expiresAt > block.timestamp, "AssetRegistry: license expiration must be in the future");
        
        registrations[assetId].licenseExpiresAt = expiresAt;
        registrations[assetId].licenseNote = note;
        
        emit LicenseSet(assetId, expiresAt, note);
    }
    
    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Check if an asset exists
     * @param assetId The unique identifier for the asset
     * @return True if the asset is registered
     */
    function assetExists(bytes32 assetId) external view returns (bool) {
        return assetOwners[assetId] != address(0);
    }
}
