// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.17;

contract HelloWorld {
    string public yourName = "Unknown";

    event NameUpdated(string oldName, string newName);

    constructor() {
        yourName = "Unknown";
    }

    function getMessage() public view returns (string memory) {
        return string(abi.encodePacked("Hi, ", yourName));
    }

    function setName(string memory newName) public {
        string memory oldName = yourName;
        yourName = newName;
        emit NameUpdated(oldName, newName);
    }
}