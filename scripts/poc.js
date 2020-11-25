const Web3 = require('web3')
const assert = require('assert')
const fs = require('fs')
const axios = require('axios')
const lowLevelFuncs = require('../src/lowLevelFunctions')
const highLevelFuncs = require('../src/highLevelFunctions')
const { mapValues } = require('lodash')
require('dotenv').config()
const { privkey, rpcUrl, network, gasPrice } = process.env
const constants = require('../configs/constants.json')
assert(network === 'kovan' || network === 'mainnet', `network ${network} is not supported`)

const PROTOCOL_CONTRACTS_FILE = '../configs/protocol-contracts.json'
const SETS_FILE = 'sets.json'

const {
  setTokenCreatorAddress,
  tradeModuleAddress,
  basicIssuanceModuleAddress,
  assetLimitHookAddress,
} = require(PROTOCOL_CONTRACTS_FILE)[network]
const sets = JSON.parse(fs.readFileSync(SETS_FILE,'utf8'))

const web3 = new Web3(rpcUrl)
web3.eth.handleRevert = true
const { abi: setTokenCreatorAbi } = require('../abis/SetTokenCreator.json')
const { abi: basicIssuanceModuleAbi } = require('../abis/BasicIssuanceModule.json')
const { abi: setTokenAbi } = require('../abis/SetToken.json')
const { abi: tradeModuleAbi } = require('../abis/TradeModule.json')

web3.eth.accounts.wallet.add(privkey)
const myAddress = web3.eth.accounts.wallet[0].address
const creatorInstance = new web3.eth.Contract(setTokenCreatorAbi, setTokenCreatorAddress)
const basicIssuanceModuleInstance = new web3.eth.Contract(basicIssuanceModuleAbi, basicIssuanceModuleAddress)
const tradeModuleInstance = new web3.eth.Contract(tradeModuleAbi, tradeModuleAddress)

const getSetAddress = (symbol) => {
  return sets[network][symbol]
}

const getSetInstance = (symbol) => new web3.eth.Contract(setTokenAbi, getSetAddress(symbol))

const injectSetInstance = (func) => (context, ...args) => {
  const symbol = args[0]
  assert(sets[network][symbol], `there is no token with symbol ${symbol} in set file ${SETS_FILE}`)
  return func(
    { ...context, setTokenAddress: getSetAddress(symbol), setTokenInstance: getSetInstance(symbol) },
    ...args.slice(1),
  )
}

const injectContext = (func) => (...args) => {
  const context = {
    sets,
    network,
    web3,
    protocol: {
      setTokenCreatorAddress,
      tradeModuleAddress,
      basicIssuanceModuleAddress,
      assetLimitHookAddress,
      creatorInstance,
      basicIssuanceModuleInstance,
      tradeModuleInstance,
    },
    fspromises: fs.promises,
    myAddress,
    setsFilePath: SETS_FILE,
    gasPrice,
    axios,
    constants,
  }
  return func(context, ...args)
}

const methods = {
  ...mapValues(lowLevelFuncs, (it) => injectContext(it)),
  ...mapValues(highLevelFuncs, (it) => injectContext(injectSetInstance(it))),
}

const method = process.argv[2]
if (Object.keys(methods).includes(method)) {
  methods[method](...process.argv.slice(3))
} else {
  console.log('Invalid method, please invoke one of:')
  Object.keys(methods).forEach((name) => console.log(`    ${name}`))
}
