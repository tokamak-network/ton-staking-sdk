import {
    describe,
    expect,
    test,
    beforeAll,
    afterAll,
    beforeEach
} from '@jest/globals';

import {TonStakingClient} from '../dist/cjs/index'
import { toHex, parseEther, Account, WatchContractEventOnLogsFn } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import dotenv from "dotenv"
dotenv.config()

let Client: any, tsContracts:any, tsContractAddresses: any

describe('\nMainnet interface', () => {


    beforeAll(async() => {
        Client = new TonStakingClient({
            chainId: 1,
            // logLevel:'debug'
            rpcUrl: `${process.env.ETH_NODE_URI_MAINNET}`
        })

        tsContracts = await Client.getContracts()
        tsContractAddresses = Client.getContractAddresses()

    });

    test("readContract : TON.totalSupply", async () => {

        const totalSupply = await Client.readContract({
            contract: tsContracts.TON,
            functionName: 'totalSupply',
        })
        expect(totalSupply).toBeGreaterThan(0);
    });

    test("readContract : TON.balanceOf", async () => {
        const addr = '0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2'
        const balanceOf = await Client.readContract({
            contract: tsContracts.TON,
            functionName: 'balanceOf',
            args: [addr]
        })
        expect(balanceOf).toBe(0n);
    });


    test("getStorageAt : Slot(0) of WTON", async () => {
        const slot0 = await Client.getStorageAt({
            address: tsContractAddresses!.WTON,
            slot: toHex(0),
        })
        expect(slot0).toBe('0x0000000000000000000000000000000000000000000000000000000000000001');
    });

    test("getCode ", async () => {
        const code = await Client.getCode({
            address: tsContractAddresses!.TON
        })
        expect(code.length).toBeGreaterThan(0);
    });

    test("getContractEvents: TON's Transfer ", async () => {
        // You must set your rpcUrl when creating TonStakingClient, otherwise it will fail to fetch.
        // Fetch event logs for every event
        const fromBlock = 21792097
        const logs = await Client.getContractEvents({
            contract: tsContracts.TON,
            eventName: 'Transfer',
            fromBlock: toHex(fromBlock),
            toBlock: "latest"
        })

        expect(logs.length).toBeGreaterThan(0);
    });

    test("simulateContract ", async () => {
        const addr = '0x838F176D94990E06af9B57E470047F9978403195'
        const res = await Client.simulateContract({
            contract: tsContracts.TON,
            functionName: 'balanceOf',
            args: [addr]
        })
        // console.log('Sepolia '+addr+' simulate balanceOf ', res)
        expect(res.result).toBeGreaterThan(0n);
    });


    test("multiReadContracts ", async () => {
        let res = ( await Client.multiReadContracts({
            contracts: [
            {
                contract: tsContracts.TON,
                functionName: 'totalSupply',
            },
            {
                contract: tsContracts.TON,
                functionName: 'balanceOf',
                args: ['0x2be5e8c109e2197d077d13a82daead6a9b3433c5']
            },
            {
                contract: tsContracts.SeigManager,
                functionName: 'stakeOf',
                args: ['0x8aa1497d52624b75cd24294aa1b2d5886493f896']
            },
            {
                contract: tsContracts.SeigManager,
                functionName: 'stakeOfTotal',
                args: []
            },
            ]
        })
        )?.map((v:any)=>v.result)

        expect(res[0]).toBeGreaterThan(0n);
        expect(res[1]).toBeGreaterThan(0n);
        expect(res[2]).toBeGreaterThan(0n);
        expect(res[3]).toBeGreaterThan(0n);

    });

    // test("watchContractEvent ", async () => {

    //     const unwatch =  await Client.watchContractEvent({
    //         contract: tsContracts.TON,
    //         eventName: 'Transfer',
    //         onError: (error: Error)=> console.log(error),
    //         onLogs: (logs: WatchContractEventOnLogsFn) => {
    //             console.log(logs)
    //         //   unwatch()
    //         }
    //     })
    //     unwatch()
    // });

});

