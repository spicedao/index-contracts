const SET_TOKEN_DECIMALS = '1000000000000000000'
const assert = require('assert')
const IERC20ABI = require('../abis/weth.json')
const constants = require('../configs/constants.json')

const getTokenInfo = async (context) => {
  const {
    setTokenInstance,
    setTokenAddress,
    web3,
    myAddress,
    protocol: { basicIssuanceModuleAddress },
  } = context
  const setInstance = setTokenInstance
  console.log(`current address: ${myAddress}`)
  console.log(
    `Token ${await setInstance.methods
      .name()
      .call()} (${await setInstance.methods.symbol().call()}) ${setTokenAddress}`,
  )
  console.log(`Enabled modules: ${await setInstance.methods.getModules().call()}`)
  console.log('positions:')
  const positions = await setInstance.methods.getPositions().call()
  console.log(positions)
  console.log(`SET balance of current address: ${await setInstance.methods.balanceOf(myAddress).call()}`)
  console.log(`SET total supply: ${await setInstance.methods.totalSupply().call()}`)
  console.log(`SET manager: ${await setInstance.methods.manager().call()}`)
  return Promise.all(
    positions
      .map((it) => it.component.toLowerCase())
      .map((address) => {
        const contract = new web3.eth.Contract(IERC20ABI, address)
        return Promise.all([
          address,
          contract.methods.balanceOf(myAddress).call(),
          contract.methods.allowance(myAddress, basicIssuanceModuleAddress).call(),
          contract.methods.balanceOf(setTokenAddress).call(),
        ])
      }),
  ).then((results) =>
    results.map(([address, balance, allowance, setContractBalance]) => {
      console.log(`\ntoken: ${address}`)
      console.log(`    balance of current address (${myAddress}): ${balance}`)
      console.log(`    allowance for issuance module address ${basicIssuanceModuleAddress}: ${allowance}`)
      console.log(`    balance of SET contract address: ${setContractBalance}`)
    }),
  )
}

const allowTokens = async (context, amount = (10 ** 19).toString()) => {
  const {
    setTokenInstance,
    web3,
    myAddress,
    gasPrice,
    protocol: { basicIssuanceModuleAddress },
  } = context
  const components = await setTokenInstance.methods.getComponents().call()
  components
    .reduce((previous, address) => {
      return previous.then(async () => {
        const contract = new web3.eth.Contract(IERC20ABI, address)
        // important: allow to the baseIssuanceModule contract
        const tx = contract.methods.approve(basicIssuanceModuleAddress, amount)
        return tx.send({ from: myAddress, gas: await tx.estimateGas(), gasPrice })
      })
    }, Promise.resolve())
    .then(() => {
      console.log(`allowed ${amount} for tokens ${components} for basic issuance module: ${basicIssuanceModuleAddress}`)
    })
}

const mintSet = async (context, amount = (10 ** 16).toString()) => {
  const {
    protocol: { basicIssuanceModuleInstance },
    setTokenAddress,
    myAddress,
    gasPrice,
  } = context
  const tx = basicIssuanceModuleInstance.methods.issue(setTokenAddress, amount, myAddress)
  console.log(`minted ${amount} tokens to address: ${myAddress}`)
  const receipt = await tx.send({ from: myAddress, gas: constants.gas.mint, gasPrice })
  console.log(`gas used: ${receipt.gasUsed}`)
}

const redeemSet = async (context, amount) => {
  const {
    setTokenInstance,
    protocol: { basicIssuanceModuleInstance },
    myAddress,
    gasPrice,
    setTokenAddress,
  } = context
  if (!amount) {
    amount = await setTokenInstance.methods.balanceOf(myAddress).call()
  }
  const tx = basicIssuanceModuleInstance.methods.redeem(setTokenAddress, amount, myAddress)
  const receipt = await tx.send({ from: myAddress, gas: constants.gas.mint, gasPrice })
  console.log(`redeemed ${amount} tokens from address: ${myAddress}`)
  console.log(`gas used: ${receipt.gasUsed}`)
}

const trade = async (context, sourceToken, sourceUnits, targetToken, minTargetUnits, slippage = '5') => {
  const {
    network,
    setTokenInstance,
    web3,
    axios,
    myAddress,
    gasPrice,
    protocol: { tradeModuleInstance },
    setTokenAddress,
  } = context
  console.log(sourceToken, sourceUnits, targetToken, minTargetUnits, slippage)
  assert(network === 'mainnet', 'trading is only supported on mainnet')
  assert(sourceToken && sourceUnits && targetToken && minTargetUnits, 'please provide all 4 arguments')
  const totalSupply = await setTokenInstance.methods.totalSupply().call()
  console.log(`total SET token supply: ${totalSupply}`)
  const sourceAmount = web3.utils
    .toBN(totalSupply)
    .mul(web3.utils.toBN(sourceUnits))
    .div(web3.utils.toBN(SET_TOKEN_DECIMALS))
    .toString()
  const minTargetAmount = web3.utils
    .toBN(totalSupply)
    .mul(web3.utils.toBN(minTargetUnits))
    .div(web3.utils.toBN(SET_TOKEN_DECIMALS))
    .toString()
  const conversionRate = web3.utils.toBN(minTargetAmount).div(web3.utils.toBN(sourceAmount)).toString()
  console.log(`Total amount of ${sourceToken} to trade: ${sourceAmount} (totalSupply* sourceUnits)`)
  console.log(`Min amount of ${targetToken} expected to return: ${minTargetAmount} (totalSupply* minTargetUnits)`)
  // if there's ever a problem with this:  https://www.npmjs.com/package/axios#query-string
  const {
    data: { data: oneInchCalldata },
  } = await axios.get(
    `https://api.1inch.exchange/v1.1/swapQuote?fromTokenAddress=${sourceToken}&toTokenAddress=${targetToken}&amount=${sourceAmount}&fromAddress=${myAddress}&slippage=${slippage}&disableEstimate=true`,
  )
  const tx = tradeModuleInstance.methods.trade(
    setTokenAddress,
    'OneInchExchangeAdapter',
    sourceToken,
    sourceUnits,
    targetToken,
    minTargetUnits,
    // strip the '0x' bytes, Buffer.from can't process them
    Uint8Array.from(Buffer.from(oneInchCalldata.slice(2), 'hex')),
  )
  // 30% on top of the estimated gas
  const gas = web3.utils
    .toBN(await tx.estimateGas())
    .mul(web3.utils.toBN(13))
    .div(web3.utils.toBN(10))
  const receipt = await tx.send({ from: myAddress, gas, gasPrice })
  console.log(`gas used: ${receipt.gasUsed}`)
}

module.exports = {
  getTokenInfo,
  allowTokens,
  mintSet,
  redeemSet,
  trade,
}
