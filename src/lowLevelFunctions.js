const assert = require('assert')
const IERC20ABI = require('../abis/weth.json')

const getReceipt = async ({ web3 }, txhash) => {
  const recepit = await web3.eth.getTransactionReceipt(txhash)
  console.log(recepit)
  console.log(recepit.logs)
}

const createToken = async (context, symbol, name, componentsFile) => {
  const {
    fspromises,
    protocol: { creatorInstance },
    setsFilePath,
    protocol: { basicIssuanceModuleAddress, tradeModuleAddress },
    myAddress,
    sets,
    network,
    constants,
    gasPrice,
  } = context
  const components = JSON.parse(await fspromises.readFile(componentsFile, { encoding: 'utf8' }))
  assert(!sets[network][symbol], `A Set was already created with symbol: ${symbol}`)
  const tx = creatorInstance.methods.create(
    components.tokens,
    components.units,
    [basicIssuanceModuleAddress, tradeModuleAddress],
    myAddress, // I'm the manager
    name,
    symbol,
  )
  const gas = constants.gas.create || (await tx.estimateGas({ from: myAddress }))
  console.log(`tx gas limit for set creation: ${gas.toString()}`)
  const receipt = await tx.send({ from: myAddress, gas, gasPrice })
  const newSetAddress = receipt.events['SetTokenCreated'].returnValues['_setToken']
  console.log(`new set token address: ${newSetAddress}`)
  sets[network][symbol] = newSetAddress
  await fspromises.writeFile(setsFilePath, JSON.stringify(sets, null, 2))
  console.log(`new contract address saved to ${setsFilePath}`)
  console.log(`gas used: ${receipt.gasUsed}`)
  await initializeTradeModule(context, newSetAddress)
  await initializeIssuanceModule(context, newSetAddress)
}

const initializeTradeModule = async (
  { myAddress, constants, gasPrice, protocol: { tradeModuleInstance } },
  address,
) => {
  const tx = tradeModuleInstance.methods.initialize(address)
  const gas = constants.gas.initalize || (await tx.estimateGas({ from: myAddress }))
  console.log(`tx gas limit for trade module initialization: ${gas.toString()}`)
  const receipt = await tx.send({ from: myAddress, gas, gasPrice })
  console.log(`initialized trade module for contract ${address}`)
  console.log(`gas used: ${receipt.gasUsed}`)
}

const mintWeth = async ({ web3, myAddress, constants, gasPrice }, address, amount = (10 ** 16).toString()) => {
  const token = new web3.eth.Contract(IERC20ABI, address)
  const tx = token.methods.deposit()
  const gas = constants.gas.mintWeth || (await tx.estimateGas({ from: myAddress, value: amount }))
  console.log(`tx gas limit for weth mint: ${gas.toString()}`)
  const receipt = await tx.send({ from: myAddress, gas, value: amount, gasPrice })
  console.log(`minted ${amount} WETH to address: ${myAddress}`)
  console.log(`gas used: ${receipt.gasUsed}`)
}

const initializeIssuanceModule = async (
  { myAddress, constants, gasPrice, protocol: { basicIssuanceModuleInstance, assetLimitHookAddress } },
  address,
) => {
  const tx = basicIssuanceModuleInstance.methods.initialize(address, assetLimitHookAddress)
  const gas = constants.gas.initalize || (await tx.estimateGas({ from: myAddress }))
  console.log(`tx gas limit for issuance module initialization: ${gas.toString()}`)
  const receipt = await tx.send({ from: myAddress, gasPrice, gas })
  console.log(`initialized basic issuance module for contract ${address}`)
  console.log(`gas used: ${receipt.gasUsed}`)
}

module.exports = {
  initializeIssuanceModule,
  initializeTradeModule,
  mintWeth,
  getReceipt,
  createToken,
}
