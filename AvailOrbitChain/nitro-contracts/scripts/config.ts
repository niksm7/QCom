import { ethers } from 'ethers'

// 90% of Geth's 128KB tx size limit, leaving ~13KB for proving
// This need to be adjusted for Orbit chains

// use maxDataSize=117964 for mainnet
export const maxDataSize =104857

export const config = {
  rollupConfig: {
    confirmPeriodBlocks: ethers.BigNumber.from('45818'),
    extraChallengeTimeBlocks: ethers.BigNumber.from('200'),
    stakeToken: ethers.constants.AddressZero,
    baseStake: ethers.utils.parseEther('0.001'),
    wasmModuleRoot:
      '0x3f3b4da7b5c231e6faf91ff723d235728b05c9074f2ae3cc4b3e54dd5139d34f',
    owner: '0x1234123412341234123412341234123412341234',
    loserStakeEscrow: ethers.constants.AddressZero,
    chainId: ethers.BigNumber.from('13331717'),
    chainConfig:
      '{"chainId":13331717,"homesteadBlock":0,"daoForkBlock":null,"daoForkSupport":true,"eip150Block":0,"eip150Hash":"0x0000000000000000000000000000000000000000000000000000000000000000","eip155Block":0,"eip158Block":0,"byzantiumBlock":0,"constantinopleBlock":0,"petersburgBlock":0,"istanbulBlock":0,"muirGlacierBlock":0,"berlinBlock":0,"londonBlock":0,"clique":{"period":0,"epoch":0},"arbitrum":{"EnableArbOS":true,"AllowDebugPrecompiles":false,"DataAvailabilityCommittee":false,"InitialArbOSVersion":10,"InitialChainOwner":"0x1234123412341234123412341234123412341234","GenesisBlockNum":0}}',
    genesisBlockNum: ethers.BigNumber.from('0'),
    sequencerInboxMaxTimeVariation: {
      delayBlocks: ethers.BigNumber.from('5760'),
      futureBlocks: ethers.BigNumber.from('12'),
      delaySeconds: ethers.BigNumber.from('86400'),
      futureSeconds: ethers.BigNumber.from('3600'),
    },
  },
  validators: [
    '0x1234123412341234123412341234123412341234',
    '0x1234512345123451234512345123451234512345',
  ],
  batchPosters: ['0x1234123412341234123412341234123412341234'],
  batchPosterManager: '0x1234123412341234123412341234123412341234'
}
