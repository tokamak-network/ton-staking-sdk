import {TonStakingClient, ContractNames} from '../dist/mjs/index'
import { privateKeyToAccount } from 'viem/accounts'
import { toHex, parseEther } from 'viem'

import dotenv from "dotenv"
dotenv.config()

const main = async () => {

  /*
    //=============================
    const tsClientMainnet = new TonStakingClient({
      chainId: 1,
      // logLevel: 'debug'
    })

    const tsContractsMainnet = await tsClientMainnet.getContracts()

    const data = await tsClientMainnet.readContract({
        contract: tsContractsMainnet.TON,
        functionName: 'totalSupply',
      })

    console.log('Mainnet TON totalSupply ', data)
    const mContractAddresses = tsClientMainnet.getContractAddresses()
    const mslot0 = await tsClientMainnet.getStorageAt({
      address: mContractAddresses!.WTON,
      slot: toHex(0),
    })
    console.log('Mainnet WTON slot0 : ', mslot0)

    console.log('=======================')
    */
    /*
    //=============================
    // logLevel: { // 숫자가 낮을 수록 우선순위가 높습니다.
    //     error: 0, == default
    //     debug: 1,
    //     warn: 2,
    //     info: 3,
    //     data: 4,
    //     verbose: 5,
    //     silly: 6,
    //     custom: 7
    // },
    */

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`)
    const tsClientSepolia = new TonStakingClient(
      {
        chainId: 11155111,
        rpcUrl: `${process.env.ETH_NODE_URI_SEPOLIA}`,
        // logLevel: 'debug',
      },
      account  // Required when setting up walletClient. Used when sending transactions to an account.
    )

    //==============================
    const data1 = await tsClientSepolia.readContract({
        contract: ContractNames.TON,
        functionName: 'totalSupply',
      })

    console.log('Sepolia TON totalSupply ', data1)

    //==============================
    const addr = '0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2'
    const balance = await tsClientSepolia.readContract({
      contract: ContractNames.TON,
      functionName: 'balanceOf',
      args: [addr]
    })
    console.log('Sepolia '+addr+' balance ', balance)

    const contractAddresses = tsClientSepolia.getContractAddresses()

    //==============================
    const code = await tsClientSepolia.getCode({
      address: contractAddresses!.TON
    })
    console.log('Sepolia TON code.length', code?.length)
    //==============================
    // You must set your rpcUrl when creating TonStakingClient, otherwise it will fail to fetch.
    // Fetch event logs for every event
    const fromBlock = 6401948
    const toBlock = 7649618
    const logs = await tsClientSepolia.getContractEvents({
      contract: ContractNames.TON,
      eventName: 'Transfer',
      fromBlock: toHex(fromBlock),
      toBlock: toHex(toBlock)
    })
    console.log('Sepolia TON Transfer Event Counts ', logs.length)

    //==============================
    const slot0 = await tsClientSepolia.getStorageAt({
      address: contractAddresses!.WTON,
      slot: toHex(0),
    })

    console.log('Sepolia WTON slot0 : ', slot0)

    //==============================
    const res = await tsClientSepolia.simulateContract({
      contract: ContractNames.TON,
      functionName: 'balanceOf',
      args: [addr]
    })
    console.log('Sepolia '+addr+' simulate balance ', res)

    //==============================
    const to = "0xc1eba383D94c6021160042491A5dfaF1d82694E6"
    const gas = await tsClientSepolia.estimateContractGas({
      contract: ContractNames.TON,
      functionName: 'transfer',
      args: [to, parseEther('1')]
    })
    console.log('Sepolia '+addr+' transfer estimateContractGas : ', gas)
    //==============================

    const res0 = await tsClientSepolia.writeContract({
      contract: ContractNames.TON,
      functionName: 'transfer',
      args: [to, parseEther('1')]
    })
    console.log('Sepolia '+addr+' transfer hash', res0)

    //==============================
    let res1 =
     ( await tsClientSepolia.multiReadContracts({
        contracts: [
          {
            contract: ContractNames.TON,
            functionName: 'totalSupply',
          },
          {
            contract: ContractNames.TON,
            functionName: 'balanceOf',
            args: ['0xc1eba383D94c6021160042491A5dfaF1d82694E6']
          },
          {
            contract: ContractNames.SeigManager,
            functionName: 'stakeOf',
            args: ['0xc1eba383D94c6021160042491A5dfaF1d82694E6']
          },
          {
            contract: ContractNames.SeigManager,
            functionName: 'stakeOfTotal',
            args: []
          },
        ]
      })
    )?.map((v)=>v.result)

    console.log('Sepolia multiReadContracts', res1)

    //==============================
    const unwatch =  await tsClientSepolia.watchContractEvent({
      contract: ContractNames.TON,
      eventName: 'Transfer',
      onError: error => console.log(error),
      onLogs: logs => {
        console.log(logs)
        // unwatch()
      }
    })
    console.log('Sepolia watchContractEvent unwatch', unwatch)

    unwatch()

    //==============================
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
