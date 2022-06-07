// SPDX-License-Identifier: X

pragma solidity ^0.8.0;

    import "./DappToken.sol";
    import "./DaiToken.sol";

contract TokenFarm {

    string public name = "Dapp Token Farm";
    address[] public stakers;
    address public owner;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //external
    //Staking
    function stakeTokens(uint _amount) external {
        require(_amount > 0);
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        if(!hasStaked[msg.sender]) { 
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaked[msg.sender] = true;
        
    }

    //Unstake
    function unstake(uint _amount) external {
        require(_amount > 0);
        require(_amount <= stakingBalance[msg.sender]);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] - _amount;
        daiToken.transfer(msg.sender, _amount);
        if (stakingBalance[msg.sender] <= 0) {
            isStaked[msg.sender] = false;
        }
    }
    
    //only owner
    //Issue Tokens
    function issueTokens() external {
        require (msg.sender == owner);
        for(uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
            dappToken.transfer(recipient, balance);
            }
        }
    }

}