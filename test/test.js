const { assert } = require('chai')
const simple = require('simple-mock')
const rootContext = require('./common')
const { abi: setTokenAbi } = require('../abis/SetToken.json')
const { createToken } = require('../src/lowLevelFunctions')

describe('createToken', function () {
  describe('GIVEN a symbol, name and valid (mocked)components file', () => {
    let context
    let setTokenAddress
    const components = {
      tokens: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      units: ['1000000000000000000'],
    }
    before(function () {
      const sets = { mainnet: {} }
      const fspromises = {}
      simple.mock(fspromises, 'readFile').resolveWith(JSON.stringify(components))
      simple.mock(fspromises, 'writeFile').resolveWith(undefined)
      context = { ...rootContext, sets, fspromises, setsFilePath: 'setspath.json' }
    })
    describe('WHEN creating a token', () => {
      before(() => createToken(context, 'SYMBOL', 'name', 'components.json'))
      it('THEN the sets file is updated', () => {
        assert(context.fspromises.writeFile.called)
        const newSetsPath = context.fspromises.writeFile.lastCall.args[0]
        const newSetsFile = JSON.parse(context.fspromises.writeFile.lastCall.args[1])
        setTokenAddress = newSetsFile['mainnet']['SYMBOL']
        assert.equal(newSetsPath, context.setsFilePath)
        assert(setTokenAddress)
      })
    })
    describe('contract properties', () => {
      let setTokenInstance
      before(() => {
        setTokenInstance = new rootContext.web3.eth.Contract(setTokenAbi, setTokenAddress)
      })
      it('AND trade and basicissuance modules are initialized', async () => {
        const modules = await setTokenInstance.methods.getModules().call()
        assert.include(modules, context.protocol.basicIssuanceModuleAddress)
        assert.include(modules, context.protocol.tradeModuleAddress)
      })
      it('AND the deployer is the manager', async () => {
        const manager = await setTokenInstance.methods.manager().call()
        assert.equal(manager, context.myAddress)
      })
      it('AND the components are set from the components file', async () => {
        const positions = await setTokenInstance.methods.getPositions().call()
        assert.equal(positions[0]['component'].toLowerCase(), components.tokens[0].toLowerCase())
        assert.equal(positions[0]['unit'].toLowerCase(), components.units[0].toLowerCase())
      })
    })
  })
})
