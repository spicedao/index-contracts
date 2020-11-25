const Web3 = require('web3')
const rpcUrl = 'http://localhost:8545'
const {
  mainnet: { setTokenCreatorAddress, basicIssuanceModuleAddress, tradeModuleAddress, assetLimitHookAddress },
} = require('../configs/protocol-contracts.json')
const constants = require('../configs/constants.json')
const privkey = '0xe3eb4bebc88f17f27afccb7bdee23e755336c29a7e41f78f1bf6ee8dac995c0a'
const web3 = new Web3(rpcUrl)
web3.eth.handleRevert = true
web3.eth.accounts.wallet.add(privkey)
const myAddress = web3.eth.accounts.wallet[0].address
const { abi: setTokenCreatorAbi } = require('../abis/SetTokenCreator.json')
const { abi: basicIssuanceModuleAbi } = require('../abis/BasicIssuanceModule.json')
const { abi: tradeModuleAbi } = require('../abis/TradeModule.json')

const creatorInstance = new web3.eth.Contract(setTokenCreatorAbi, setTokenCreatorAddress)
const basicIssuanceModuleInstance = new web3.eth.Contract(basicIssuanceModuleAbi, basicIssuanceModuleAddress)
const tradeModuleInstance = new web3.eth.Contract(tradeModuleAbi, tradeModuleAddress)
module.exports = {
  privkey,
  myAddress,
  web3,
  network: 'mainnet',
  protocol: {
    setTokenCreatorAddress,
    tradeModuleAddress,
    basicIssuanceModuleAddress,
    assetLimitHookAddress,
    creatorInstance,
    basicIssuanceModuleInstance,
    tradeModuleInstance,
  },
  constants,
}
