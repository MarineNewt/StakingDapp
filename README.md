# StakingDapp
## Staking Dapp for depositing Dai to earn (Dapp Token)

Uses **2_deploy_contracts.js** to upload 3 contracts from /src/contracts/ to ganache blockchain. 
#####  Dai Token (Dai ERC 20 proxy)
#####  Dapp Token (Dapp ERC 20 proxy)
#####  Token Farm (Staking Contract) 
Then sends all Dapp tokens to the staking contract and '100' Dai to Account[1]

**tokenFarm.test.js** tests over various functionality from approving Dai to the staking contract, staking Dai, issuing Dapp Tokens from Account[0] through the staking contract, and withdrawing Dai from the contract.

**App.js** and **Main.js** compose the frontend, allowing a user to approve, stake, and withdraw their Dai to the staking contract:
<img width="959" alt="image" src="https://user-images.githubusercontent.com/38538941/172497521-ef1580a2-b6f6-4a9b-8a52-1a11ae1b0c56.png">


Versions:\
Truffle v5.1.39 (core: 5.1.39)\
Solidity - 0.8.4 (solc-js)\
Node v11.12.0\
Web3.js v1.2.1


