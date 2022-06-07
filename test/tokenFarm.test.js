// SPDX-License-Identifier: MIT
const { assert } = require('chai')
const _deploy_contracts = require('../migrations/2_deploy_contracts')

const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', (accounts) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        //load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        await dappToken.transfer(tokenFarm.address, tokens('1000000'))
        await daiToken.transfer(accounts[1], tokens('100'), {from: accounts[0]})
    })

    describe('Mock Dai deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })
    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })
    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })
        it('contract has tokens', async () => {
            const balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
    describe('Farming Tokens', async () => {
        it('rewards for staking', async () => {
            let result 
            result = await daiToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100')), 'Correct starting amount'

            //stake
            await daiToken.approve(tokenFarm.address, tokens('1000'), {from: accounts[1]})
            await tokenFarm.stakeTokens(tokens('100'), {from: accounts[1]})

            result = await daiToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('0'), 'Correct ending amount')

            result = await tokenFarm.stakingBalance(accounts[1])
            assert.equal(result.toString(), tokens('100'), 'Correct staking balance')

            result = await tokenFarm.isStaked(accounts[1])
            assert.equal(result.toString(), 'true', 'Staker status updated')

            //issue tokens
            await tokenFarm.issueTokens({from: accounts[0]})
            result = await dappToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100'), 'Tokens issued')

            //Check for failure when investor attempts to issue tokens
            await tokenFarm.issueTokens({from: accounts[1]}).should.be.rejected;

            //unstake
            await tokenFarm.unstake(tokens('50'), {from: accounts[1]})
            result = await tokenFarm.stakingBalance(accounts[1])
            assert.equal(result.toString(), tokens('50'), 'Staking Balance updated post-withdraw')
        })
    })

})